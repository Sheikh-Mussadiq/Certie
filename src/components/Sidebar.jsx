import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutGrid,
  Building2,
  BookText,
  Users,
  CalendarDays,
  FileText,
  Calendar,
  Settings,
  Folder,
} from "lucide-react";
import { SiOverleaf } from "react-icons/si";
import Logo from "../assets/Logo.png";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const { currentUser } = useAuth();

  const isPathActive = (path) => {
    return location.pathname.startsWith(path);
  };

  const menuItems = [
    { icon: LayoutGrid, label: "Overview", path: "/overview" },
    { icon: Building2, label: "Properties", path: "/properties" },
    // { icon: BookText, label: "Logbooks", path: "/logbooks" },
    // { icon: BookText, label: "Logbooks", path: "/logbooks", badge: "2" },
    // { icon: Users, label: "Directory", path: "/directory" },
    { icon: CalendarDays, label: "Bookings", path: "/bookings" },
    { icon: FileText, label: "Documents", path: "/documents" },
    { icon: FileText, label: "Invoices", path: "/invoices" },
    { icon: Calendar, label: "Calendar", path: "/calendar" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <div className="w-64 bg-primary-black h-screen p-4 flex flex-col fixed overflow-y-auto">
      <Link to="/" className="flex items-center gap-2 px-2 mb-8">
        <img src={Logo} alt="Certie Logo" className="h-8 w-8" />
        <span className="text-2xl font-bold text-white">Certie.co</span>
      </Link>

      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors relative ${
                    isPathActive(item.path)
                      ? "bg-primary-orange text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-white/10 text-xs px-2 py-0.5 rounded">
                      {item.badge}
                    </span>
                  )}
                  {isPathActive(item.path) && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-primary-orange rounded-lg -z-10"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* <div className="mt-auto">
        <div className="bg-[#1E1F20] rounded-lg p-4 text-sm text-gray-400">
          <div className="flex justify-between items-center mb-2">
            <span>20 days left</span>
            <button className="text-gray-500 hover:text-white">&times;</button>
          </div>
          <p className="mb-3">
            Upgrade to premium and enjoy the benefits for a long time.
          </p>
          <button className="w-full bg-white/10 text-white py-1.5 rounded hover:bg-white/20 transition-colors">
            View plan
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default Sidebar;
