import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../../../services/api';
import { AddFundsRequest, AddFundsApiResponse, AddFundsFilters, AddFundsPagination } from '../types';

interface UseAddFundsReturn {
  requests: AddFundsRequest[];
  loading: boolean;
  error: string | null;
  pagination: AddFundsPagination;
  filters: AddFundsFilters;
  setFilters: (filters: Partial<AddFundsFilters>) => void;
  refetch: () => Promise<void>;
}

export const useAddFunds = (): UseAddFundsReturn => {
  const [requests, setRequests] = useState<AddFundsRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<AddFundsPagination>({
    currentPage: 1,
    totalPages: 1,
    totalResults: 0,
    limit: 10,
    hasNext: false,
    hasPrev: false
  });
  const [filters, setFiltersState] = useState<AddFundsFilters>({
    page: 1,
    limit: 10,
    search: '',
    transactionStatusId: null
  });

  const fetchAddFunds = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams({
        transactionTypeId: '2', // For withdraw funds (as per your API)
        page: filters.page.toString(),
        limit: filters.limit.toString()
      });

      if (filters.search) {
        queryParams.append('search', filters.search);
      }

      if (filters.transactionStatusId !== null && filters.transactionStatusId !== undefined) {
        queryParams.append('transactionStatusId', filters.transactionStatusId.toString());
      }

      console.log('Fetching add funds with URL:', `/transaction/admin/getAddWithdrawRequest?${queryParams.toString()}`);
      
      const response: AddFundsApiResponse = await apiService.get(`/transaction/admin/getAddWithdrawRequest?${queryParams.toString()}`);
      
      if (response && response.results) {
        setRequests(response.results);
        setPagination({
          currentPage: response.page,
          totalPages: response.totalPages,
          totalResults: response.totalResults,
          limit: response.limit,
          hasNext: response.page < response.totalPages,
          hasPrev: response.page > 1
        });
        
        console.log('Successfully loaded add funds requests:', response.results.length);
      } else {
        throw new Error('Failed to fetch add funds requests');
      }
    } catch (err: any) {
      console.error('Error fetching add funds requests:', err);
      setError(err.message || 'Failed to load add funds requests');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const setFilters = (newFilters: Partial<AddFundsFilters>) => {
    console.log('Setting new filters:', newFilters);
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  };

  const refetch = async () => {
    console.log('Refetching add funds requests...');
    await fetchAddFunds();
  };

  useEffect(() => {
    fetchAddFunds();
  }, [fetchAddFunds]);

  return {
    requests,
    loading,
    error,
    pagination,
    filters,
    setFilters,
    refetch
  };
};