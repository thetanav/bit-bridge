import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import FloatingTokens from "../components/FloatingTokens";
import useAppStore from "../store";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useBackend } from "../hooks/useBackend";

function Borrow() {
  const [borrowAmount, setBorrowAmount] = useState("");
  const [lendAmount, setLendAmount] = useState("");
  const [activeTab, setActiveTab] = useState("borrow");
  const { activeLoans, setBalances, addTransaction } = useAppStore();
  const { isAuthenticated } = useAuth();
  const { borrowFunds, lendFunds, loading, balance, formatBalance } =
    useBackend();

  const handleBorrow = async () => {
    if (!isAuthenticated) {
      toast.error("Please connect your wallet first");
      return;
    }

    const numericAmount = parseInt(borrowAmount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      await borrowFunds(numericAmount);

      // Update local store for UI consistency
      setBalances({
        btc: 0,
        deposits: 0,
        loans: activeLoans + numericAmount,
        rewards: 0,
      });

      // Add transaction record
      addTransaction({
        type: "Borrow",
        amount: numericAmount,
        date: new Date().toLocaleString(),
      });

      setBorrowAmount(""); // Clear input
    } catch (error) {
      console.error("Borrow failed:", error);
    }
  };

  const handleLend = async () => {
    if (!isAuthenticated) {
      toast.error("Please connect your wallet first");
      return;
    }

    const numericAmount = parseInt(lendAmount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      await lendFunds(numericAmount);

      // Update local store for UI consistency
      setBalances({
        btc: 0,
        deposits: 0,
        loans: activeLoans,
        rewards: 0,
      });

      // Add transaction record
      addTransaction({
        type: "Lend",
        amount: numericAmount,
        date: new Date().toLocaleString(),
      });

      setLendAmount(""); // Clear input
    } catch (error) {
      console.error("Lend failed:", error);
    }
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
        Borrow & Lend
      </h1>

      <div className="max-w-lg mx-auto p-8 rounded-3xl bg-gray-900/80 border border-gray-800 shadow-xl backdrop-blur space-y-6 relative overflow-hidden">
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-red-500 opacity-20 blur-3xl animate-pulse pointer-events-none"></div>

        {/* Tab Navigation */}
        <div className="flex rounded-lg bg-gray-800/50 p-1">
          <button
            onClick={() => setActiveTab("borrow")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "borrow"
                ? "bg-pink-500 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Borrow
          </button>
          <button
            onClick={() => setActiveTab("lend")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "lend"
                ? "bg-green-500 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Lend
          </button>
        </div>

        <div className="flex items-center gap-4">
          {activeTab === "borrow" ? (
            <>
              <ArrowUpCircle className="w-10 h-10 text-pink-400 drop-shadow-lg" />
              <h2 className="text-2xl font-semibold">Take a Loan</h2>
            </>
          ) : (
            <>
              <ArrowDownCircle className="w-10 h-10 text-green-400 drop-shadow-lg" />
              <h2 className="text-2xl font-semibold">Lend Funds</h2>
            </>
          )}
        </div>

        {/* Current Balance Display */}
        {isAuthenticated && (
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <p className="text-sm text-gray-400 mb-1">Current Balance</p>
            <p className="text-2xl font-bold text-cyan-400">
              {formatBalance(balance)} sats
            </p>
          </div>
        )}

        {/* Authentication Warning */}
        {!isAuthenticated && (
          <div className="p-4 bg-red-800/20 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">
              Please connect your wallet to {activeTab} funds
            </p>
          </div>
        )}

        {activeTab === "borrow" ? (
          <>
            <input
              type="number"
              value={borrowAmount}
              onChange={(e) => setBorrowAmount(e.target.value)}
              placeholder="Enter amount in sats"
              className="w-full p-4 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-pink-500 outline-none"
              disabled={!isAuthenticated}
            />

            <button
              onClick={handleBorrow}
              disabled={!isAuthenticated || loading}
              className="w-full py-3 rounded-lg font-bold bg-gradient-to-r from-pink-500 to-red-500 hover:scale-[1.02] transition-all text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Borrowing...
                </div>
              ) : (
                "Borrow Now"
              )}
            </button>
          </>
        ) : (
          <>
            <input
              type="number"
              value={lendAmount}
              onChange={(e) => setLendAmount(e.target.value)}
              placeholder="Enter amount in sats"
              className="w-full p-4 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
              disabled={!isAuthenticated}
            />

            <button
              onClick={handleLend}
              disabled={!isAuthenticated || loading}
              className="w-full py-3 rounded-lg font-bold bg-gradient-to-r from-green-500 to-emerald-500 hover:scale-[1.02] transition-all text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Lending...
                </div>
              ) : (
                "Lend Now"
              )}
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}

export default Borrow;
