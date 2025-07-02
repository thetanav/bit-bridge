import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpCircle } from "lucide-react";
import FloatingTokens from "../components/FloatingTokens";
import useAppStore from "../store";
import { toast } from "react-hot-toast";

function Borrow() {
  const [amount, setAmount] = useState("");
  const { activeLoans, setBalances, addTransaction } = useAppStore();

  const handleBorrow = () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    // Update active loans balance
    setBalances({
      btc: 0, // leave unchanged
      deposits: 0, // leave unchanged
      loans: activeLoans + numericAmount,
      rewards: 0, // leave unchanged
    });

    // Add transaction record
    addTransaction({
      type: "Borrow",
      amount: numericAmount,
      date: new Date().toLocaleString(),
    });

    toast.success(`Successfully borrowed ${numericAmount} BTC`);
    setAmount(""); // Clear input
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="relative space-y-10"
    >
      <FloatingTokens />

      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-red-500 text-center">
        Borrow Funds
      </h1>

      <div className="max-w-lg mx-auto p-8 rounded-3xl bg-gray-900/80 border border-gray-800 shadow-xl backdrop-blur space-y-6 relative overflow-hidden">
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-red-500 opacity-20 blur-3xl animate-pulse pointer-events-none"></div>

        <div className="flex items-center gap-4">
          <ArrowUpCircle className="w-10 h-10 text-white drop-shadow-lg" />
          <h2 className="text-2xl font-semibold">Take a Loan</h2>
        </div>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter BTC amount"
          className="w-full p-4 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-pink-500 outline-none"
        />

        <button
          onClick={handleBorrow}
          className="w-full py-3 rounded-lg font-bold bg-gradient-to-r from-pink-500 to-red-500 hover:scale-[1.02] transition-all text-white"
        >
          Borrow Now
        </button>
      </div>
    </motion.div>
  );
}

export default Borrow;
