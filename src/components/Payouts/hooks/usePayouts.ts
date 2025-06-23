import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../../../services/api';
import { PayoutEntry, PayoutsFilters } from '../types';

interface UsePayoutsReturn {
  payouts: PayoutEntry[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPayouts: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: PayoutsFilters;
  setFilters: (filters: Partial<PayoutsFilters>) => void;
  refetch: () => Promise<void>;
}

export const usePayouts = (): UsePayoutsReturn => {
  const [payouts, setPayouts] = useState<PayoutEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPayouts: 0,
    limit: 20,
    hasNext: false,
    hasPrev: false
  });
  const [filters, setFiltersState] = useState<PayoutsFilters>({
    page: 1,
    limit: 20,
    search: ''
  });

  const fetchPayouts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Replace with actual API endpoint when available
      // const response = await apiService.get('/transaction/admin/payouts', { params: filters });
      
      // Mock data for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockPayouts: PayoutEntry[] = [
        {
          id: '1',
          paymentSystemName: 'Monthly',
          paymentSystemId: 31,
          asOnDate: '2025-01-20 10:00:00',
          note: 'Monthly payout for January 2025',
          status: 'Completed',
          createdAt: '2025-01-20T10:00:00.000Z',
          totalAmount: 5250000,
          investorsCount: 245
        },
        {
          id: '2',
          paymentSystemName: 'Weekly',
          paymentSystemId: 7,
          asOnDate: '2025-01-19 15:30:00',
          note: 'Weekly payout for week 3',
          status: 'Pending',
          createdAt: '2025-01-19T15:30:00.000Z',
          totalAmount: 1850000,
          investorsCount: 89
        },
        {
          id: '3',
          paymentSystemName: 'Monthly',
          paymentSystemId: 31,
          asOnDate: '2025-01-18 09:15:00',
          note: 'Special bonus payout',
          status: 'Completed',
          createdAt: '2025-01-18T09:15:00.000Z',
          totalAmount: 3200000,
          investorsCount: 156
        },
        {
          id: '4',
          paymentSystemName: 'Weekly',
          paymentSystemId: 7,
          asOnDate: '2025-01-17 14:45:00',
          note: 'Weekly payout for week 2',
          status: 'Failed',
          createdAt: '2025-01-17T14:45:00.000Z',
          totalAmount: 950000,
          investorsCount: 42
        }
      ];

      // Filter based on search
      let filteredPayouts = mockPayouts;
      if (filters.search) {
        filteredPayouts = mockPayouts.filter(payout => 
          payout.paymentSystemName.toLowerCase().includes(filters.search.toLowerCase()) ||
          payout.note.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      setPayouts(filteredPayouts);
      setPagination({
        currentPage: filters.page,
        totalPages: Math.ceil(filteredPayouts.length / filters.limit),
        totalPayouts: filteredPayouts.length,
        limit: filters.limit,
        hasNext: filters.page < Math.ceil(filteredPayouts.length / filters.limit),
        hasPrev: filters.page > 1
      });
      
    } catch (err: any) {
      console.error('Error fetching payouts:', err);
      setError(err.message || 'Failed to load payouts');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const setFilters = (newFilters: Partial<PayoutsFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  };

  const refetch = async () => {
    await fetchPayouts();
  };

  useEffect(() => {
    fetchPayouts();
  }, [fetchPayouts]);

  return {
    payouts,
    loading,
    error,
    pagination,
    filters,
    setFilters,
    refetch
  };
};