import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import FloatingTokens from "../components/FloatingTokens";
import useAppStore from "../store";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useBackend } from "../hooks/useBackend";

function Deposit() {
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [activeTab, setActiveTab] = useState("deposit");
  const { deposits, setBalances, addTransaction } = useAppStore();
  const { isAuthenticated } = useAuth();
  const { depositFunds, withdrawFunds, loading, balance, formatBalance } =
    useBackend();

  const handleDeposit = async () => {
    if (!isAuthenticated) {
      toast.error("Please connect your wallet first");
      return;
    }

    const numericAmount = parseInt(depositAmount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      await depositFunds(numericAmount);

      // Update local store for UI consistency
      setBalances({
        btc: 0,
        deposits: deposits + numericAmount,
        loans: 0,
        rewards: 0,
      });

      // Add transaction record
      addTransaction({
        type: "Deposit",
        amount: numericAmount,
        date: new Date().toLocaleString(),
      });

      setDepositAmount(""); // Clear input
    } catch (error) {
      console.error("Deposit failed:", error);
    }
  };

  const handleWithdraw = async () => {
    if (!isAuthenticated) {
      toast.error("Please connect your wallet first");
      return;
    }

    const numericAmount = parseInt(withdrawAmount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      await withdrawFunds(numericAmount);

      // Update local store for UI consistency
      setBalances({
        btc: 0,
        deposits: Math.max(0, deposits - numericAmount),
        loans: 0,
        rewards: 0,
      });

      // Add transaction record
      addTransaction({
        type: "Withdraw",
        amount: numericAmount,
        date: new Date().toLocaleString(),
      });

      setWithdrawAmount(""); // Clear input
    } catch (error) {
      console.error("Withdraw failed:", error);
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

      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 text-center">
        Manage Funds
      </h1>

      <div className="max-w-lg mx-auto p-8 rounded-3xl bg-gray-900/80 border border-gray-800 shadow-xl backdrop-blur space-y-6 relative overflow-hidden">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 opacity-20 blur-3xl animate-pulse pointer-events-none"></div>

        {/* Tab Navigation */}
        <div className="flex rounded-lg bg-gray-800/50 p-1">
          <button
            onClick={() => setActiveTab("deposit")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "deposit"
                ? "bg-cyan-500 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Deposit
          </button>
          <button
            onClick={() => setActiveTab("withdraw")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "withdraw"
                ? "bg-purple-500 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Withdraw
          </button>
        </div>

        <div className="flex items-center gap-4">
          {activeTab === "deposit" ? (
            <>
              <ArrowDownCircle className="w-10 h-10 text-cyan-400 drop-shadow-lg" />
              <h2 className="text-2xl font-semibold">Deposit Funds</h2>
            </>
          ) : (
            <>
              <ArrowUpCircle className="w-10 h-10 text-purple-400 drop-shadow-lg" />
              <h2 className="text-2xl font-semibold">Withdraw Funds</h2>
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
              Please connect your wallet to make deposits
            </p>
          </div>
        )}

        {activeTab === "deposit" ? (
          <>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="Enter amount in sats"
              className="w-full p-4 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-cyan-500 outline-none"
              disabled={!isAuthenticated}
            />

            <button
              onClick={handleDeposit}
              disabled={!isAuthenticated || loading}
              className="w-full py-3 rounded-lg font-bold bg-gradient-to-r from-cyan-500 to-purple-600 hover:scale-[1.02] transition-all text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Depositing...
                </div>
              ) : (
                "Deposit Now"
              )}
            </button>
          </>
        ) : (
          <>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Enter amount in sats"
              className="w-full p-4 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
              disabled={!isAuthenticated}
            />

            <button
              onClick={handleWithdraw}
              disabled={!isAuthenticated || loading}
              className="w-full py-3 rounded-lg font-bold bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-[1.02] transition-all text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Withdrawing...
                </div>
              ) : (
                "Withdraw Now"
              )}
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}

export default Deposit;
