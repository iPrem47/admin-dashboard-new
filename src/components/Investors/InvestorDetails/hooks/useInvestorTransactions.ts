import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../../../../services/api';
import { InvestorTransaction, InvestorTransactionsApiResponse, TransactionsFilters, TransactionsPagination } from '../types';

interface UseInvestorTransactionsReturn {
  transactions: InvestorTransaction[];
  loading: boolean;
  error: string | null;
  pagination: TransactionsPagination;
  filters: TransactionsFilters;
  setFilters: (filters: Partial<TransactionsFilters>) => void;
  refetch: () => Promise<void>;
}

export const useInvestorTransactions = (investorId: string): UseInvestorTransactionsReturn => {
  const [transactions, setTransactions] = useState<InvestorTransaction[]>([]);
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
    investorId
  });

  const fetchInvestorTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams({
        page: filters.page.toString(),
        limit: filters.limit.toString(),
        investorId: filters.investorId
      });

      console.log(`Fetching transactions for investor ID: ${filters.investorId}`);
      
      const response: InvestorTransactionsApiResponse = await apiService.get(`/transaction/admin/investor/all?${queryParams.toString()}`);
      
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
        
        console.log('Successfully loaded investor transactions:', response.data.results.length);
      } else {
        throw new Error(response.message || 'Failed to fetch investor transactions');
      }
    } catch (err: any) {
      console.error('Error fetching investor transactions:', err);
      setError(err.message || 'Failed to load investor transactions');
      
      // Fallback to mock data for development
      const mockTransactions: InvestorTransaction[] = [
        {
          _id: "685a6f465167f50034e5e134",
          tag: "New",
          withdrawStatus: "Not",
          withdrawAmount: 0,
          withdrawTransactionReferenceIds: [],
          amount: 1410,
          investorId: investorId,
          transactionTypeId: 3,
          bulkTransactionId: "7a57c397-0d05-4960-9cea-7cdf6fb63dad",
          note: "Profit adjustment of 1410 (5L units: 0x) for New account",
          createdAt: "2025-06-24T09:24:50.236Z",
          updatedAt: "2025-06-24T09:24:50.236Z",
          transactionId: "e25e5543-3a77-43f9-9bbd-78ebc379d774",
          tagsBreakdown: {
            "New": 1410
          },
          __v: 0,
          transactionMode: "Credit",
          transactionStatus: "Completed",
          transactionStatusId: 1,
          transactionType: "Profit",
          amountColour: "green",
          accountName: "VARSHA PANKAJ SHAH"
        },
        {
          _id: "685a27dd5167f50034e5596a",
          tag: "New",
          withdrawStatus: "Not",
          withdrawAmount: 0,
          withdrawTransactionReferenceIds: [],
          amount: -285,
          investorId: investorId,
          transactionTypeId: 4,
          bulkTransactionId: "621792e4-d882-4c4e-84a8-9328b32f45de",
          note: "Profit adjustment of -285 (5L units: 0x) for New account",
          createdAt: "2025-06-23T04:20:43.581Z",
          updatedAt: "2025-06-23T04:20:43.581Z",
          transactionId: "5e8bf7d3-2fb8-46ba-99e7-f5f5bd6062f1",
          tagsBreakdown: {
            "New": -285
          },
          __v: 0,
          transactionMode: "Debit",
          transactionStatus: "Completed",
          transactionStatusId: 1,
          transactionType: "Loss",
          amountColour: "red",
          accountName: "VARSHA PANKAJ SHAH"
        },
        {
          _id: "6859877cd70c541971c4eda4",
          tag: "New",
          amount: 500000,
          transactionRefNumber: "New-e7ae7e82",
          investorId: investorId,
          transactionTypeId: 1,
          transactionMode: "Credit",
          transactionStatus: "Completed",
          transactionStatusId: 1,
          transactionType: "Deposit",
          amountColour: "green",
          accountName: "VARSHA PANKAJ SHAH",
          note: "",
          bulkTransactionId: null,
          createdAt: "2025-05-25T00:00:00.000Z",
          updatedAt: "2025-05-25T00:00:00.000Z",
          transactionId: "e493bb10-e74f-4e98-b5b6-64f22164f823",
          withdrawStatus: "Not",
          tagsBreakdown: {
            "New": 500000
          },
          __v: 0
        }
      ];

      setTransactions(mockTransactions);
      setPagination({
        currentPage: filters.page,
        totalPages: 1,
        totalResults: mockTransactions.length,
        limit: filters.limit,
        hasNext: false,
        hasPrev: false
      });
    } finally {
      setLoading(false);
    }
  }, [filters, investorId]);

  const setFilters = (newFilters: Partial<TransactionsFilters>) => {
    console.log('Setting new filters:', newFilters);
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  };

  const refetch = async () => {
    console.log('Refetching investor transactions...');
    await fetchInvestorTransactions();
  };

  useEffect(() => {
    if (investorId) {
      fetchInvestorTransactions();
    }
  }, [fetchInvestorTransactions, investorId]);

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