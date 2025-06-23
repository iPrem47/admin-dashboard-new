import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../../../services/api';
import { Investor, ApiInvestor, InvestorsApiResponse, InvestorsFilters } from '../types';

interface UseInvestorsReturn {
  investors: Investor[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalInvestors: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: InvestorsFilters;
  setFilters: (filters: Partial<InvestorsFilters>) => void;
  refetch: () => Promise<void>;
}

// Transform API investor data to our Investor interface
const transformApiInvestor = (apiInvestor: ApiInvestor): Investor => {
  return {
    id: apiInvestor._id,
    name: apiInvestor.name,
    username: apiInvestor.userName,
    email: '', // Not provided in API response
    phoneNumber: '', // Not provided in API response
    paymentSystem: getPaymentSystem(apiInvestor.paymentSystemName),
    amount: apiInvestor.amount || 0,
    amountText: apiInvestor.amountText || 'You\'ll Give',
    amountColour: apiInvestor.amountColour || 'red',
    investorType: apiInvestor.investorTypeName || '',
    status: 'Active', // Assuming all returned investors are active
    panCardNumber: apiInvestor.panCardNumber,
    aadharCardNumber: apiInvestor.aadharCardNumber
  };
};

// Map payment system string to our enum
const getPaymentSystem = (paymentSystemName: string): 'Monthly' | 'Quarterly' | 'Yearly' | 'None' => {
  const normalizedPayment = paymentSystemName?.toLowerCase();
  switch (normalizedPayment) {
    case 'monthly':
      return 'Monthly';
    case 'quarterly':
      return 'Quarterly';
    case 'yearly':
      return 'Yearly';
    case 'none':
    default:
      return 'None';
  }
};

export const useInvestors = (): UseInvestorsReturn => {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalInvestors: 0,
    limit: 20,
    hasNext: false,
    hasPrev: false
  });
  const [filters, setFiltersState] = useState<InvestorsFilters>({
    page: 1,
    limit: 20,
    search: '',
    investorStatusId: 1 // Default to active investors
  });

  const fetchInvestors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams({
        page: filters.page.toString(),
        limit: filters.limit.toString(),
        search: filters.search,
        investorStatusId: (filters.investorStatusId || 1).toString()
      });

      if (filters.paymentSystem && filters.paymentSystem !== 'All') {
        queryParams.append('paymentSystem', filters.paymentSystem);
      }

      console.log('Fetching investors with params:', queryParams.toString());
      
      const response: InvestorsApiResponse = await apiService.get(`/investor/admin/all?${queryParams.toString()}`);
      
      console.log('API Response:', response);
      
      if (response.success && response.data && response.data.results) {
        // Transform API investors to our Investor interface
        const transformedInvestors = response.data.results.map(transformApiInvestor);
        
        setInvestors(transformedInvestors);
        setPagination({
          currentPage: response.data.page,
          totalPages: response.data.totalPages,
          totalInvestors: response.data.totalResults,
          limit: response.data.limit,
          hasNext: response.data.page < response.data.totalPages,
          hasPrev: response.data.page > 1
        });
        
        console.log('Successfully loaded investors:', transformedInvestors.length);
      } else {
        throw new Error(response.message || 'Failed to fetch investors');
      }
    } catch (err: any) {
      console.error('Error fetching investors:', err);
      setError(err.message || 'Failed to load investors');
      
      // Fallback to mock data for development (based on your API response)
      const mockInvestors: Investor[] = [
        {
          id: '1',
          name: 'RAHUL KUMAR SHANTILAL PATEL',
          username: 'RAI1727',
          email: 'rahul.patel@example.com',
          phoneNumber: '+919876543210',
          paymentSystem: 'Monthly',
          amount: 501690,
          amountText: 'You\'ll Give',
          amountColour: 'red',
          investorType: '5 L',
          status: 'Active',
          panCardNumber: 'AQVPP5489R',
          aadharCardNumber: '803829950429'
        },
        {
          id: '2',
          name: 'NAMRATABEN RATILAL NAYANI',
          username: 'RAI1726',
          email: 'namrata.nayani@example.com',
          phoneNumber: '+919876543211',
          paymentSystem: 'Monthly',
          amount: 2508450,
          amountText: 'You\'ll Give',
          amountColour: 'red',
          investorType: '25 L',
          status: 'Active',
          panCardNumber: 'GJUPS6050K',
          aadharCardNumber: '600111116195'
        },
        {
          id: '3',
          name: 'PATEL PARTH CHANDRAKANT',
          username: 'RAI1725',
          email: 'parth.patel@example.com',
          phoneNumber: '+919876543212',
          paymentSystem: 'Monthly',
          amount: 501690,
          amountText: 'You\'ll Give',
          amountColour: 'red',
          investorType: '5 L',
          status: 'Active',
          panCardNumber: 'CLYPC9609Q',
          aadharCardNumber: '646481666414'
        },
        {
          id: '4',
          name: 'Indira Bhattacharjee',
          username: 'RAI1710',
          email: 'indira.bhatt@example.com',
          phoneNumber: '+919876543213',
          paymentSystem: 'None',
          amount: 2009915,
          amountText: 'You\'ll Give',
          amountColour: 'red',
          investorType: '20 L',
          status: 'Active',
          panCardNumber: 'ALNPB6618H',
          aadharCardNumber: '368192388163'
        },
        {
          id: '5',
          name: 'AMITKUMAR HASMUKHBHAI PATEL HUF',
          username: 'RAI1724',
          email: 'amit.patel@example.com',
          phoneNumber: '+919876543214',
          paymentSystem: 'None',
          amount: 501690,
          amountText: 'You\'ll Give',
          amountColour: 'red',
          investorType: '5 L',
          status: 'Active',
          panCardNumber: 'AAZHA3765P',
          aadharCardNumber: '730784048792'
        },
        {
          id: '6',
          name: 'NILESHKUMAR PRAVINBHAI PATEL',
          username: 'RAI1723',
          email: 'nilesh.patel@example.com',
          phoneNumber: '+919876543215',
          paymentSystem: 'Monthly',
          amount: 501690,
          amountText: 'You\'ll Give',
          amountColour: 'red',
          investorType: '5 L',
          status: 'Active',
          panCardNumber: 'AUKPP7413L',
          aadharCardNumber: '462617970500'
        },
        {
          id: '7',
          name: 'SANJAY RAMNIKLAL PATEL',
          username: 'RAI1722',
          email: 'sanjay.patel@example.com',
          phoneNumber: '+919876543216',
          paymentSystem: 'Monthly',
          amount: 501690,
          amountText: 'You\'ll Give',
          amountColour: 'red',
          investorType: '5 L',
          status: 'Active',
          panCardNumber: 'ATOPP2503N',
          aadharCardNumber: '334823851382'
        },
        {
          id: '8',
          name: 'Gaurang Jagdishbhai Chhatrola',
          username: 'RAI1721',
          email: 'gaurang.chhatrola@example.com',
          phoneNumber: '+919876543217',
          paymentSystem: 'Monthly',
          amount: 1003380,
          amountText: 'You\'ll Give',
          amountColour: 'red',
          investorType: '10 L',
          status: 'Active',
          panCardNumber: 'BOZPC8074E',
          aadharCardNumber: '472784150384'
        }
      ];

      // Filter mock data based on search
      let filteredMockInvestors = mockInvestors;
      if (filters.search) {
        filteredMockInvestors = mockInvestors.filter(investor => 
          investor.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          investor.username.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      // Filter by payment system
      if (filters.paymentSystem && filters.paymentSystem !== 'All') {
        filteredMockInvestors = filteredMockInvestors.filter(investor => 
          investor.paymentSystem === filters.paymentSystem
        );
      }

      setInvestors(filteredMockInvestors);
      setPagination({
        currentPage: filters.page,
        totalPages: Math.ceil(filteredMockInvestors.length / filters.limit),
        totalInvestors: 1722, // Mock total from API response
        limit: filters.limit,
        hasNext: filters.page < Math.ceil(filteredMockInvestors.length / filters.limit),
        hasPrev: filters.page > 1
      });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const setFilters = (newFilters: Partial<InvestorsFilters>) => {
    console.log('Setting new filters:', newFilters);
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  };

  const refetch = async () => {
    console.log('Refetching investors...');
    await fetchInvestors();
  };

  useEffect(() => {
    fetchInvestors();
  }, [fetchInvestors]);

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