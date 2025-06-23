import { useState, useEffect } from 'react';
import { apiService } from '../../../services/api';
import { ProfitLossEntry } from '../types';

interface UseTransactionsReturn {
  transactions: ProfitLossEntry[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useTransactions = (): UseTransactionsReturn => {
  const [transactions, setTransactions] = useState<ProfitLossEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getAllAmounts();
      
      if (response.success && response.data) {
        // Transform API data to match our ProfitLossEntry interface
        const transformedData: ProfitLossEntry[] = response.data.map((item: any, index: number) => ({
          id: item.id || `transaction-${index}`,
          amount: parseFloat(item.amount) || 0,
          tag: item.tag || item.type || 'General',
          date: item.date || item.createdAt || new Date().toISOString().split('T')[0],
          status: item.status || 'Completed',
          category: parseFloat(item.amount) >= 0 ? 'Profit' : 'Loss'
        }));
        
        setTransactions(transformedData);
      } else {
        throw new Error(response.message || 'Failed to fetch transactions');
      }
    } catch (err: any) {
      console.error('Error fetching transactions:', err);
      setError(err.message || 'Failed to load transactions');
      
      // Fallback to mock data in case of error (for development)
      const mockData: ProfitLossEntry[] = [
        { id: '1', amount: 1000, tag: 'New', date: '2025-01-20', status: 'Completed', category: 'Profit' },
        { id: '2', amount: 1200, tag: 'Old', date: '2025-01-20', status: 'Completed', category: 'Profit' },
        { id: '3', amount: 1060, tag: 'Investment', date: '2025-01-19', status: 'Completed', category: 'Profit' },
        { id: '4', amount: 1270, tag: 'Dividend', date: '2025-01-19', status: 'Completed', category: 'Profit' },
        { id: '5', amount: -1800, tag: 'Trading', date: '2025-01-18', status: 'Completed', category: 'Loss' },
        { id: '6', amount: -2160, tag: 'Loss', date: '2025-01-18', status: 'Completed', category: 'Loss' },
        { id: '7', amount: 1420, tag: 'Bonus', date: '2025-01-17', status: 'Completed', category: 'Profit' },
        { id: '8', amount: 2500, tag: 'Investment', date: '2025-01-16', status: 'Completed', category: 'Profit' },
        { id: '9', amount: -950, tag: 'Trading', date: '2025-01-15', status: 'Pending', category: 'Loss' },
        { id: '10', amount: 3200, tag: 'Dividend', date: '2025-01-14', status: 'Completed', category: 'Profit' },
      ];
      setTransactions(mockData);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchTransactions();
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    transactions,
    loading,
    error,
    refetch
  };
};