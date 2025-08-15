import { useEffect, useState, useCallback, useRef } from 'react'
import { X, CheckCheck, Loader2, CalendarCheck2, FileText, UploadCloud, UserPlus, RefreshCw, BellRing, AlertTriangle } from 'lucide-react'
import { fetchNotifications, markAllNotificationsRead, markNotificationsRead, subscribeToNotifications } from '../../services/notificationServices'
import clsx from 'clsx'

function formatTime(ts) {
  const d = new Date(ts)
  const now = new Date()
  const diff = (now - d) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return Math.floor(diff/60) + 'm'
  if (diff < 86400) return Math.floor(diff/3600) + 'h'
  return d.toLocaleDateString()
}

function getTypeMeta(type) {
  switch (type) {
    case 'booking_created': return { icon: CalendarCheck2, color: 'bg-blue-500', label: 'Booking' }
    case 'booking_status_changed': return { icon: RefreshCw, color: 'bg-indigo-500', label: 'Booking Status' }
    case 'invoice_created': return { icon: FileText, color: 'bg-amber-500', label: 'Invoice' }
    case 'document_uploaded': return { icon: UploadCloud, color: 'bg-emerald-500', label: 'Document' }
    case 'property_assigned': return { icon: UserPlus, color: 'bg-teal-500', label: 'Assignment' }
    case 'service_due': return { icon: AlertTriangle, color: 'bg-orange-500', label: 'Service Due' }
    default: return { icon: BellRing, color: 'bg-gray-400', label: 'Notice' }
  }
}

function highlightBody(n) {
  const meta = n.meta || {}
  if (n.type === 'service_due' && meta.service_name && meta.property_name) {
    return (
      <span className='text-xs text-gray-600 leading-snug'>
        Your <strong className='text-gray-800'>{meta.service_name}</strong> for <strong className='text-gray-800'>{meta.property_name}</strong> is due in <strong className='text-gray-800'>{meta.days_remaining} day{meta.days_remaining === 1 ? '' : 's'}</strong>.
      </span>
    )
  }
  return n.body ? <span className='text-xs text-gray-600 leading-snug'>{n.body}</span> : null
}

function NotificationItem({ n, onToggle }) {
  const { icon: Icon, color, label } = getTypeMeta(n.type)
  const unread = !n.read_at
  return (
    <div className={clsx('group relative flex gap-3 rounded-md p-3 ring-1 ring-transparent transition bg-white/70 backdrop-blur-sm hover:bg-white shadow-sm hover:shadow-md', unread ? 'border border-gray-200' : 'border border-transparent opacity-80')}>
      <div className='flex flex-col items-center'>
        <div className={clsx('h-8 w-8 rounded-md flex items-center justify-center text-white shadow', color)}>
          <Icon className='w-4 h-4' />
        </div>
        <span className='mt-1 text-[9px] font-medium uppercase tracking-wide text-gray-400'>{label}</span>
      </div>
      <div className='flex-1 min-w-0'>
        <div className='flex items-start justify-between gap-2'>
          <h4 className={clsx('text-sm font-semibold tracking-tight', unread ? 'text-gray-900' : 'text-gray-700')}>{n.title}</h4>
          <div className='flex items-center gap-2'>
            <time className='text-[10px] font-medium text-gray-400'>{formatTime(n.created_at)}</time>
            {unread && (
              <button onClick={() => onToggle(n)} className='text-[10px] font-medium text-blue-600 hover:text-blue-700'>Mark</button>
            )}
          </div>
        </div>
        <div className='mt-0.5'>{highlightBody(n)}</div>
      </div>
      {unread && <span className='absolute top-2 right-2 block h-2 w-2 rounded-full bg-blue-500' />}
      <span className={clsx('absolute left-0 top-0 h-full w-1 rounded-l-md transition', unread ? color : 'bg-transparent group-hover:bg-gray-200')} />
    </div>
  )
}

// Module-level simple cache to avoid re-fetching every open/close
let __notificationCache = null
let __notificationCacheEnd = false
const PAGE_SIZE = 20
export default function NotificationPanel({ onClose }) {
  const [items, setItems] = useState(() => __notificationCache || [])
  const [loading, setLoading] = useState(!__notificationCache)
  const [loadingMore, setLoadingMore] = useState(false)
  const [end, setEnd] = useState(__notificationCacheEnd)
  const containerRef = useRef(null)
  const inFlightRef = useRef(false)

  const load = useCallback(async (initial=false) => {
    if (inFlightRef.current) return
    if (!initial && (loadingMore || end)) return
    inFlightRef.current = true
    if (initial) {
      setLoading(true)
    } else {
      setLoadingMore(true)
    }
    try {
      const before = initial ? undefined : items[items.length-1]?.created_at
      const data = await fetchNotifications({ limit: PAGE_SIZE, before })
      if (initial) {
        setItems(data)
        __notificationCache = data
      } else {
        setItems(prev => {
          const merged = [...prev, ...data]
          __notificationCache = merged
          return merged
        })
      }
      if (data.length < PAGE_SIZE) {
        setEnd(true)
        __notificationCacheEnd = true
      }
    } catch(e) { /* swallow */ }
    finally {
      if (initial) {
        setLoading(false)
      } else {
        setLoadingMore(false)
      }
      inFlightRef.current = false
    }
  }, [items, loadingMore, end])

  // Initial fetch only if no cache
  useEffect(() => {
    if (!__notificationCache) {
      load(true)
    }
  }, [load])

  useEffect(() => {
    const unsub = subscribeToNotifications(n => {
      setItems(prev => {
        const next = [n, ...prev]
        __notificationCache = next
        return next
      })
    })
    return () => unsub()
  }, [])

  const handleMarkAll = async () => {
    try {
      await markAllNotificationsRead()
      setItems(prev => {
        const next = prev.map(n => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
        __notificationCache = next
        return next
      })
  // Trigger global unread count refresh
  window.dispatchEvent(new CustomEvent('notifications-unread-sync'))
    } catch {}
  }

  const handleToggle = async (n) => {
    try {
      await markNotificationsRead([n.id])
      setItems(prev => {
        const next = prev.map(i => i.id === n.id ? { ...i, read_at: new Date().toISOString() } : i)
        __notificationCache = next
        return next
      })
  window.dispatchEvent(new CustomEvent('notifications-unread-sync'))
    } catch {}
  }

  // Infinite scroll
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const handler = () => {
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 24) {
        if (items.length >= PAGE_SIZE && !end) {
          load(false)
        }
      }
    }
    el.addEventListener('scroll', handler)
    return () => el.removeEventListener('scroll', handler)
  }, [load, items.length, end])

  return (
    <div className='absolute right-4 top-16 w-[380px] max-h-[72vh] z-[60]'>
      <div className='relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-200/70 bg-white/80 backdrop-blur-xl shadow-xl ring-1 ring-gray-900/5'>
        <div className='flex items-center justify-between border-b border-gray-200/70 px-4 py-2.5 bg-white/60 backdrop-blur-sm'>
          <h3 className='text-sm font-semibold tracking-tight'>Notifications</h3>
          <div className='flex items-center gap-2'>
            <button onClick={handleMarkAll} className='inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-blue-600 hover:bg-blue-50'>
              <CheckCheck className='w-3 h-3' /> All
            </button>
            <button onClick={onClose} className='inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-gray-100'>
              <X className='w-4 h-4 text-gray-500' />
            </button>
          </div>
        </div>
        {loading ? (
          <div className='flex flex-1 items-center justify-center p-6'>
            <Loader2 className='w-5 h-5 animate-spin text-gray-400' />
          </div>
        ) : (
          <div ref={containerRef} className='flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400'>
            {items.length === 0 && <p className='text-xs text-gray-500 text-center py-6'>No notifications</p>}
            {items.map(n => (
              <NotificationItem key={n.id} n={n} onToggle={handleToggle} />
            ))}
            {loadingMore && <p className='text-center text-[11px] text-gray-400 py-2'>Loading…</p>}
            {end && items.length > 0 && <p className='text-center text-[10px] text-gray-400 py-2'>End of list</p>}
          </div>
        )}
      </div>
    </div>
  )
}
