import React from "react";
import { motion } from "framer-motion";
import useAppStore from "../store";
import { List } from "lucide-react";

function History() {
  const { transactions } = useAppStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-10"
    >
      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 text-center">
        Transaction History
      </h1>

      <List className="w-16 h-16 text-blue-400 mx-auto" />

      {transactions.length === 0 ? (
        <p className="text-center text-gray-400">No transactions yet.</p>
      ) : (
        <div className="max-w-3xl mx-auto space-y-4">
          {transactions.map((tx, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-4 rounded-xl bg-gray-800/80 border border-gray-700 shadow flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-semibold">{tx.type}</h2>
                <p className="text-gray-400 text-sm">{tx.date}</p>
              </div>
              <p
                className={`font-bold ${
                  tx.type.includes("Deposit")
                    ? "text-green-400"
                    : tx.type.includes("Borrow")
                    ? "text-pink-400"
                    : "text-emerald-400"
                }`}
              >
                {tx.amount} BTC
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default History;
