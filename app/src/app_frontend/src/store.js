import { create } from 'zustand';

// App-wide centralised state store using Zustand
const useAppStore = create((set) => ({
  // Global state variables
  btcBalance: 0.0,
  deposits: 0.0,
  activeLoans: 0.0,
  rewards: 0.0,
  transactions: [],

  // Function to update one or multiple balances
  setBalances: ({ btc, deposits, loans, rewards }) =>
    set((state) => ({
      btcBalance: btc !== undefined ? btc : state.btcBalance,
      deposits: deposits !== undefined ? deposits : state.deposits,
      activeLoans: loans !== undefined ? loans : state.activeLoans,
      rewards: rewards !== undefined ? rewards : state.rewards,
    })),

  // Function to add a new transaction to transaction history
  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [...state.transactions, transaction],
    })),
}));

export default useAppStore;
