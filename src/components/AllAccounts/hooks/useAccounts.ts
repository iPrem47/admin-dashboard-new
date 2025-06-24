import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../../../services/api';
import { Account, AccountsApiResponse, AccountsFilters, AccountsPagination } from '../types';

interface UseAccountsReturn {
  accounts: Account[];
  loading: boolean;
  error: string | null;
  pagination: AccountsPagination;
  filters: AccountsFilters;
  setFilters: (filters: Partial<AccountsFilters>) => void;
  refetch: () => Promise<void>;
}

export const useAccounts = (): UseAccountsReturn => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<AccountsPagination>({
    currentPage: 1,
    totalPages: 1,
    totalResults: 0,
    limit: 20,
    hasNext: false,
    hasPrev: false
  });
  const [filters, setFiltersState] = useState<AccountsFilters>({
    page: 1,
    limit: 20,
    search: ''
  });

  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams({
        page: filters.page.toString(),
        limit: filters.limit.toString()
      });

      console.log('Fetching accounts with URL:', `/transaction-accounts/getAllAccount?${queryParams.toString()}`);
      
      const response: AccountsApiResponse = await apiService.get(`/transaction-accounts/getAllAccount?${queryParams.toString()}`);
      
      if (response.success && response.data) {
        // Filter accounts based on search and balance filter
        let filteredAccounts = response.data;
        
        if (filters.search) {
          filteredAccounts = response.data.filter(account => 
            account.name.toLowerCase().includes(filters.search.toLowerCase())
          );
        }

        if (filters.balanceFilter && filters.balanceFilter !== 'all') {
          filteredAccounts = filteredAccounts.filter(account => {
            switch (filters.balanceFilter) {
              case 'positive':
                return account.balance > 0;
              case 'negative':
                return account.balance < 0;
              case 'zero':
                return account.balance === 0;
              default:
                return true;
            }
          });
        }

        setAccounts(filteredAccounts);
        setPagination({
          currentPage: filters.page,
          totalPages: Math.ceil(filteredAccounts.length / filters.limit),
          totalResults: filteredAccounts.length,
          limit: filters.limit,
          hasNext: filters.page < Math.ceil(filteredAccounts.length / filters.limit),
          hasPrev: filters.page > 1
        });
        
        console.log('Successfully loaded accounts:', filteredAccounts.length);
      } else {
        throw new Error(response.message || 'Failed to fetch accounts');
      }
    } catch (err: any) {
      console.error('Error fetching accounts:', err);
      setError(err.message || 'Failed to load accounts');
      
      // Fallback to mock data for development
      const mockAccounts: Account[] = [
        {
          accountId: "85d4f0cb-49ec-4eef-9c21-3758e8ae6c39",
          name: "Dharma HDFC",
          balance: 0,
          amountColour: "green",
          accountTypeId: 3
        },
        {
          accountId: "93f9fd53-a4ce-4c42-b83d-da7cab0d97ef",
          name: "Dharma IDFC",
          balance: 0,
          amountColour: "green",
          accountTypeId: 3
        },
        {
          accountId: "8b94ea62-ded3-472b-af9e-f348d0b2d8f8",
          name: "AINFINITY",
          balance: -5545650,
          amountColour: "red",
          accountTypeId: 3
        },
        {
          accountId: "29dbf1a7-350a-455e-86e2-409dc4c2f3ee",
          name: "TDS",
          balance: 0,
          amountColour: "green",
          accountTypeId: 3
        },
        {
          accountId: "921ecd40-7ae7-4da5-a346-a8d14be2f41b",
          name: "Mansi Bhavesh Soni H",
          balance: 357555,
          amountColour: "green",
          accountTypeId: 3
        },
        {
          accountId: "c272fed8-effd-4ea3-b2a0-3d461a7d8765",
          name: "PATEL DIVYESHKUMAR ANILBHAI",
          balance: 357555,
          amountColour: "green",
          accountTypeId: 3
        },
        {
          accountId: "5283923b-ce0f-4bff-9519-ec9fa3dde9bd",
          name: "EKTA CHINTANKUMAR BRAHMBHATT",
          balance: 357555,
          amountColour: "green",
          accountTypeId: 3
        },
        {
          accountId: "474b663a-2de9-4d36-9163-0189baa2c9c8",
          name: "PATEL DINESHKUMAR HARI BHAI",
          balance: 357555,
          amountColour: "green",
          accountTypeId: 3
        },
        {
          accountId: "e1ba70b8-8bfa-44af-9e55-22bd190e0dd5",
          name: "VIJAYKUMAR BADARBHAI CHAUDHARI",
          balance: 357555,
          amountColour: "green",
          accountTypeId: 3
        },
        {
          accountId: "d4bcc01a-6bd6-4f75-8a40-f0d9acdf7727",
          name: "POKAR CHHAYABAHEN ALPESHKUMAR",
          balance: 357555,
          amountColour: "green",
          accountTypeId: 3
        }
      ];

      // Apply filters to mock data
      let filteredMockAccounts = mockAccounts;
      
      if (filters.search) {
        filteredMockAccounts = mockAccounts.filter(account => 
          account.name.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      if (filters.balanceFilter && filters.balanceFilter !== 'all') {
        filteredMockAccounts = filteredMockAccounts.filter(account => {
          switch (filters.balanceFilter) {
            case 'positive':
              return account.balance > 0;
            case 'negative':
              return account.balance < 0;
            case 'zero':
              return account.balance === 0;
            default:
              return true;
          }
        });
      }

      setAccounts(filteredMockAccounts);
      setPagination({
        currentPage: filters.page,
        totalPages: Math.ceil(filteredMockAccounts.length / filters.limit),
        totalResults: filteredMockAccounts.length,
        limit: filters.limit,
        hasNext: filters.page < Math.ceil(filteredMockAccounts.length / filters.limit),
        hasPrev: filters.page > 1
      });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const setFilters = (newFilters: Partial<AccountsFilters>) => {
    console.log('Setting new filters:', newFilters);
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  };

  const refetch = async () => {
    console.log('Refetching accounts...');
    await fetchAccounts();
  };

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return {
    accounts,
    loading,
    error,
    pagination,
    filters,
    setFilters,
    refetch
  };
};