import React from "react";
import { motion } from "framer-motion";
import { DollarSign, Bitcoin, Wallet, Gift } from "lucide-react";
import { SiEthereum } from "react-icons/si";

function FloatingTokens() {
  const icons = [DollarSign, Bitcoin, Wallet, Gift, SiEthereum];

  return (
    <div className="absolute inset-0 overflow-hidden -z-0 pointer-events-none">
      {icons.map((Icon, index) => (
        <motion.div
          key={index}
          className="absolute text-white opacity-15"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{ y: [0, -500] }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5,
          }}
        >
          <Icon size={26} />
        </motion.div>
      ))}
    </div>
  );
}

export default FloatingTokens;
