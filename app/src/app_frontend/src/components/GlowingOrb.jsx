import React from "react";
import { motion } from "framer-motion";

function GlowingOrb() {
  return (
    <motion.div
      className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 shadow-2xl"
      animate={{
        y: [0, -8, 0],
        boxShadow: [
          "0 0 20px #06b6d4",
          "0 0 40px #8b5cf6",
          "0 0 20px #06b6d4",
        ],
      }}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
      }}
    />
  );
}

export default GlowingOrb;
