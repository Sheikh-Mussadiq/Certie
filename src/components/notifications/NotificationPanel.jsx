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
        color: "from-blue-500 to-blue-600",
        label: "Booking",
      };
    case "booking_status_changed":
      return {
        icon: RefreshCw,
        color: "from-indigo-500 to-indigo-600",
        label: "Status",
      };
    case "invoice_created":
      return {
        icon: FileText,
        color: "from-amber-500 to-amber-600",
        label: "Invoice",
      };
    case "document_uploaded":
      return {
        icon: UploadCloud,
        color: "from-emerald-500 to-emerald-600",
        label: "Document",
      };
    case "property_assigned":
      return {
        icon: UserPlus,
        color: "from-teal-500 to-teal-600",
        label: "Assignment",
      };
    case "service_due":
      return {
        icon: AlertTriangle,
        color: "from-orange-500 to-orange-600",
        label: "Service Due",
      };
    case "logbook_due":
      return {
        icon: AlertTriangle,
        color: "from-rose-500 to-rose-600",
        label: "Logbook Due",
      };
    default:
      return {
        icon: BellRing,
        color: "from-gray-500 to-gray-600",
        label: "Notice",
      };
  }
}

function highlightBody(n) {
  const meta = n.meta || {};
  if (n.type === "service_due" && meta.service_name && meta.property_name) {
    return (
      <span className="text-xs text-gray-600 leading-relaxed">
        Your <strong className="text-gray-800">{meta.service_name}</strong> for{" "}
        <strong className="text-gray-800">{meta.property_name}</strong> is due
        in{" "}
        <strong className="text-gray-800">
          {meta.days_remaining} day{meta.days_remaining === 1 ? "" : "s"}
        </strong>
        .
      </span>
    );
  }
  if (n.type === "logbook_due" && meta.property_name) {
    return (
      <span className="text-xs text-gray-600 leading-relaxed">
        <strong className="text-gray-800">
          {meta.logbook_type || "Logbook"}
        </strong>{" "}
        (<span className="text-gray-700">{meta.frequency}</span>) for{" "}
        <strong className="text-gray-800">{meta.property_name}</strong> is due{" "}
        <strong className="text-gray-800">tomorrow</strong>.
      </span>
    );
  }
  return n.body ? (
    <span className="text-xs text-gray-600 leading-relaxed">{n.body}</span>
  ) : null;
}

function NotificationItem({ n, onToggle, index, onNavigate }) {
  const { icon: Icon, color, label } = getTypeMeta(n.type);
  const unread = !n.read_at;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        ...(unread && {
          boxShadow:
            "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 10px 10px -5px rgba(59, 130, 246, 0.04)",
        }),
      }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
        ease: "easeOut",
      }}
      whileHover={{
        scale: 1.02,
        y: -2,
        transition: { duration: 0.2 },
      }}
      onClick={() => onNavigate(n)}
      className={clsx(
        "group relative flex gap-4 rounded-xl p-4 transition-all duration-200 cursor-pointer",
        unread
          ? "bg-grey-fill shadow-card border-2 border-primary-orange hover:shadow-lg hover:border-primary-orange/80"
          : "bg-grey-fill hover:bg-grey-outline border border-grey-outline"
      )}
    >
      <div className="flex flex-col items-center flex-shrink-0">
        <motion.div
          className={clsx(
            "h-10 w-10 rounded-xl flex items-center justify-center text-white shadow-lg",
            `bg-gradient-to-br ${color}`
          )}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.2 }}
        >
          <Icon className="w-5 h-5" />
        </motion.div>
        <span className="mt-2 text-[10px] font-medium uppercase tracking-wider text-gray-400 text-center">
          {label}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <h4
            className={clsx(
              "text-sm font-semibold tracking-tight leading-tight",
              unread ? "text-gray-900" : "text-gray-700"
            )}
          >
            {n.title}
          </h4>
          {unread && (
            <motion.button
              onClick={() => onToggle(n)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-xs font-medium text-primary-orange hover:text-primary-orange/80 hover:bg-primary-orange/10 px-2 py-1 rounded-md transition-colors duration-200"
            >
              Mark read
            </motion.button>
          )}
        </div>
        <div className="mt-2">{highlightBody(n)}</div>

        {/* Date positioned at bottom right */}
        <div className="mt-3 flex justify-end">
          <time className="text-[10px] font-medium text-gray-400">
            {formatTime(n.created_at)}
          </time>
        </div>
      </div>

      <motion.div
        className={clsx(
          "absolute left-0 top-0 h-full rounded-l-xl transition-all duration-200",
          unread
            ? "w-1.5 bg-primary-orange"
            : "w-0 bg-transparent group-hover:bg-grey-outline"
        )}
        whileHover={{ width: unread ? 6 : 4 }}
      />
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
      initial={{ opacity: 0, scale: 0.95, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="absolute right-24 top-16 w-[420px] h-[75vh] max-h-[600px] min-h-[400px] z-[60]"
    >
      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-grey-outline/20">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between border-b border-grey-outline px-6 py-4 bg-white"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary-orange flex items-center justify-center">
              <BellRing className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold tracking-tight text-gray-900">
              Notifications
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              onClick={handleMarkAll}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-primary-orange hover:bg-primary-orange/10 transition-colors duration-200"
            >
              <CheckCheck className="w-4 h-4" /> Mark all read
            </motion.button>
          </div>
        </motion.div>

        {/* Content */}
        {loading ? (
          <motion.div
            className="flex flex-1 items-center justify-center p-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary-orange" />
              <p className="text-sm text-gray-500">Loading notifications...</p>
            </div>
          </motion.div>
        ) : (
          <div
            ref={containerRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 min-h-0"
          >
            <AnimatePresence mode="popLayout">
              {items.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <BellRing className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">No notifications yet</p>
                  <p className="text-xs text-gray-400 mt-1">
                    We'll notify you when something important happens
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
              <motion.div
                className="text-center py-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Loader2 className="w-5 h-5 animate-spin text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-400">Loading more...</p>
              </motion.div>
            )}

            {end && items.length > 0 && (
              <motion.div
                className="text-center py-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-xs text-gray-400">
                  You're all caught up! 🎉
                </p>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
