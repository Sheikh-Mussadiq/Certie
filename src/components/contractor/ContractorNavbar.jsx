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
              <img src={LogoWithNoBG} alt="" className="w-8" />
              <div className="flex items-center space-x-2">
                <p className="text-primary-black text-xl font-semibold">
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
  );
};

export default ContractorNavbar;
