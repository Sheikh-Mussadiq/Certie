import { supabase } from '../lib/supabase'

// Fetch notifications (paginated)
export async function fetchNotifications({ limit = 20, before } = {}) {
  let query = supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (before) {
    query = query.lt('created_at', before)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function fetchUnreadCount() {
  const { data, error } = await supabase.rpc('get_unread_notification_count')
  if (error) throw error
  return data || 0
}

export async function markAllNotificationsRead() {
  const { data, error } = await supabase.rpc('mark_all_notifications_read')
  if (error) throw error
  return data
}

export async function markNotificationsRead(ids = []) {
  if (!ids.length) return 0
  const { data, error } = await supabase.rpc('mark_notifications_read', { p_ids: ids })
  if (error) throw error
  return data
}

// Shared realtime channel + listener registry so that different UI pieces (bell, panel)
// can subscribe without stepping on each other. Previously each component created its
// own channel with the same name and removing one (on unmount) could sometimes
// terminate the other's feed before a new one was established, leading to missed
// unread count increments.
let __notificationsChannel = null
const __notificationListeners = new Set()

export function subscribeToNotifications(onInsert, onUpdate) {
  if (!__notificationsChannel) {
    __notificationsChannel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        payload => {
          for (const l of __notificationListeners) {
            l.onInsert && l.onInsert(payload.new)
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'notifications' },
        payload => {
          for (const l of __notificationListeners) {
            l.onUpdate && l.onUpdate(payload.new)
          }
        }
      )
      .subscribe()
  }

  const listener = { onInsert, onUpdate }
  __notificationListeners.add(listener)

  return () => {
    __notificationListeners.delete(listener)
    // Tear down channel only when nobody is listening anymore.
    if (__notificationListeners.size === 0 && __notificationsChannel) {
      supabase.removeChannel(__notificationsChannel)
      __notificationsChannel = null
    }
  }
}
