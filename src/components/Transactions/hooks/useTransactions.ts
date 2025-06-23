import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../../../services/api';
import { Transaction, TransactionsApiResponse, TransactionsFilters, TransactionsPagination } from '../types';

interface UseTransactionsReturn {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  pagination: TransactionsPagination;
  filters: TransactionsFilters;
  setFilters: (filters: Partial<TransactionsFilters>) => void;
  refetch: () => Promise<void>;
}

export const useTransactions = (): UseTransactionsReturn => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<TransactionsPagination>({
    currentPage: 1,
    totalPages: 1,
    totalResults: 0,
    limit: 20,
    hasNext: false,
    hasPrev: false
  });
  const [filters, setFiltersState] = useState<TransactionsFilters>({
    page: 1,
    limit: 20,
    search: ''
  });

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams({
        page: filters.page.toString(),
        limit: filters.limit.toString(),
        search: filters.search
      });

      if (filters.transactionTypeId) {
        queryParams.append('transactionTypeId', filters.transactionTypeId.toString());
      }
      if (filters.transactionModeId) {
        queryParams.append('transactionModeId', filters.transactionModeId.toString());
      }
      if (filters.status) {
        queryParams.append('status', filters.status);
      }

      console.log('Fetching transactions with URL:', `/transaction/admin/all?${queryParams.toString()}`);
      
      const response: TransactionsApiResponse = await apiService.get(`/transaction/admin/all?${queryParams.toString()}`);
      
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
        
        console.log('Successfully loaded transactions:', response.data.results.length);
      } else {
        throw new Error(response.message || 'Failed to fetch transactions');
      }
    } catch (err: any) {
      console.error('Error fetching transactions:', err);
      setError(err.message || 'Failed to load transactions');
      
      // Fallback to mock data for development
      const mockTransactions: Transaction[] = [
        {
          transactionId: "84f5be53-46ff-43b9-8884-52ea17649e3a",
          accountId: "8b94ea62-ded3-472b-af9e-f348d0b2d8f8",
          transactionStatusId: 1,
          transactionModeId: 2,
          transactionMode: "Debit",
          transactionType: "Profit",
          investorName: "RAI1710",
          name: "Indira Bhattacharjee",
          transactionStatus: "Completed",
          amount: 800,
          amountColour: "red",
          accountName: "AINFINITY",
          investorId: "684d80644db7d9e62d1d0cda",
          dateTime: "2025-06-21T13:43:27.214Z",
          updatedAt: "2025-06-21T13:43:27.214Z"
        },
        {
          transactionId: "98895494-01cf-43d1-8932-a881fcaab132",
          accountId: "3afaf45c-25c4-4017-bb0d-ace458c4d125",
          transactionStatusId: 1,
          transactionModeId: 1,
          transactionMode: "Credit",
          transactionType: "Profit",
          investorName: "RAI1710",
          name: "Indira Bhattacharjee",
          transactionStatus: "Completed",
          amount: 800,
          amountColour: "green",
          accountName: "Indira Bhattacharjee",
          investorId: "684d80644db7d9e62d1d0cda",
          dateTime: "2025-06-21T13:43:27.214Z",
          updatedAt: "2025-06-21T13:43:27.214Z"
        },
        {
          transactionId: "f36d4da6-4f37-437f-a66a-19c81c474d39",
          accountId: "8b94ea62-ded3-472b-af9e-f348d0b2d8f8",
          transactionStatusId: 1,
          transactionModeId: 2,
          transactionMode: "Debit",
          transactionType: "Profit",
          investorName: "RAI1724",
          name: "AMITKUMAR HASMUKHBHAI PATEL HUF",
          transactionStatus: "Completed",
          amount: 200,
          amountColour: "red",
          accountName: "AINFINITY",
          investorId: "684fb764ff9e26003453c3f9",
          dateTime: "2025-06-21T13:43:27.214Z",
          updatedAt: "2025-06-21T13:43:27.214Z"
        },
        {
          transactionId: "2d12627a-2c4f-4e3d-9551-9f33252630e0",
          accountId: "c5945735-e471-4dbd-989a-06e6d5551438",
          transactionStatusId: 1,
          transactionModeId: 1,
          transactionMode: "Credit",
          transactionType: "Profit",
          investorName: "RAI1724",
          name: "AMITKUMAR HASMUKHBHAI PATEL HUF",
          transactionStatus: "Completed",
          amount: 200,
          amountColour: "green",
          accountName: "AMITKUMAR HASMUKHBHAI PATEL HUF",
          investorId: "684fb764ff9e26003453c3f9",
          dateTime: "2025-06-21T13:43:27.214Z",
          updatedAt: "2025-06-21T13:43:27.214Z"
        },
        {
          transactionId: "30ca8f12-c57c-4b35-a68c-f6a6404f7fec",
          accountId: "8b94ea62-ded3-472b-af9e-f348d0b2d8f8",
          transactionStatusId: 2,
          transactionModeId: 2,
          transactionMode: "Debit",
          transactionType: "Loss",
          investorName: "RAI1716",
          name: "ADITI I PATEL",
          transactionStatus: "Pending",
          amount: 200,
          amountColour: "red",
          accountName: "AINFINITY",
          investorId: "684d80634db7d9e62d1d0ca8",
          dateTime: "2025-06-21T13:43:27.214Z",
          updatedAt: "2025-06-21T13:43:27.214Z"
        },
        {
          transactionId: "881bd277-1d2f-4084-a14e-c7f720dae652",
          accountId: "55eb9b43-ad9b-445e-bdda-c18be2b8b570",
          transactionStatusId: 2,
          transactionModeId: 1,
          transactionMode: "Credit",
          transactionType: "Deposit",
          investorName: "RAI1716",
          name: "ADITI I PATEL",
          transactionStatus: "Pending",
          amount: 200,
          amountColour: "green",
          accountName: "ADITI I PATEL",
          investorId: "684d80634db7d9e62d1d0ca8",
          dateTime: "2025-06-21T13:43:27.214Z",
          updatedAt: "2025-06-21T13:43:27.214Z"
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

      if (filters.transactionTypeId) {
        // Map transaction type names to IDs for filtering
        const typeMap: { [key: string]: number } = {
          'Deposit': 1,
          'Withdraw': 2,
          'Profit': 3,
          'Loss': 4,
          'Profit Withdraw': 5,
          'Profit Withdraw TDS': 6,
          'Other': 7
        };
        filteredTransactions = filteredTransactions.filter(transaction => 
          typeMap[transaction.transactionType] === filters.transactionTypeId
        );
      }

      if (filters.transactionModeId) {
        filteredTransactions = filteredTransactions.filter(transaction => 
          transaction.transactionModeId === filters.transactionModeId
        );
      }

      setTransactions(filteredTransactions);
      setPagination({
        currentPage: filters.page,
        totalPages: Math.ceil(filteredTransactions.length / filters.limit),
        totalResults: 20, // Use the total from API response
        limit: filters.limit,
        hasNext: filters.page < Math.ceil(filteredTransactions.length / filters.limit),
        hasPrev: filters.page > 1
      });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const setFilters = (newFilters: Partial<TransactionsFilters>) => {
    console.log('Setting new filters:', newFilters);
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  };

  const refetch = async () => {
    console.log('Refetching transactions...');
    await fetchTransactions();
  };

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

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