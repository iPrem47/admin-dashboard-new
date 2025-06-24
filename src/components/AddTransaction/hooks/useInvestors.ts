import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../../../services/api';
import { Investor, InvestorsApiResponse } from '../types';

interface UseInvestorsReturn {
  investors: Investor[];
  loading: boolean;
  error: string | null;
  searchInvestors: (searchTerm: string) => Promise<void>;
}

export const useInvestors = (): UseInvestorsReturn => {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchInvestors = useCallback(async (searchTerm: string = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams({
        page: '1',
        limit: '50',
        search: searchTerm,
        investorStatusId: '1'
      });

      console.log('Fetching investors with URL:', `/investor/admin/all?${queryParams.toString()}`);
      
      const response: InvestorsApiResponse = await apiService.get(`/investor/admin/all?${queryParams.toString()}`);
      
      if (response.success && response.data && response.data.results) {
        setInvestors(response.data.results);
        console.log('Successfully loaded investors:', response.data.results.length);
      } else {
        throw new Error(response.message || 'Failed to fetch investors');
      }
    } catch (err: any) {
      console.error('Error fetching investors:', err);
      setError(err.message || 'Failed to load investors');
      
      // Fallback to mock data for development
      const mockInvestors: Investor[] = [
        {
          _id: "685674ac72aee50034934782",
          investorId: "RAI1732",
          userId: "user123",
          userName: "RAI1732",
          name: "TESTING OLDNEW",
          amount: 500000,
          amountText: "You'll Give",
          amountColour: "red",
          investorTypeId: 1,
          investorTypeName: "5 L",
          paymentSystemId: 31,
          paymentSystemName: "Monthly",
          panCardNumber: "ABCDE1234F",
          aadharCardNumber: "123456789012"
        },
        {
          _id: "684d7fc14db7d9e62d1cf39c",
          investorId: "RAI1054",
          userId: "user124",
          userName: "RAI1054",
          name: "JITENDRABHAI NAGJIBHAI PATEL",
          amount: 750000,
          amountText: "You'll Give",
          amountColour: "red",
          investorTypeId: 2,
          investorTypeName: "7.5 L",
          paymentSystemId: 31,
          paymentSystemName: "Monthly",
          panCardNumber: "FGHIJ5678K",
          aadharCardNumber: "987654321098"
        },
        {
          _id: "684d803a4db7d9e62d1d0650",
          investorId: "RAI0245",
          userId: "user125",
          userName: "RAI0245",
          name: "BHAILALBHAI PREMJIBHAI PATEL HUF",
          amount: 1000000,
          amountText: "You'll Give",
          amountColour: "red",
          investorTypeId: 3,
          investorTypeName: "10 L",
          paymentSystemId: 31,
          paymentSystemName: "Monthly",
          panCardNumber: "KLMNO9012P",
          aadharCardNumber: "456789123456"
        }
      ];

      // Filter mock data based on search term
      const filteredMockInvestors = searchTerm 
        ? mockInvestors.filter(investor => 
            investor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            investor.userName.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : mockInvestors;

      setInvestors(filteredMockInvestors);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load initial investors on mount
  useEffect(() => {
    searchInvestors('');
  }, [searchInvestors]);

  return {
    investors,
    loading,
    error,
    searchInvestors
  };
};