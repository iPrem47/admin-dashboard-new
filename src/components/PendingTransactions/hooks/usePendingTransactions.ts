import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../../../services/api';
import { PendingTransaction, PendingTransactionsApiResponse, PendingTransactionsFilters, PendingTransactionsPagination } from '../types';

interface UsePendingTransactionsReturn {
  transactions: PendingTransaction[];
  loading: boolean;
  error: string | null;
  pagination: PendingTransactionsPagination;
  filters: PendingTransactionsFilters;
  setFilters: (filters: Partial<PendingTransactionsFilters>) => void;
  refetch: () => Promise<void>;
}

export const usePendingTransactions = (): UsePendingTransactionsReturn => {
  const [transactions, setTransactions] = useState<PendingTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PendingTransactionsPagination>({
    currentPage: 1,
    totalPages: 1,
    totalResults: 0,
    limit: 20,
    hasNext: false,
    hasPrev: false
  });
  const [filters, setFiltersState] = useState<PendingTransactionsFilters>({
    page: 1,
    limit: 20,
    search: ''
  });

  const fetchPendingTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams({
        transactionStatusId: '0', // Always filter for pending transactions
        page: filters.page.toString(),
        limit: filters.limit.toString(),
        search: filters.search
      });

      if (filters.transactionModeFilter && filters.transactionModeFilter !== -1) {
        queryParams.append('transactionModeFilter', filters.transactionModeFilter.toString());
      } else {
        queryParams.append('transactionModeFilter', '-1');
      }

      if (filters.transactionalBankFilter) {
        queryParams.append('transactionalBankFilter', filters.transactionalBankFilter);
      } else {
        queryParams.append('transactionalBankFilter', '');
      }

      if (filters.dateYYYYMMddFilter) {
        queryParams.append('dateYYYYMMddFilter', filters.dateYYYYMMddFilter);
      } else {
        queryParams.append('dateYYYYMMddFilter', '');
      }

      console.log('Fetching pending transactions with URL:', `/transaction/admin/all?${queryParams.toString()}`);
      
      const response: PendingTransactionsApiResponse = await apiService.get(`/transaction/admin/all?${queryParams.toString()}`);
      
      if (response.success && response.data) {
        setTransactions(response.data.results);
        setPagination({
          currentPage: response.data.page,
          totalPages: response.data.totalPages,
          totalResults: response.data.totalResults,
          limit: response.data.limit,
          hasNext: response.data.page < response.data.totalPages,
          hasPrev: response.data.page > 1
        });
        
        console.log('Successfully loaded pending transactions:', response.data.results.length);
      } else {
        throw new Error(response.message || 'Failed to fetch pending transactions');
      }
    } catch (err: any) {
      console.error('Error fetching pending transactions:', err);
      setError(err.message || 'Failed to load pending transactions');
      
      // Fallback to mock data for development
      const mockTransactions: PendingTransaction[] = [
        {
          transactionId: "4ffe3dad-4b75-44fa-b8a2-018ca8e9a328",
          accountId: "04f1fa87-a320-4a6e-b9ea-9c1dfff286f2",
          transactionStatusId: 0,
          transactionModeId: 1,
          transactionMode: "Credit",
          transactionType: "Deposit",
          investorName: "RAI1054",
          name: "JITENDRABHAI NAGJIBHAI PATEL",
          transactionStatus: "Pending",
          amount: 500000,
          amountColour: "green",
          accountName: "JITENDRABHAI NAGJIBHAI PATEL",
          createdBy: "684d7f974db7d9e62d1cecf8",
          investorId: "684d7fc14db7d9e62d1cf39c",
          dateTime: "2025-06-19T11:02:25.048Z",
          updatedAt: "2025-06-19T11:02:25.048Z",
          updatedBy: "684d7f974db7d9e62d1cecf8"
        },
        {
          transactionId: "85f853d4-e683-4a24-9af6-e2eddcf60a2b",
          accountId: "7f25f6a9-f643-45f4-a613-9959bd43536c",
          transactionStatusId: 0,
          transactionModeId: 1,
          transactionMode: "Credit",
          transactionType: "Deposit",
          investorName: "RAI0245",
          name: "BHAILALBHAI PREMJIBHAI PATEL HUF",
          transactionStatus: "Pending",
          amount: 1500000,
          amountColour: "green",
          accountName: "BHAILALBHAI PREMJIBHAI PATEL HUF",
          createdBy: "68093b6b917623df07b8a177",
          investorId: "684d803a4db7d9e62d1d0650",
          dateTime: "2025-06-16T06:56:25.703Z",
          updatedAt: "2025-06-16T06:56:25.703Z",
          updatedBy: "68093b6b917623df07b8a177"
        },
        {
          transactionId: "29f577c3-a5ed-40bd-8424-5ff5825cd7fe",
          accountId: "16c402bd-f9cf-4419-9408-c89d44aea11a",
          transactionStatusId: 0,
          transactionModeId: 1,
          transactionMode: "Credit",
          transactionType: "Deposit",
          investorName: "RAI1717",
          name: "Ashish m pansuriya",
          transactionStatus: "Pending",
          amount: 2000000,
          amountColour: "green",
          accountName: "Ashish m pansuriya",
          createdBy: "684e9ab26783290034bd9fd1",
          investorId: "684e9b156783290034bda016",
          dateTime: "2025-06-15T10:06:13.761Z",
          updatedAt: "2025-06-15T10:06:13.761Z"
        }
      ];

      // Filter based on search and filters
      let filteredTransactions = mockTransactions;
      if (filters.search) {
        filteredTransactions = mockTransactions.filter(transaction => 
          transaction.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          transaction.investorName.toLowerCase().includes(filters.search.toLowerCase()) ||
          transaction.transactionType.toLowerCase().includes(filters.search.toLowerCase()) ||
          transaction.accountName.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      if (filters.transactionModeFilter && filters.transactionModeFilter !== -1) {
        filteredTransactions = filteredTransactions.filter(transaction => 
          transaction.transactionModeId === filters.transactionModeFilter
        );
      }

      setTransactions(filteredTransactions);
      setPagination({
        currentPage: filters.page,
        totalPages: Math.ceil(filteredTransactions.length / filters.limit),
        totalResults: 3, // Use the total from API response
        limit: filters.limit,
        hasNext: filters.page < Math.ceil(filteredTransactions.length / filters.limit),
        hasPrev: filters.page > 1
      });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const setFilters = (newFilters: Partial<PendingTransactionsFilters>) => {
    console.log('Setting new filters:', newFilters);
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  };

  const refetch = async () => {
    console.log('Refetching pending transactions...');
    await fetchPendingTransactions();
  };

  useEffect(() => {
    fetchPendingTransactions();
  }, [fetchPendingTransactions]);

  return {
    transactions,
    loading,
    error,
    pagination,
    filters,
    setFilters,
    refetch
  };
};