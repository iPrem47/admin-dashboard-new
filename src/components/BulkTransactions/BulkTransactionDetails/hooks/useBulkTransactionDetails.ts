import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../../../../services/api';
import { 
  BulkTransactionDetail, 
  BulkTransactionDetailsApiResponse, 
  BulkTransactionSummary,
  BulkTransactionSummaryApiResponse,
  BulkTransactionFilters,
  BulkTransactionPagination
} from '../types';

interface UseBulkTransactionDetailsReturn {
  transactions: BulkTransactionDetail[];
  summary: BulkTransactionSummary | null;
  loading: boolean;
  error: string | null;
  pagination: BulkTransactionPagination;
  filters: BulkTransactionFilters;
  setFilters: (filters: Partial<BulkTransactionFilters>) => void;
  refetch: () => Promise<void>;
}

export const useBulkTransactionDetails = (bulkTransactionId: string): UseBulkTransactionDetailsReturn => {
  const [transactions, setTransactions] = useState<BulkTransactionDetail[]>([]);
  const [summary, setSummary] = useState<BulkTransactionSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<BulkTransactionPagination>({
    currentPage: 1,
    totalPages: 1,
    totalResults: 0,
    limit: 20,
    hasNext: false,
    hasPrev: false
  });
  const [filters, setFiltersState] = useState<BulkTransactionFilters>({});

  const fetchBulkTransactionDetails = useCallback(async () => {
    if (!bulkTransactionId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Fetch bulk transaction summary
      const summaryResponse: BulkTransactionSummaryApiResponse = await apiService.get(`/bulk-transactions/${bulkTransactionId}`);
      
      if (summaryResponse.success && summaryResponse.data) {
        setSummary(summaryResponse.data);
      } else {
        throw new Error(summaryResponse.message || 'Failed to fetch bulk transaction summary');
      }
      
      // Fetch bulk transaction details
      const response: BulkTransactionDetailsApiResponse = await apiService.get(`/bulk-transactions/${bulkTransactionId}/details`);
      
      if (response.success && response.data) {
        setTransactions(response.data);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalResults: response.data.length,
          limit: response.data.length,
          hasNext: false,
          hasPrev: false
        });
        
        console.log('Successfully loaded bulk transaction details:', response.data.length);
      } else {
        throw new Error(response.message || 'Failed to fetch bulk transaction details');
      }
    } catch (err: any) {
      console.error('Error fetching bulk transaction details:', err);
      setError(err.message || 'Failed to load bulk transaction details');
      
      // Fallback to mock data for development
      const mockSummary: BulkTransactionSummary = {
        bulkTransactionId: bulkTransactionId,
        createdAt: "2025-06-24T09:24:50.236Z",
        updatedAt: "2025-06-24T09:24:50.236Z",
        transactionType: "Profit",
        paymentSystem: "None",
        bulkTransactionStatus: "Completed",
        date: "24-06-2025"
      };
      
      setSummary(mockSummary);
      
      // Generate mock transaction details
      const mockTransactions: BulkTransactionDetail[] = [];
      
      // Create pairs of transactions (debit and credit)
      const investorNames = [
        "VARSHA PANKAJ SHAH", "PATEL VINABEN ANIRUDHA", "RAJNIKANT ARVINDBHAI RAVAL", 
        "PATEL BHAVNABEN SURESHBHAI", "VIPUL MAGANBHAI RANGANI", "NIDHI DEVENDRABHAI PATEL",
        "Daksha vipul patel", "KOMAL BHAVIKKUMAR PATEL", "PREMILA GOVIND PATEL", "Niru J Patel"
      ];
      
      const amounts = [1410, 2820, 1410, 1410, 1410, 1410, 1410, 1410, 1410, 1410];
      
      for (let i = 0; i < investorNames.length; i++) {
        // Debit transaction (from AINFINITY)
        mockTransactions.push({
          bulkTransactionId: bulkTransactionId,
          _id: `debit-${i}`,
          amount: amounts[i],
          tag: "New",
          createdAt: "2025-06-24T09:24:50.236Z",
          updatedAt: "2025-06-24T09:24:50.236Z",
          bulkTransactionStatus: "Completed",
          investor: `RAI167${i}`,
          investorName: investorNames[i],
          account: "AINFINITY",
          accountName: "AINFINITY",
          transactionMode: "Debit"
        });
        
        // Credit transaction (to investor)
        mockTransactions.push({
          bulkTransactionId: bulkTransactionId,
          _id: `credit-${i}`,
          amount: amounts[i],
          tag: "New",
          createdAt: "2025-06-24T09:24:50.236Z",
          updatedAt: "2025-06-24T09:24:50.236Z",
          bulkTransactionStatus: "Completed",
          investor: `RAI167${i}`,
          investorName: investorNames[i],
          account: `account-${i}`,
          accountName: investorNames[i],
          transactionMode: "Credit"
        });
      }
      
      // Apply filters if any
      let filteredTransactions = [...mockTransactions];
      
      if (filters.account) {
        filteredTransactions = filteredTransactions.filter(
          transaction => transaction.accountName?.toLowerCase().includes(filters.account!.toLowerCase())
        );
      }
      
      if (filters.transactionMode) {
        filteredTransactions = filteredTransactions.filter(
          transaction => transaction.transactionMode === filters.transactionMode
        );
      }
      
      if (filters.status) {
        filteredTransactions = filteredTransactions.filter(
          transaction => transaction.bulkTransactionStatus === filters.status
        );
      }
      
      setTransactions(filteredTransactions);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalResults: filteredTransactions.length,
        limit: filteredTransactions.length,
        hasNext: false,
        hasPrev: false
      });
    } finally {
      setLoading(false);
    }
  }, [bulkTransactionId, filters]);

  const setFilters = (newFilters: Partial<BulkTransactionFilters>) => {
    console.log('Setting new filters:', newFilters);
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  };

  const refetch = async () => {
    console.log('Refetching bulk transaction details...');
    await fetchBulkTransactionDetails();
  };

  useEffect(() => {
    if (bulkTransactionId) {
      fetchBulkTransactionDetails();
    }
  }, [fetchBulkTransactionDetails, bulkTransactionId]);

  return {
    transactions,
    summary,
    loading,
    error,
    pagination,
    filters,
    setFilters,
    refetch
  };
};