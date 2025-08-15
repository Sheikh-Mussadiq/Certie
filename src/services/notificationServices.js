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

export function subscribeToNotifications(onInsert, onUpdate) {
  const channel = supabase
    .channel('notifications-changes')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, payload => {
      onInsert?.(payload.new)
    })
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'notifications' }, payload => {
      onUpdate?.(payload.new)
    })
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}
