import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const useBackend = () => {
  const {
    isAuthenticated,
    principal,
    balance,
    deposit,
    withdraw,
    lend,
    borrow,
    yieldFarm,
    refreshBalance
  } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleOperation = useCallback(async (operation, amount = null, successMessage = '') => {
    if (!isAuthenticated) {
      toast.error('Please login first');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      let result;

      switch (operation) {
        case 'deposit':
          result = await deposit(amount);
          break;
        case 'withdraw':
          result = await withdraw(amount);
          break;
        case 'lend':
          result = await lend(amount);
          break;
        case 'borrow':
          result = await borrow(amount);
          break;
        case 'yieldFarm':
          result = await yieldFarm();
          break;
        default:
          throw new Error('Unknown operation');
      }

      if (successMessage) {
        toast.success(successMessage);
      } else {
        toast.success(result);
      }

      return result;
    } catch (error) {
      const errorMessage = error.message || 'Operation failed';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, deposit, withdraw, lend, borrow, yieldFarm]);

  const depositFunds = useCallback(async (amount) => {
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    return handleOperation('deposit', amount, `Successfully deposited ${amount} sats`);
  }, [handleOperation]);

  const withdrawFunds = useCallback(async (amount) => {
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (amount > balance) {
      toast.error('Insufficient balance');
      return;
    }
    return handleOperation('withdraw', amount, `Successfully withdrew ${amount} sats`);
  }, [handleOperation, balance]);

  const lendFunds = useCallback(async (amount) => {
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (amount > balance) {
      toast.error('Insufficient balance to lend');
      return;
    }
    return handleOperation('lend', amount, `Successfully lent ${amount} sats`);
  }, [handleOperation, balance]);

  const borrowFunds = useCallback(async (amount) => {
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    return handleOperation('borrow', amount, `Successfully borrowed ${amount} sats`);
  }, [handleOperation]);

  const performYieldFarm = useCallback(async () => {
    return handleOperation('yieldFarm', null, 'Yield farming completed!');
  }, [handleOperation]);

  const formatBalance = useCallback((balance) => {
    return new Intl.NumberFormat().format(balance);
  }, []);

  const formatPrincipal = useCallback((principal) => {
    if (!principal) return '';
    const principalStr = principal.toString();
    return `${principalStr.slice(0, 5)}...${principalStr.slice(-5)}`;
  }, []);

  return {
    // State
    loading,
    error,
    isAuthenticated,
    principal,
    balance,

    // Operations
    depositFunds,
    withdrawFunds,
    lendFunds,
    borrowFunds,
    performYieldFarm,
    refreshBalance,

    // Utilities
    formatBalance,
    formatPrincipal,

    // Clear error
    clearError: () => setError(null)
  };
};
