import React from "react";
import { motion } from "framer-motion";
import { Wallet } from "lucide-react";
import FloatingTokens from "../components/FloatingTokens";
import toast, { Toaster } from "react-hot-toast";

function ConnectWallet() {
  const handleConnect = () => {
    toast.success("Wallet connected successfully!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="relative space-y-10 text-center"
    >
      <FloatingTokens />
      <Toaster position="top-center" />

      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500">
        Connect Your Plug Wallet
      </h1>

      <div className="max-w-md mx-auto p-10 rounded-3xl bg-gray-900/80 border border-gray-800 shadow-2xl backdrop-blur space-y-8 relative overflow-hidden">
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-yellow-500 opacity-20 blur-3xl animate-pulse pointer-events-none"></div>

        <Wallet className="w-16 h-16 text-white mx-auto drop-shadow-lg" />

        <p className="text-lg text-gray-300">
          Connect your Plug Wallet to access all features and track your assets.
        </p>

        <button
          onClick={handleConnect}
          className="w-full py-3 rounded-lg font-bold text-lg bg-gradient-to-r from-pink-500 to-yellow-500 hover:scale-[1.04] transition-all text-white"
        >
          Connect Wallet
        </button>
      </div>
    </motion.div>
  );
}

export default ConnectWallet;
