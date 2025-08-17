import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchUnreadCount,
  subscribeToNotifications,
} from "../../services/notificationServices";

export default function NotificationBell({ onClick, isOpen }) {
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let unsub;
    let mounted = true;
    const loadCount = async () => {
      try {
        const count = await fetchUnreadCount();
        if (mounted) setUnread(count);
      } catch {
        /* ignore */
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadCount();

    // Listen to custom sync events (fallback when realtime UPDATE not received)
    const syncHandler = () => loadCount();
    window.addEventListener("notifications-unread-sync", syncHandler);

    unsub = subscribeToNotifications(
      () => setUnread((c) => c + 1),
      (n) => {
        if (n.read_at) setUnread((c) => Math.max(0, c - 1));
      }
    );

    return () => {
      mounted = false;
      window.removeEventListener("notifications-unread-sync", syncHandler);
      unsub && unsub();
    };
  }, []);

  return (
    <motion.button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative p-2.5 rounded-full transition-colors duration-200 group ${
        isOpen
          ? "bg-primary-orange/10 text-primary-orange"
          : "hover:bg-gray-100 text-gray-600"
      }`}
      aria-label="Notifications"
      data-notification-bell="true"
    >
      <motion.div
        animate={{ rotate: isHovered ? [0, -10, 10, 0] : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <Bell
          className={`w-5 h-5 transition-colors duration-200 ${
            isOpen
              ? "text-primary-orange"
              : "text-gray-600 group-hover:text-gray-800"
          }`}
        />
      </motion.div>

      <AnimatePresence>
        {!loading && unread > 0 && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute -top-0.5 -right-0.5 bg-primary-red text-white rounded-full text-[11px] px-1.5 py-1.5 font-bold shadow-card ring-2 ring-white min-w-[20px] h-[20px] flex items-center justify-center"
          >
            {unread > 99 ? "99+" : unread}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
