import { useState, useEffect } from 'react';
import { apiService } from '../../../services/api';
import { TransactionMode, TransactionModesApiResponse } from '../types';

interface UseTransactionModesReturn {
  transactionModes: TransactionMode[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useTransactionModes = (): UseTransactionModesReturn => {
  const [transactionModes, setTransactionModes] = useState<TransactionMode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactionModes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response: TransactionModesApiResponse = await apiService.get('/investor/getAllTransactionMode');
      
      if (response.success && response.data) {
        // Filter out null values and create clean array
        const cleanModes = response.data.filter((mode): mode is TransactionMode => mode !== null);
        setTransactionModes(cleanModes);
        console.log('Transaction modes loaded successfully:', cleanModes);
      } else {
        throw new Error(response.message || 'Failed to fetch transaction modes');
      }
    } catch (err: any) {
      console.error('Error fetching transaction modes:', err);
      setError(err.message || 'Failed to load transaction modes');
      
      // Fallback to mock data
      const mockTransactionModes: TransactionMode[] = [
        { id: 1, name: "Deposit" },
        { id: 2, name: "Withdraw" },
        { id: 3, name: "Profit" },
        { id: 4, name: "Loss" },
        { id: 5, name: "Profit Withdraw" },
        { id: 6, name: "Profit Withdraw TDS" },
        { id: 7, name: "Other" }
      ];
      setTransactionModes(mockTransactionModes);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchTransactionModes();
  };

  useEffect(() => {
    fetchTransactionModes();
  }, []);

  return {
    transactionModes,
    loading,
    error,
    refetch
  };
};