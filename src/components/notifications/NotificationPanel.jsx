import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  CheckCheck,
  Loader2,
  CalendarCheck2,
  FileText,
  UploadCloud,
  UserPlus,
  RefreshCw,
  BellRing,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationsRead,
  subscribeToNotifications,
} from "../../services/notificationServices";
import clsx from "clsx";

function formatTime(ts) {
  const d = new Date(ts);
  const now = new Date();
  const diff = (now - d) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return Math.floor(diff / 60) + "m";
  if (diff < 86400) return Math.floor(diff / 3600) + "h";
  return d.toLocaleDateString();
}

function getTypeMeta(type) {
  switch (type) {
    case "booking_created":
      return {
        icon: CalendarCheck2,
        color: "text-blue-600",
        label: "Booking",
      };
    case "booking_status_changed":
      return {
        icon: RefreshCw,
        color: "text-indigo-600",
        label: "Status",
      };
    case "invoice_created":
      return {
        icon: FileText,
        color: "text-amber-600",
        label: "Invoice",
      };
    case "document_uploaded":
      return {
        icon: UploadCloud,
        color: "text-emerald-600",
        label: "Document",
      };
    case "property_assigned":
      return {
        icon: UserPlus,
        color: "text-teal-600",
        label: "Assignment",
      };
    case "service_due":
      return {
        icon: AlertTriangle,
        color: "text-orange-600",
        label: "Service Due",
      };
    case "logbook_due":
      return {
        icon: AlertTriangle,
        color: "text-rose-600",
        label: "Logbook Due",
      };
    default:
      return {
        icon: BellRing,
        color: "text-gray-600",
        label: "Notice",
      };
  }
}

function highlightBody(n) {
  const meta = n.meta || {};
  if (n.type === "service_due" && meta.service_name && meta.property_name) {
    return (
      <p className="text-sm text-gray-600 leading-relaxed">
        Your{" "}
        <span className="font-medium text-gray-900">{meta.service_name}</span>{" "}
        for{" "}
        <span className="font-medium text-gray-900">{meta.property_name}</span>{" "}
        is due in{" "}
        <span className="font-semibold text-gray-900">
          {meta.days_remaining} day{meta.days_remaining === 1 ? "" : "s"}
        </span>
        .
      </p>
    );
  }
  if (n.type === "logbook_due" && meta.property_name) {
    return (
      <p className="text-sm text-gray-600 leading-relaxed">
        <span className="font-medium text-gray-900">
          {meta.logbook_type || "Logbook"}
        </span>{" "}
        (<span className="text-gray-700">{meta.frequency}</span>) for{" "}
        <span className="font-medium text-gray-900">{meta.property_name}</span>{" "}
        is due <span className="font-semibold text-gray-900">tomorrow</span>.
      </p>
    );
  }
  return n.body ? (
    <p className="text-sm text-gray-600 leading-relaxed">{n.body}</p>
  ) : null;
}

function NotificationItem({ n, onToggle, index, onNavigate }) {
  const { icon: Icon, color } = getTypeMeta(n.type);
  const unread = !n.read_at;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        duration: 0.2,
        delay: index * 0.03,
        ease: [0.4, 0, 0.2, 1],
      }}
      onClick={() => onNavigate(n)}
      className={clsx(
        "group relative flex gap-3 p-4 transition-all duration-200 cursor-pointer border-b border-gray-100 last:border-b-0",
        unread
          ? "bg-blue-50/30 hover:bg-blue-50/50"
          : "bg-white hover:bg-gray-50/50"
      )}
    >
      {/* Unread indicator dot */}
      {unread && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-orange rounded-r-full" />
      )}

      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">
        <div className="h-9 w-9 rounded-lg flex items-center justify-center bg-gray-100">
          <Icon className={clsx("w-4 h-4", color)} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4
            className={clsx(
              "text-sm font-medium leading-snug",
              unread ? "text-gray-900" : "text-gray-700"
            )}
          >
            {n.title}
          </h4>
          <time className="text-xs text-gray-400 flex-shrink-0">
            {formatTime(n.created_at)}
          </time>
        </div>

        <div className="">{highlightBody(n)}</div>

        {/* Action button */}
        {unread && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(n);
            }}
            className="text-xs text-primary-orange hover:text-primary-orange/80 font-medium transition-colors"
          >
            Mark as read
          </button>
        )}
      </div>
    </motion.div>
  );
}

// Module-level simple cache to avoid re-fetching every open/close
let __notificationCache = null;
let __notificationCacheEnd = false;
const PAGE_SIZE = 10;

export default function NotificationPanel({ onClose }) {
  const navigate = useNavigate();
  const [items, setItems] = useState(() => __notificationCache || []);
  const [loading, setLoading] = useState(!__notificationCache);
  const [loadingMore, setLoadingMore] = useState(false);
  const [end, setEnd] = useState(__notificationCacheEnd);
  const containerRef = useRef(null);
  const inFlightRef = useRef(false);
  const panelRef = useRef(null);

  // Handle click outside to close panel
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside the panel
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        // Also check if the click is not on the notification bell
        const bellButton = event.target.closest("[data-notification-bell]");
        if (!bellButton) {
          onClose();
        }
      }
    };

    // Add event listener with a small delay to prevent immediate closure
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const load = useCallback(
    async (initial = false) => {
      if (inFlightRef.current) return;
      if (!initial && (loadingMore || end)) return;
      inFlightRef.current = true;
      if (initial) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      try {
        const before = initial
          ? undefined
          : items[items.length - 1]?.created_at;
        const data = await fetchNotifications({ limit: PAGE_SIZE, before });
        if (initial) {
          setItems(data);
          __notificationCache = data;
        } else {
          setItems((prev) => {
            const merged = [...prev, ...data];
            __notificationCache = merged;
            return merged;
          });
        }
        if (data.length < PAGE_SIZE) {
          setEnd(true);
          __notificationCacheEnd = true;
        }
      } catch (e) {
        /* swallow */
      } finally {
        if (initial) {
          setLoading(false);
        } else {
          setLoadingMore(false);
        }
        inFlightRef.current = false;
      }
    },
    [items, loadingMore, end]
  );

  // Initial fetch only if no cache
  useEffect(() => {
    if (!__notificationCache) {
      load(true);
    }
  }, [load]);

  useEffect(() => {
    const unsub = subscribeToNotifications((n) => {
      setItems((prev) => {
        const next = [n, ...prev];
        __notificationCache = next;
        return next;
      });
    });
    return () => unsub();
  }, []);

  const handleMarkAll = async () => {
    try {
      await markAllNotificationsRead();
      setItems((prev) => {
        const next = prev.map((n) => ({
          ...n,
          read_at: n.read_at || new Date().toISOString(),
        }));
        __notificationCache = next;
        return next;
      });
      // Trigger global unread count refresh
      window.dispatchEvent(new CustomEvent("notifications-unread-sync"));
    } catch {}
  };

  const handleToggle = async (n) => {
    try {
      await markNotificationsRead([n.id]);
      setItems((prev) => {
        const next = prev.map((i) =>
          i.id === n.id ? { ...i, read_at: new Date().toISOString() } : i
        );
        __notificationCache = next;
        return next;
      });
      window.dispatchEvent(new CustomEvent("notifications-unread-sync"));
    } catch {}
  };

  // Navigation handler based on notification type
  const handleNavigate = (notification) => {
    // Mark as read when navigating
    if (!notification.read_at) {
      handleToggle(notification);
    }

    const meta = notification.meta || {};

    // Handle different notification types
    switch (notification.type) {
      case "invoice_created":
        // Navigate to invoices page
        navigate("/invoices");
        break;

      case "booking_created":
      case "booking_status_changed":
        // Navigate to bookings page, potentially with filter for the specific booking
        if (meta.property_id) {
          navigate(`/properties/${meta.property_id}/assessments`);
        } else {
          navigate("/bookings");
        }
        break;

      case "service_due":
        // Navigate to property page if property_id is available
        if (meta.property_id) {
          navigate(`/properties/${meta.property_id}/assessments`);
        } else {
          navigate("/properties");
        }
        break;
      case "logbook_due":
        // Navigate to property page if property_id is available
        if (meta.property_id) {
          navigate(`/properties/${meta.property_id}/logbooks`);
        } else {
          navigate("/properties");
        }
        break;

      case "document_uploaded":
        // Navigate to documents page
        if (meta.property_id) {
          navigate(`/properties/${meta.property_id}/documents`);
        } else {
          navigate("/documents");
        }
        break;

      case "property_assigned":
        // Navigate to properties page
        if (meta.property_id) {
          navigate(`/properties/${meta.property_id}`);
        } else {
          navigate("/properties");
        }
        break;

      default:
        // Default to dashboard for unknown notification types
        navigate("/");
    }

    // Close notification panel after navigation
    onClose();
  };

  // Infinite scroll
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = () => {
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 24) {
        if (items.length >= PAGE_SIZE && !end) {
          load(false);
        }
      }
    };
    el.addEventListener("scroll", handler);
    return () => el.removeEventListener("scroll", handler);
  }, [load, items.length, end]);

  return (
    <motion.div
      ref={panelRef}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className="absolute right-24 top-16 w-[440px] h-[75vh] max-h-[640px] min-h-[400px] z-[60]"
    >
      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-200/50">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 bg-white">
          <div className="flex items-center gap-2.5">
            <h3 className="text-base font-semibold text-gray-900">
              Notifications
            </h3>
          </div>
          <button
            onClick={handleMarkAll}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-primary-orange transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all read
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-7 h-7 animate-spin text-primary-orange" />
              <p className="text-sm text-gray-500">Loading...</p>
            </div>
          </div>
        ) : (
          <div
            ref={containerRef}
            className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent min-h-0"
          >
            <AnimatePresence mode="popLayout">
              {items.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-16 px-6"
                >
                  <div className="w-14 h-14 mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                    <BellRing className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    No notifications
                  </p>
                  <p className="text-xs text-gray-500 text-center">
                    You're all caught up!
                  </p>
                </motion.div>
              )}

              {items.map((n, index) => (
                <NotificationItem
                  key={n.id}
                  n={n}
                  onToggle={handleToggle}
                  onNavigate={handleNavigate}
                  index={index}
                />
              ))}
            </AnimatePresence>

            {loadingMore && (
              <div className="flex items-center justify-center py-4 border-t border-gray-100">
                <Loader2 className="w-4 h-4 animate-spin text-gray-400 mr-2" />
                <p className="text-xs text-gray-500">Loading more...</p>
              </div>
            )}

            {end && items.length > 0 && (
              <div className="text-center py-4 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  You're all caught up! 🎉
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
