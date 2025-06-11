import React from "react";
import { motion } from "framer-motion";

const Shimmer = ({ className }) => {
  return (
    <div
      className={`relative overflow-hidden rounded bg-gray-200 ${className}`}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-50/50 to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
        }}
      />
    </div>
  );
};

export default Shimmer;
