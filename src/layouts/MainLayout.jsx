"use client";

import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const MainLayout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-primary-black">
      <Sidebar />
      {/* Main content container with margin */}
      <div className="flex-1 flex flex-col ml-64 m-4 min-w-0">
        {/* Container with rounded corners and shadow */}
        <div className="bg-white rounded-2xl shadow-sm flex flex-col overflow-hidden h-full">
          {/* Navbar container */}
          <div className="z-10">
            <Navbar />
          </div>
          {/* Main content with padding and overflow handling */}
          <main className="flex-grow p-4 bg-grey-fill overflow-x-auto">
            <AnimatePresence mode="wait">{children}</AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
