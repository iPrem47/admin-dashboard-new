import { useState, useEffect } from 'react';
import { apiService } from '../../../services/api';
import { TransactionalBank, TransactionalBanksApiResponse } from '../types';

interface UseTransactionalBanksReturn {
  banks: TransactionalBank[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useTransactionalBanks = (): UseTransactionalBanksReturn => {
  const [banks, setBanks] = useState<TransactionalBank[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactionalBanks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response: TransactionalBanksApiResponse = await apiService.get('/investor/getAllTransactionalBank');
      
      if (response.success && response.data) {
        // Filter out null values and create clean array
        const cleanBanks = response.data.filter((bank): bank is TransactionalBank => bank !== null);
        setBanks(cleanBanks);
        console.log('Transactional banks loaded successfully:', cleanBanks);
      } else {
        throw new Error(response.message || 'Failed to fetch transactional banks');
      }
    } catch (err: any) {
      console.error('Error fetching transactional banks:', err);
      setError(err.message || 'Failed to load transactional banks');
      
      // Fallback to mock data
      const mockBanks: TransactionalBank[] = [
        { id: 1, label: "HDFC" },
        { id: 2, label: "IDFC" },
        { id: 3, label: "State Bank of India" },
        { id: 4, label: "ICICI Bank" },
        { id: 5, label: "Axis Bank" },
        { id: 6, label: "Punjab National Bank" }
      ];
      setBanks(mockBanks);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchTransactionalBanks();
  };

  useEffect(() => {
    fetchTransactionalBanks();
  }, []);

  return {
    banks,
    loading,
    error,
    refetch
  };
};