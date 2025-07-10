import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  DollarSign,
  ArrowDownCircle,
  ArrowUpCircle,
  Gift,
  User,
  UserX,
} from "lucide-react";
import CountUp from "react-countup";
import useAppStore from "../store";
import GlowingOrb from "../components/GlowingOrb";
import FloatingTokens from "../components/FloatingTokens";
import { useAuth } from "../context/AuthContext";
import { useBackend } from "../hooks/useBackend";

function Dashboard() {
  const navigate = useNavigate();
  const { btcBalance, deposits, activeLoans, rewards } = useAppStore();
  const { isAuthenticated, principal, loading } = useAuth();
  const { balance, formatBalance, formatPrincipal } = useBackend();

  const cardVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
  };

  const cards = [
    {
      label: "ICP Balance",
      value: isAuthenticated ? balance : 0,
      icon: DollarSign,
      gradient: "from-pink-500 via-orange-400 to-yellow-500",
      route: "/",
      suffix: " sats",
    },
    {
      label: "Deposits",
      value: deposits,
      icon: ArrowDownCircle,
      gradient: "from-cyan-400 via-blue-500 to-purple-600",
      route: "/deposit",
      suffix: "",
    },
    {
      label: "Active Loans",
      value: activeLoans,
      icon: ArrowUpCircle,
      gradient: "from-orange-400 via-pink-500 to-red-500",
      route: "/borrow",
      suffix: "",
    },
    {
      label: "Rewards",
      value: rewards,
      icon: Gift,
      gradient: "from-green-400 via-emerald-500 to-teal-400",
      route: "/farming",
      suffix: "",
    },
  ];

  return (
    <div className="space-y-12 relative overflow-hidden">
      {/* ✨ Floating Background Tokens */}
      <FloatingTokens count={14} />

      {/* 🌟 Animated Glowing Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-purple-600/10 to-transparent blur-3xl opacity-20 animate-pulse"></div>

      <motion.div
        className="flex justify-center items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
          Welcome to BitFinance
        </h1>
        <GlowingOrb />
      </motion.div>

      {/* Authentication Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex justify-center"
      >
        {loading ? (
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/60 rounded-lg">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-400"></div>
            <span className="text-gray-300">Loading...</span>
          </div>
        ) : isAuthenticated ? (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-800/60 rounded-lg">
            <User className="w-4 h-4 text-green-400" />
            <span className="text-green-400">Connected</span>
            <span className="text-gray-300">
              ({formatPrincipal(principal)})
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2 bg-red-800/60 rounded-lg">
            <UserX className="w-4 h-4 text-red-400" />
            <span className="text-red-400">Not Connected</span>
            <button
              onClick={() => navigate("/connect")}
              className="ml-2 px-2 py-1 bg-cyan-500 text-white rounded text-sm hover:bg-cyan-600 transition-colors"
            >
              Connect
            </button>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            variants={cardVariants}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className={`relative p-6 rounded-2xl cursor-pointer overflow-hidden border border-gray-800 shadow-xl hover:scale-[1.04] transition-all backdrop-blur-xl bg-gray-900/60`}
            onClick={() => navigate(card.route)}
          >
            <div
              className={`absolute -inset-1 bg-gradient-to-br ${card.gradient} opacity-25 blur-2xl animate-pulse`}
            ></div>

            <div className="flex items-center gap-4 relative z-10">
              <card.icon className="w-10 h-10 text-white drop-shadow-lg" />
              <div>
                <h2 className="text-lg font-semibold">{card.label}</h2>
                <p className="text-3xl font-bold text-white">
                  <CountUp
                    end={card.value}
                    decimals={card.suffix === " sats" ? 0 : 4}
                    duration={1.2}
                    separator=","
                  />
                  {card.suffix}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
