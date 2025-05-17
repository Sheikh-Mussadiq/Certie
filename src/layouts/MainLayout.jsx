"use client";

import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <AnimatePresence mode="wait">{children}</AnimatePresence>
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default MainLayout;
