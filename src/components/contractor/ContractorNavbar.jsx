"use client";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ProfileDropdown from "../ProfileDropdown";
import LogoWithNoBG from "../../assets/logowithoutbg.png";

const ContractorNavbar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`${
          isScrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm"
            : "bg-white/80 backdrop-blur-sm"
        } sticky top-0 z-50 transition-all duration-300 border-b border-grey-outline`}
      >
        <div className="w-full px-4 mx-auto">
          <div className="flex items-center justify-between h-16">
            <Link to="/contractor">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2"
              >
                <img src={LogoWithNoBG} alt="" className="w-6 sm:w-8" />
                <div className="flex items-center space-x-2">
                  <p className="text-primary-black text-base sm:text-xl font-semibold">
                    Certie.co
                  </p>
                </div>
              </motion.div>
            </Link>

            <div className="flex items-center space-x-4">
              <ProfileDropdown />
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Floating Notice Banner - Visible on all screen sizes */}
      <div className="fixed top-16 left-0 right-0 z-40 pointer-events-none">
        <div className="flex justify-center px-2 sm:px-4">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="pointer-events-auto"
          >
            <div className="bg-secondary-black backdrop-blur-sm border border-primary-orange-300 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 shadow-lg">
              <div className="flex items-center justify-center gap-2">
                <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary-orange animate-pulse flex-shrink-0"></span>
                <span className="text-white text-xs sm:text-sm font-medium text-center whitespace-nowrap">
                  <span className="font-semibold">Notice:</span> We are
                  currently operating in{" "}
                  <span className="underline font-bold">London only</span>!
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ContractorNavbar;
