import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import { fetchUnreadCount, subscribeToNotifications } from '../../services/notificationServices'

export default function NotificationBell({ onClick }) {
  const [unread, setUnread] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsub
    let mounted = true
    const loadCount = async () => {
      try {
        const count = await fetchUnreadCount()
        if (mounted) setUnread(count)
      } catch { /* ignore */ }
      finally { if (mounted) setLoading(false) }
    }

    loadCount()

    // Listen to custom sync events (fallback when realtime UPDATE not received)
    const syncHandler = () => loadCount()
    window.addEventListener('notifications-unread-sync', syncHandler)

    unsub = subscribeToNotifications(
      () => setUnread(c => c + 1),
      (n) => { if (n.read_at) setUnread(c => Math.max(0, c - 1)) }
    )

    return () => {
      mounted = false
      window.removeEventListener('notifications-unread-sync', syncHandler)
      unsub && unsub()
    }
  }, [])

  return (
    <button onClick={onClick} className='relative p-2 rounded hover:bg-gray-100 transition' aria-label='Notifications'>
      <Bell className='w-5 h-5 text-gray-600' />
      { !loading && unread > 0 && (
        <span className='absolute -top-0.5 -right-0.5 bg-red-500 text-white rounded-full text-[10px] px-1.5 py-0.5 font-medium'>{unread}</span>
      ) }
    </button>
  )
}
