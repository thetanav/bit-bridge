import React from "react";
import { motion } from "framer-motion";
import useAppStore from "../store";
import { Gift } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useBackend } from "../hooks/useBackend";

function YieldFarm() {
  const { rewards, setBalances, addTransaction } = useAppStore();
  const { isAuthenticated } = useAuth();
  const { performYieldFarm, loading, balance, formatBalance } = useBackend();

  const handleFarm = async () => {
    if (!isAuthenticated) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      await performYieldFarm();

      // Update local store for UI consistency
      const newReward = rewards + 0.005;
      setBalances({ rewards: newReward });

      addTransaction({
        type: "Reward Farmed",
        amount: 0.005,
        date: new Date().toLocaleString(),
      });
    } catch (error) {
      console.error("Yield farm failed:", error);
    }
  };

  const handleRedeem = () => {
    if (rewards === 0) {
      toast.error("No rewards to redeem!");
      return;
    }

    setBalances({ rewards: 0 });

    addTransaction({
      type: "Reward Redeemed",
      amount: rewards,
      date: new Date().toLocaleString(),
    });

    toast.success("Rewards successfully redeemed!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-10 text-center relative"
    >
      {/* Toast container */}
      <Toaster position="top-center" reverseOrder={false} />

      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
        Yield Farming
      </h1>

      <Gift className="w-20 h-20 text-green-400 mx-auto" />

      {/* Current Balance Display */}
      {isAuthenticated && (
        <div className="max-w-md mx-auto p-4 bg-gray-800/50 rounded-lg">
          <p className="text-sm text-gray-400 mb-1">Current Balance</p>
          <p className="text-2xl font-bold text-cyan-400">
            {formatBalance(balance)} sats
          </p>
        </div>
      )}

      <p className="text-2xl">Current Rewards: {rewards.toFixed(4)} BTC</p>

      {/* Authentication Warning */}
      {!isAuthenticated && (
        <div className="max-w-md mx-auto p-4 bg-red-800/20 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-sm">
            Please connect your wallet to participate in yield farming
          </p>
        </div>
      )}

      <div className="flex justify-center gap-6">
        <button
          onClick={handleFarm}
          disabled={!isAuthenticated || loading}
          className="px-6 py-3 rounded-lg font-bold bg-gradient-to-r from-green-400 to-emerald-500 hover:scale-105 transition-all text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Farming...
            </div>
          ) : (
            "Farm More"
          )}
        </button>

        <button
          onClick={handleRedeem}
          disabled={!isAuthenticated}
          className="px-6 py-3 rounded-lg font-bold bg-gradient-to-r from-pink-500 to-red-500 hover:scale-105 transition-all text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          Redeem
        </button>
      </div>
    </motion.div>
  );
}

export default YieldFarm;
