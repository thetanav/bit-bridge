import React from "react";
import { motion } from "framer-motion";
import { Wallet, LogOut, User } from "lucide-react";
import FloatingTokens from "../components/FloatingTokens";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useBackend } from "../hooks/useBackend";

function ConnectWallet() {
  const { isAuthenticated, principal, loading, login, logout } = useAuth();
  const { formatPrincipal, balance, formatBalance } = useBackend();

  const handleConnect = async () => {
    try {
      await login();
      toast.success("Successfully connected to Internet Identity!");
    } catch (error) {
      toast.error("Failed to connect. Please try again.");
    }
  };

  const handleDisconnect = async () => {
    try {
      await logout();
      toast.success("Successfully disconnected!");
    } catch (error) {
      toast.error("Failed to disconnect. Please try again.");
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="relative space-y-10 text-center"
      >
        <FloatingTokens />
        <div className="max-w-md mx-auto p-10 rounded-3xl bg-gray-900/80 border border-gray-800 shadow-2xl backdrop-blur space-y-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="text-lg text-gray-300">Connecting...</p>
        </div>
      </motion.div>
    );
  }

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
        {isAuthenticated
          ? "ICP Wallet Connected"
          : "Connect to Internet Identity"}
      </h1>

      <div className="max-w-md mx-auto p-10 rounded-3xl bg-gray-900/80 border border-gray-800 shadow-2xl backdrop-blur space-y-8 relative overflow-hidden">
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-yellow-500 opacity-20 blur-3xl animate-pulse pointer-events-none"></div>

        {isAuthenticated ? (
          <>
            <User className="w-16 h-16 text-green-400 mx-auto drop-shadow-lg" />

            <div className="space-y-4">
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Principal ID</p>
                <p className="text-lg font-mono text-white">
                  {formatPrincipal(principal)}
                </p>
              </div>

              <div className="p-4 bg-gray-800/50 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Balance</p>
                <p className="text-2xl font-bold text-cyan-400">
                  {formatBalance(balance)} sats
                </p>
              </div>
            </div>

            <button
              onClick={handleDisconnect}
              className="w-full py-3 rounded-lg font-bold text-lg bg-gradient-to-r from-red-500 to-orange-500 hover:scale-[1.04] transition-all text-white flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              Disconnect
            </button>
          </>
        ) : (
          <>
            <Wallet className="w-16 h-16 text-white mx-auto drop-shadow-lg" />

            <p className="text-lg text-gray-300">
              Connect with Internet Identity to access all features and track
              your Bitcoin assets on the Internet Computer.
            </p>

            <button
              onClick={handleConnect}
              className="w-full py-3 rounded-lg font-bold text-lg bg-gradient-to-r from-pink-500 to-yellow-500 hover:scale-[1.04] transition-all text-white"
            >
              Connect with Internet Identity
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}

export default ConnectWallet;
