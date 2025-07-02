import React from "react";
import { motion } from "framer-motion";
import useAppStore from "../store";
import { Gift } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

function YieldFarm() {
  const { rewards, setBalances, addTransaction } = useAppStore();

  const handleFarm = () => {
    const newReward = rewards + 0.005;
    setBalances({ rewards: newReward });

    addTransaction({
      type: "Reward Farmed",
      amount: 0.005,
      date: new Date().toLocaleString(),
    });

    toast.success("Farmed 0.005 BTC rewards!");
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

      <p className="text-2xl">Current Rewards: {rewards.toFixed(4)} BTC</p>

      <div className="flex justify-center gap-6">
        <button
          onClick={handleFarm}
          className="px-6 py-3 rounded-lg font-bold bg-gradient-to-r from-green-400 to-emerald-500 hover:scale-105 transition-all text-white"
        >
          Farm More
        </button>

        <button
          onClick={handleRedeem}
          className="px-6 py-3 rounded-lg font-bold bg-gradient-to-r from-pink-500 to-red-500 hover:scale-105 transition-all text-white"
        >
          Redeem
        </button>
      </div>
    </motion.div>
  );
}

export default YieldFarm;
