import React, { createContext, useContext, useEffect, useState } from "react";
import backendService from "../../services/backend";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [principal, setPrincipal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);

  // Initialize backend service and check authentication status
  useEffect(() => {
    const initialize = async () => {
      try {
        await backendService.initialize();
        setIsAuthenticated(backendService.isAuthenticated);

        if (backendService.isAuthenticated) {
          const userPrincipal = await backendService.getPrincipal();
          setPrincipal(userPrincipal);
          await fetchBalance(userPrincipal);
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        toast.error("Failed to initialize authentication");
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const fetchBalance = async (userPrincipal) => {
    try {
      const principalToUse = userPrincipal || principal;
      if (principalToUse) {
        const userBalance = await backendService.getBalance(principalToUse);
        setBalance(userBalance);
      }
    } catch (error) {
      console.error("Failed to fetch balance:", error);
      toast.error("Failed to fetch balance");
    }
  };

  const login = async () => {
    try {
      setLoading(true);
      await backendService.login();
      setIsAuthenticated(true);

      const userPrincipal = await backendService.getPrincipal();
      setPrincipal(userPrincipal);
      await fetchBalance(userPrincipal);

      toast.success("Successfully logged in!");
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please try again.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await backendService.logout();
      setIsAuthenticated(false);
      setPrincipal(null);
      setBalance(0);
      toast.success("Successfully logged out!");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deposit = async (amount) => {
    try {
      const result = await backendService.deposit(amount);
      await fetchBalance();
      toast.success("Deposit successful!");
      return result;
    } catch (error) {
      console.error("Deposit failed:", error);
      toast.error("Deposit failed. Please try again.");
      throw error;
    }
  };

  const withdraw = async (amount) => {
    try {
      const result = await backendService.withdraw(amount);
      await fetchBalance();
      toast.success("Withdrawal successful!");
      return result;
    } catch (error) {
      console.error("Withdrawal failed:", error);
      toast.error("Withdrawal failed. Please try again.");
      throw error;
    }
  };

  const lend = async (amount) => {
    try {
      const result = await backendService.lend(amount);
      await fetchBalance();
      toast.success("Lending successful!");
      return result;
    } catch (error) {
      console.error("Lending failed:", error);
      toast.error("Lending failed. Please try again.");
      throw error;
    }
  };

  const borrow = async (amount) => {
    try {
      const result = await backendService.borrow(amount);
      await fetchBalance();
      toast.success("Borrowing successful!");
      return result;
    } catch (error) {
      console.error("Borrowing failed:", error);
      toast.error("Borrowing failed. Please try again.");
      throw error;
    }
  };

  const yieldFarm = async () => {
    try {
      const result = await backendService.yieldFarm();
      await fetchBalance();
      toast.success("Yield farming rewards claimed!");
      return result;
    } catch (error) {
      console.error("Yield farming failed:", error);
      toast.error("Failed to claim yield farming rewards.");
      throw error;
    }
  };

  const value = {
    isAuthenticated,
    principal,
    loading,
    balance,
    login,
    logout,
    deposit,
    withdraw,
    lend,
    borrow,
    yieldFarm,
    fetchBalance,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
