import { useState, useEffect } from 'react';
import { apiService } from '../../../services/api';
import { Account, AccountsApiResponse } from '../types';

interface UseAccountsReturn {
  accounts: Account[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useAccounts = (): UseAccountsReturn => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response: AccountsApiResponse = await apiService.get('/transaction-accounts/getAllAccount');
      
      if (response.success && response.data) {
        setAccounts(response.data);
        console.log('Accounts loaded successfully:', response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch accounts');
      }
    } catch (err: any) {
      console.error('Error fetching accounts:', err);
      setError(err.message || 'Failed to load accounts');
      
      // Fallback to mock data
      const mockAccounts: Account[] = [
        {
          accountId: "85d4f0cb-49ec-4eef-9c21-3758e8ae6c39",
          name: "Dharma HDFC",
          balance: 6450000,
          amountColour: "green",
          accountTypeId: 3
        },
        {
          accountId: "93f9fd53-a4ce-4c42-b83d-da7cab0d97ef",
          name: "Dharma IDFC",
          balance: 0,
          amountColour: "green",
          accountTypeId: 3
        },
        {
          accountId: "8b94ea62-ded3-472b-af9e-f348d0b2d8f8",
          name: "AINFINITY",
          balance: -29237610,
          amountColour: "red",
          accountTypeId: 3
        },
        {
          accountId: "29dbf1a7-350a-455e-86e2-409dc4c2f3ee",
          name: "TDS",
          balance: 0,
          amountColour: "green",
          accountTypeId: 3
        }
      ];
      setAccounts(mockAccounts);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchAccounts();
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return {
    accounts,
    loading,
    error,
    refetch
  };
};