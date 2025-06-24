import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../../../../services/api';
import { PendingInvestor, PendingInvestorsApiResponse, PendingInvestorsFilters, PendingInvestorsPagination } from '../types';

interface UsePendingInvestorsReturn {
  investors: PendingInvestor[];
  loading: boolean;
  error: string | null;
  pagination: PendingInvestorsPagination;
  filters: PendingInvestorsFilters;
  setFilters: (filters: Partial<PendingInvestorsFilters>) => void;
  refetch: () => Promise<void>;
}

export const usePendingInvestors = (): UsePendingInvestorsReturn => {
  const [investors, setInvestors] = useState<PendingInvestor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PendingInvestorsPagination>({
    currentPage: 1,
    totalPages: 1,
    totalResults: 0,
    limit: 20,
    hasNext: false,
    hasPrev: false
  });
  const [filters, setFiltersState] = useState<PendingInvestorsFilters>({
    page: 1,
    limit: 20,
    search: ''
  });

  const fetchPendingInvestors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams({
        page: filters.page.toString(),
        limit: filters.limit.toString(),
        search: filters.search,
        investorStatusId: '0' // Always 0 for pending investors
      });

      if (filters.paymentSystem && filters.paymentSystem !== 'All') {
        queryParams.append('paymentSystem', filters.paymentSystem);
      }

      console.log('Fetching pending investors with URL:', `/investor/admin/all?${queryParams.toString()}`);
      
      const response: PendingInvestorsApiResponse = await apiService.get(`/investor/admin/all?${queryParams.toString()}`);
      
      if (response.success && response.data && response.data.results) {
        setInvestors(response.data.results);
        setPagination({
          currentPage: response.data.page,
          totalPages: response.data.totalPages,
          totalResults: response.data.totalResults,
          limit: response.data.limit,
          hasNext: response.data.page < response.data.totalPages,
          hasPrev: response.data.page > 1
        });
        
        console.log('Successfully loaded pending investors:', response.data.results.length);
      } else {
        throw new Error(response.message || 'Failed to fetch pending investors');
      }
    } catch (err: any) {
      console.error('Error fetching pending investors:', err);
      setError(err.message || 'Failed to load pending investors');
      
      // Fallback to mock data for development
      const mockPendingInvestors: PendingInvestor[] = [
        {
          _id: "pending1",
          investorId: "RAI9001",
          userId: "user001",
          userName: "RAI9001",
          name: "PENDING INVESTOR ONE",
          amount: 500000,
          amountText: "You'll Give",
          amountColour: "red",
          investorTypeId: 1,
          investorTypeName: "5 L",
          paymentSystemId: 31,
          paymentSystemName: "Monthly",
          panCardNumber: "ABCDE1234F",
          aadharCardNumber: "123456789012",
          email: "pending1@example.com",
          phoneNumber: "+919876543210",
          createdAt: "2025-01-20T10:00:00.000Z"
        },
        {
          _id: "pending2",
          investorId: "RAI9002",
          userId: "user002",
          userName: "RAI9002",
          name: "PENDING INVESTOR TWO",
          amount: 1000000,
          amountText: "You'll Give",
          amountColour: "red",
          investorTypeId: 2,
          investorTypeName: "10 L",
          paymentSystemId: 7,
          paymentSystemName: "Weekly",
          panCardNumber: "FGHIJ5678K",
          aadharCardNumber: "987654321098",
          email: "pending2@example.com",
          phoneNumber: "+919876543211",
          createdAt: "2025-01-19T15:30:00.000Z"
        },
        {
          _id: "pending3",
          investorId: "RAI9003",
          userId: "user003",
          userName: "RAI9003",
          name: "PENDING INVESTOR THREE",
          amount: 750000,
          amountText: "You'll Give",
          amountColour: "red",
          investorTypeId: 3,
          investorTypeName: "7.5 L",
          paymentSystemId: 31,
          paymentSystemName: "Monthly",
          panCardNumber: "KLMNO9012P",
          aadharCardNumber: "456789123456",
          email: "pending3@example.com",
          phoneNumber: "+919876543212",
          createdAt: "2025-01-18T09:15:00.000Z"
        }
      ];

      // Filter based on search
      let filteredInvestors = mockPendingInvestors;
      if (filters.search) {
        filteredInvestors = mockPendingInvestors.filter(investor => 
          investor.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          investor.userName.toLowerCase().includes(filters.search.toLowerCase()) ||
          investor.email?.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      // Filter by payment system
      if (filters.paymentSystem && filters.paymentSystem !== 'All') {
        filteredInvestors = filteredInvestors.filter(investor => 
          investor.paymentSystemName === filters.paymentSystem
        );
      }

      setInvestors(filteredInvestors);
      setPagination({
        currentPage: filters.page,
        totalPages: Math.ceil(filteredInvestors.length / filters.limit),
        totalResults: 15, // Mock total from API response
        limit: filters.limit,
        hasNext: filters.page < Math.ceil(filteredInvestors.length / filters.limit),
        hasPrev: filters.page > 1
      });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const setFilters = (newFilters: Partial<PendingInvestorsFilters>) => {
    console.log('Setting new filters:', newFilters);
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  };

  const refetch = async () => {
    console.log('Refetching pending investors...');
    await fetchPendingInvestors();
  };

  useEffect(() => {
    fetchPendingInvestors();
  }, [fetchPendingInvestors]);

  return {
    investors,
    loading,
    error,
    pagination,
    filters,
    setFilters,
    refetch
  };
};