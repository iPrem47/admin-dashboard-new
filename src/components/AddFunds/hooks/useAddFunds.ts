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
    search: ''
  });

  const fetchAddFunds = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams({
        transactionTypeId: '1', // Always 1 for Add Funds
        page: filters.page.toString(),
        limit: filters.limit.toString()
      });

      if (filters.search) {
        queryParams.append('search', filters.search);
      }

      if (filters.transactionStatusId !== undefined && filters.transactionStatusId !== null) {
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
      
      // Fallback to mock data for development
      const mockRequests: AddFundsRequest[] = [
        {
          transactionStatusId: 1,
          tag: "New",
          withdrawStatus: "Not",
          withdrawAmount: 0,
          withdrawTransactionReferenceIds: [],
          amount: 500000,
          investorId: "685674ac72aee50034934782",
          transactionRefNumber: "dfiafih",
          createdBy: "68093b6b917623df07b8a177",
          accountId: "be3b8c7e-bbd6-471c-8272-728a5f56c3eb",
          createdAt: "2025-06-21T13:37:27.780Z",
          transactionImage: "https://ainfinity.s3.ap-south-1.amazonaws.com/uploads/685674ac72aee50034934782/1750513047337-768473605-Screenshot 2025-05-27 193354.png",
          transactionTypeId: 1,
          transactionModeId: 1,
          note: "ADD FUNDS REQUEST",
          updatedBy: "68093b6b917623df07b8a177",
          updatedAt: "2025-06-21T13:37:42.046Z",
          transactionId: "03eec53b-d9b0-4b0e-95f3-40af74d12437",
          tagsBreakdown: {
            "New": 500000
          },
          userName: "RAI1732",
          investorName: "TESTING OLDNEW",
          email: "smit161002@gmail.com",
          phoneNumber: "",
          requestType: "Add Funds"
        },
        {
          transactionStatusId: 0,
          tag: "New",
          withdrawStatus: "Not",
          withdrawAmount: 0,
          withdrawTransactionReferenceIds: [],
          amount: 500000,
          transactionRefNumber: "Ndmc",
          investorId: "684d7fc14db7d9e62d1cf39c",
          createdBy: "684d7f974db7d9e62d1cecf8",
          accountId: "04f1fa87-a320-4a6e-b9ea-9c1dfff286f2",
          createdAt: "2025-06-19T11:02:25.048Z",
          transactionImage: "https://ainfinity.s3.ap-south-1.amazonaws.com/uploads/684d7fc14db7d9e62d1cf39c/1750330944896-455806070-AD13256D-6E0A-42BA-9C38-1EB88A98F811.jpg",
          transactionTypeId: 1,
          transactionModeId: 1,
          note: "ADD FUNDS REQUEST",
          updatedBy: "684d7f974db7d9e62d1cecf8",
          updatedAt: "2025-06-19T11:02:25.048Z",
          transactionId: "4ffe3dad-4b75-44fa-b8a2-018ca8e9a328",
          tagsBreakdown: {
            "New": 500000
          },
          userName: "RAI1054",
          investorName: "JITENDRABHAI NAGJIBHAI PATEL",
          email: "1.dharmainfosystem@gmail.com",
          phoneNumber: "",
          requestType: "Add Funds"
        },
        {
          transactionStatusId: 2,
          tag: "New",
          withdrawStatus: "Not",
          withdrawAmount: 0,
          withdrawTransactionReferenceIds: [],
          amount: 1500000,
          investorId: "684d803a4db7d9e62d1d0650",
          transactionRefNumber: "DHARMA INFOSYSTEM",
          createdBy: "68093b6b917623df07b8a177",
          accountId: "7f25f6a9-f643-45f4-a613-9959bd43536c",
          createdAt: "2025-06-16T06:56:25.703Z",
          transactionImage: "https://ainfinity.s3.ap-south-1.amazonaws.com/uploads/684d803a4db7d9e62d1d0650/1750056985625-516676609-DHARMA INFOSYSTEM.jpg",
          transactionTypeId: 1,
          transactionModeId: 1,
          note: "ADD FUNDS REQUEST",
          updatedBy: "68093b6b917623df07b8a177",
          updatedAt: "2025-06-16T06:56:25.703Z",
          transactionId: "85f853d4-e683-4a24-9af6-e2eddcf60a2b",
          tagsBreakdown: {
            "New": 1500000
          },
          userName: "RAI0245",
          investorName: "BHAILALBHAI PREMJIBHAI PATEL HUF",
          email: "1.dharmainfosystem@gmail.com",
          phoneNumber: "",
          requestType: "Add Funds"
        }
      ];

      // Filter based on search and status
      let filteredRequests = mockRequests;
      if (filters.search) {
        filteredRequests = mockRequests.filter(request => 
          request.investorName.toLowerCase().includes(filters.search.toLowerCase()) ||
          request.userName.toLowerCase().includes(filters.search.toLowerCase()) ||
          request.transactionRefNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
          request.email.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      if (filters.transactionStatusId !== undefined && filters.transactionStatusId !== null) {
        filteredRequests = filteredRequests.filter(request => 
          request.transactionStatusId === filters.transactionStatusId
        );
      }

      setRequests(filteredRequests);
      setPagination({
        currentPage: filters.page,
        totalPages: Math.ceil(filteredRequests.length / filters.limit),
        totalResults: 25, // Use the total from API response
        limit: filters.limit,
        hasNext: filters.page < Math.ceil(filteredRequests.length / filters.limit),
        hasPrev: filters.page > 1
      });
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