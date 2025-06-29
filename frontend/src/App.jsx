import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Dashboard from "./pages/Dashboard";
import Deposit from "./pages/Deposit";
import Borrow from "./pages/Borrow";
import YieldFarm from "./pages/YieldFarm";
import History from "./pages/History";
import ConnectWallet from "./pages/ConnectWallet";
import FloatingTokens from "./components/FloatingTokens";
import { Toaster } from "react-hot-toast";
import BtcTicker from "./components/BtcTicker";

function AppContent() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col relative overflow-hidden">

      {/* Floating background icons */}
      <FloatingTokens />

      {/* BTC Ticker */}
      <BtcTicker />

      {/* Toast notifications */}
      <Toaster position="top-right" />

      {/* Header */}
      <header className="flex items-center justify-between p-6 bg-gray-800 shadow relative z-10">
        <h1 className="text-4xl font-bold">BitFinance</h1>
        <nav className="space-x-6">
          <Link to="/" className="text-cyan-400 hover:text-white">Dashboard</Link>
          <Link to="/deposit" className="text-cyan-400 hover:text-white">Deposit</Link>
          <Link to="/borrow" className="text-cyan-400 hover:text-white">Borrow</Link>
          <Link to="/farming" className="text-cyan-400 hover:text-white">Farming</Link>
          <Link to="/history" className="text-cyan-400 hover:text-white">History</Link>
          <Link to="/connect" className="text-cyan-400 hover:text-white">Connect Wallet</Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-6 py-8 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/deposit" element={<Deposit />} />
              <Route path="/borrow" element={<Borrow />} />
              <Route path="/farming" element={<YieldFarm />} />
              <Route path="/history" element={<History />} />
              <Route path="/connect" element={<ConnectWallet />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="p-4 bg-gray-800 text-center text-gray-400 text-sm relative z-10">
        © 2025 BitFinance. All rights reserved.
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
