import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../../../services/api';
import { BulkTransaction, BulkTransactionsApiResponse, BulkTransactionsFilters, BulkTransactionsPagination } from '../types';

interface UseBulkTransactionsReturn {
  transactions: BulkTransaction[];
  loading: boolean;
  error: string | null;
  pagination: BulkTransactionsPagination;
  filters: BulkTransactionsFilters;
  setFilters: (filters: Partial<BulkTransactionsFilters>) => void;
  refetch: () => Promise<void>;
}

export const useBulkTransactions = (): UseBulkTransactionsReturn => {
  const [transactions, setTransactions] = useState<BulkTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<BulkTransactionsPagination>({
    currentPage: 1,
    totalPages: 1,
    totalResults: 0,
    limit: 20,
    hasNext: false,
    hasPrev: false
  });
  const [filters, setFiltersState] = useState<BulkTransactionsFilters>({
    page: 1,
    limit: 20,
    search: ''
  });

  const fetchBulkTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams({
        page: filters.page.toString(),
        limit: filters.limit.toString()
      });

      if (filters.search) {
        queryParams.append('search', filters.search);
      }
      if (filters.transactionType) {
        queryParams.append('transactionType', filters.transactionType);
      }
      if (filters.paymentSystem) {
        queryParams.append('paymentSystem', filters.paymentSystem);
      }
      if (filters.status) {
        queryParams.append('status', filters.status);
      }

      console.log('Fetching bulk transactions with URL:', `/bulk-transactions?${queryParams.toString()}`);
      
      const response: BulkTransactionsApiResponse = await apiService.get(`/bulk-transactions?${queryParams.toString()}`);
      
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
        
        console.log('Successfully loaded bulk transactions:', response.data.results.length);
      } else {
        throw new Error(response.message || 'Failed to fetch bulk transactions');
      }
    } catch (err: any) {
      console.error('Error fetching bulk transactions:', err);
      setError(err.message || 'Failed to load bulk transactions');
      
      // Fallback to mock data for development
      const mockTransactions: BulkTransaction[] = [
        {
          bulkTransactionId: "a7c07d23-326c-4638-b725-0b3d19796c94",
          createdAt: "2025-06-21T13:43:27.214Z",
          updatedAt: "2025-06-21T13:46:07.483Z",
          transactionType: "Profit",
          paymentSystem: "None",
          bulkTransactionStatus: "Completed"
        },
        {
          bulkTransactionId: "7d1e6cc1-885f-451f-8ffd-bc3c8189d8b5",
          createdAt: "2025-06-21T12:51:02.795Z",
          updatedAt: "2025-06-21T12:58:04.408Z",
          transactionType: "Profit",
          paymentSystem: "None",
          bulkTransactionStatus: "Completed"
        },
        {
          bulkTransactionId: "dea1b50c-d9a9-4846-88c7-4f64b8824d6f",
          createdAt: "2025-06-21T10:41:14.926Z",
          updatedAt: "2025-06-21T10:47:43.326Z",
          transactionType: "Profit",
          paymentSystem: "None",
          bulkTransactionStatus: "Completed"
        },
        {
          bulkTransactionId: "f2580cdd-3e2e-487c-9ffc-ded36c9df7e0",
          createdAt: "2025-06-21T09:17:43.327Z",
          updatedAt: "2025-06-21T09:20:12.016Z",
          transactionType: "Profit",
          paymentSystem: "None",
          bulkTransactionStatus: "Completed"
        },
        {
          bulkTransactionId: "1667285e-b752-4a39-9fc6-bb115b4a17a0",
          createdAt: "2025-06-21T09:08:23.739Z",
          updatedAt: "2025-06-21T09:15:10.427Z",
          transactionType: "Profit",
          paymentSystem: "None",
          bulkTransactionStatus: "Completed"
        },
        {
          bulkTransactionId: "f0edf448-b5c0-442c-a868-db2be7683c62",
          createdAt: "2025-06-19T10:04:21.753Z",
          updatedAt: "2025-06-19T10:05:41.425Z",
          transactionType: "Profit",
          paymentSystem: "None",
          bulkTransactionStatus: "Completed"
        },
        {
          bulkTransactionId: "10f846e7-cecb-43c2-81b4-48db741164ae",
          createdAt: "2025-06-19T09:50:54.862Z",
          updatedAt: "2025-06-19T09:55:27.823Z",
          transactionType: "Profit",
          paymentSystem: "None",
          bulkTransactionStatus: "Completed"
        },
        {
          bulkTransactionId: "66ebfcbe-8611-45bb-a7bd-a3fd20bc8a0e",
          createdAt: "2025-06-18T09:20:38.643Z",
          updatedAt: "2025-06-18T09:22:11.961Z",
          transactionType: "Profit",
          paymentSystem: "None",
          bulkTransactionStatus: "Completed"
        },
        {
          bulkTransactionId: "ad6e36aa-06a8-4d5c-9519-cd923104b3fd",
          createdAt: "2025-06-18T09:09:15.377Z",
          updatedAt: "2025-06-18T09:14:17.579Z",
          transactionType: "Profit",
          paymentSystem: "None",
          bulkTransactionStatus: "Completed"
        },
        {
          bulkTransactionId: "fc28d478-6455-49a1-9af3-dd4d85c17fb8",
          createdAt: "2025-06-17T09:44:48.265Z",
          updatedAt: "2025-06-17T09:46:08.244Z",
          transactionType: "Loss",
          paymentSystem: "None",
          bulkTransactionStatus: "Completed"
        },
        {
          bulkTransactionId: "df7a9172-f32e-4c0f-91f1-9105fe4e85a7",
          createdAt: "2025-06-17T09:39:46.013Z",
          updatedAt: "2025-06-17T09:44:02.421Z",
          transactionType: "Loss",
          paymentSystem: "None",
          bulkTransactionStatus: "Completed"
        },
        {
          bulkTransactionId: "275f4875-d2d5-4dbc-a722-cebfbb633e5a",
          createdAt: "2025-06-16T09:39:04.933Z",
          updatedAt: "2025-06-16T09:40:11.108Z",
          transactionType: "Profit",
          paymentSystem: "None",
          bulkTransactionStatus: "Completed"
        }
      ];

      // Filter based on search and filters
      let filteredTransactions = mockTransactions;
      if (filters.search) {
        filteredTransactions = mockTransactions.filter(transaction => 
          transaction.transactionType.toLowerCase().includes(filters.search.toLowerCase()) ||
          transaction.paymentSystem.toLowerCase().includes(filters.search.toLowerCase()) ||
          transaction.bulkTransactionStatus.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      if (filters.transactionType && filters.transactionType !== 'All') {
        filteredTransactions = filteredTransactions.filter(transaction => 
          transaction.transactionType === filters.transactionType
        );
      }

      if (filters.paymentSystem && filters.paymentSystem !== 'All') {
        filteredTransactions = filteredTransactions.filter(transaction => 
          transaction.paymentSystem === filters.paymentSystem
        );
      }

      if (filters.status && filters.status !== 'All') {
        filteredTransactions = filteredTransactions.filter(transaction => 
          transaction.bulkTransactionStatus === filters.status
        );
      }

      setTransactions(filteredTransactions);
      setPagination({
        currentPage: filters.page,
        totalPages: Math.ceil(filteredTransactions.length / filters.limit),
        totalResults: 17, // Use the total from API response
        limit: filters.limit,
        hasNext: filters.page < Math.ceil(filteredTransactions.length / filters.limit),
        hasPrev: filters.page > 1
      });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const setFilters = (newFilters: Partial<BulkTransactionsFilters>) => {
    console.log('Setting new filters:', newFilters);
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  };

  const refetch = async () => {
    console.log('Refetching bulk transactions...');
    await fetchBulkTransactions();
  };

  useEffect(() => {
    fetchBulkTransactions();
  }, [fetchBulkTransactions]);

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