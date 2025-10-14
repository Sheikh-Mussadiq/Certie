"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Logo from "../assets/Logo.png";

const MainLayout = ({ children }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen flex bg-primary-black">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Main content container with margin */}
      <div className="flex-1 flex flex-col lg:ml-64 m-2 sm:m-4 min-w-0">
        {/* Container with rounded corners and shadow */}
        <div className="bg-white rounded-2xl shadow-sm flex flex-col overflow-hidden h-full">
          {/* Mobile Logo Header */}
          {/* <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center">
            <Link
              to="/home"
              className="flex items-center group hover:scale-105 transition-transform duration-300"
            >
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <img src={Logo} alt="Logo" className="w-10 h-10" />
              </motion.div>
            </Link>
          </div> */}

          {/* Navbar container */}
          <div className="z-10">
            <Navbar onToggleSidebar={toggleSidebar} />
          </div>
          {/* Main content with padding and overflow handling */}
          <main className="flex-grow p-2 sm:p-4 bg-grey-fill overflow-x-auto h-[calc(100vh-10rem)] lg:h-[calc(100vh-10rem)]">
            <AnimatePresence mode="wait">{children}</AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
