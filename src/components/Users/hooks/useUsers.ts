import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../../../services/api';
import { User, ApiUser, UsersApiResponse, UsersFilters } from '../types';

interface UseUsersReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: UsersFilters;
  setFilters: (filters: Partial<UsersFilters>) => void;
  refetch: () => Promise<void>;
}

// Transform API user data to our User interface
const transformApiUser = (apiUser: ApiUser): User => {
  return {
    id: apiUser.id,
    username: apiUser.userName,
    fullName: `${apiUser.firstName} ${apiUser.lastName}`.trim(),
    email: apiUser.email,
    phoneNo: apiUser.phoneNumber,
    userType: getUserType(apiUser.userTypeId),
    status: getUserStatus(apiUser.userStatusId),
    updatedAt: apiUser.updatedAt
  };
};

// Map userTypeId to readable user type
const getUserType = (userTypeId: number): string => {
  const userTypes: { [key: number]: string } = {
    1001: 'Admin',
    1002: 'Manager',
    1003: 'User',
    1004: 'Investor',
    1005: 'Guest'
  };
  return userTypes[userTypeId] || 'Unknown';
};

// Map userStatusId to readable status
const getUserStatus = (userStatusId: number): 'Active' | 'Inactive' => {
  return userStatusId === 1 ? 'Active' : 'Inactive';
};

export const useUsers = (): UseUsersReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    limit: 20,
    hasNext: false,
    hasPrev: false
  });
  const [filters, setFiltersState] = useState<UsersFilters>({
    page: 1,
    limit: 20,
    search: '',
    userType: '',
    status: ''
  });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams({
        page: filters.page.toString(),
        limit: filters.limit.toString(),
        search: filters.search
      });

      if (filters.userType) {
        queryParams.append('userType', filters.userType);
      }
      if (filters.status) {
        queryParams.append('status', filters.status);
      }

      const response: UsersApiResponse = await apiService.get(`/users/admin/all?${queryParams.toString()}`);
      
      if (response.success && response.data) {
        // Transform API users to our User interface
        const transformedUsers = response.data.users.map(transformApiUser);
        
        setUsers(transformedUsers);
        setPagination({
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          totalUsers: response.data.totalUsers,
          limit: filters.limit,
          hasNext: response.data.currentPage < response.data.totalPages,
          hasPrev: response.data.currentPage > 1
        });
      } else {
        throw new Error(response.message || 'Failed to fetch users');
      }
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Failed to load users');
      
      // Fallback to mock data for development (using the actual API response structure)
      const mockApiUsers: ApiUser[] = [
        {
          "userTypeId": 1004,
          "orgId": 1001,
          "userStatusId": 1,
          "createdBy": null,
          "deleted": false,
          "userName": "RAI0139",
          "firstName": "FALGUNIBEN",
          "lastName": "PATEL",
          "phoneNumber": "+919327294499",
          "email": "1.dharmainfosystem@gmail.com",
          "updatedAt": "2024-12-02T00:00:00.000Z",
          "id": "684d7ec04db7d9e62d1ccc5d"
        },
        {
          "userTypeId": 1004,
          "orgId": 1001,
          "userStatusId": 1,
          "createdBy": null,
          "deleted": false,
          "userName": "RAI0063",
          "firstName": "RASHILABEN",
          "lastName": "PATEL",
          "phoneNumber": "+919624972228",
          "email": "1.dharmainfosystem@gmail.com",
          "updatedAt": "2023-07-10T00:00:00.000Z",
          "id": "684d7ec14db7d9e62d1ccc67"
        },
        {
          "userTypeId": 1004,
          "orgId": 1001,
          "userStatusId": 1,
          "createdBy": null,
          "deleted": false,
          "userName": "RAI0074",
          "firstName": "ARUNABEN",
          "lastName": "PATEL",
          "phoneNumber": "+919426067153",
          "email": "1.dharmainfosystem@gmail.com",
          "updatedAt": "2023-08-21T00:00:00.000Z",
          "id": "684d7ec14db7d9e62d1ccc71"
        },
        {
          "userTypeId": 1004,
          "orgId": 1001,
          "userStatusId": 1,
          "createdBy": null,
          "deleted": false,
          "userName": "RAI0083",
          "firstName": "KANTIBHAI",
          "lastName": "PATEL",
          "phoneNumber": "+919408200195",
          "email": "1.dharmainfosystem@gmail.com",
          "updatedAt": "2023-09-04T00:00:00.000Z",
          "id": "684d7ec14db7d9e62d1ccc7b"
        },
        {
          "userTypeId": 1004,
          "orgId": 1001,
          "userStatusId": 1,
          "createdBy": null,
          "deleted": false,
          "userName": "RAI0101",
          "firstName": "MANSI",
          "lastName": "SONI",
          "phoneNumber": "+919428351101",
          "email": "1.dharmainfosystem@gmail.com",
          "updatedAt": "2023-07-03T00:00:00.000Z",
          "id": "684d7ec14db7d9e62d1ccc85"
        },
        {
          "userTypeId": 1004,
          "orgId": 1001,
          "userStatusId": 1,
          "createdBy": null,
          "deleted": false,
          "userName": "RAI0177",
          "firstName": "DINESHKUMAR",
          "lastName": "PATEL",
          "phoneNumber": "+919428646309",
          "email": "1.dharmainfosystem@gmail.com",
          "updatedAt": "2024-02-19T00:00:00.000Z",
          "id": "684d7ec24db7d9e62d1ccc8f"
        },
        {
          "userTypeId": 1004,
          "orgId": 1001,
          "userStatusId": 1,
          "createdBy": null,
          "deleted": false,
          "userName": "RAI0369",
          "firstName": "CHHAYABEN",
          "lastName": "POKAR",
          "phoneNumber": "+919428646633",
          "email": "1.dharmainfosystem@gmail.com",
          "updatedAt": "2024-03-11T00:00:00.000Z",
          "id": "684d7ec24db7d9e62d1ccc99"
        },
        {
          "userTypeId": 1004,
          "orgId": 1001,
          "userStatusId": 1,
          "createdBy": null,
          "deleted": false,
          "userName": "RAI0381",
          "firstName": "ISWARBHAI",
          "lastName": "PATEL",
          "phoneNumber": "+919376132686",
          "email": "1.dharmainfosystem@gmail.com",
          "updatedAt": "2023-12-11T00:00:00.000Z",
          "id": "684d7ec24db7d9e62d1ccca3"
        },
        {
          "userTypeId": 1004,
          "orgId": 1001,
          "userStatusId": 1,
          "createdBy": null,
          "deleted": false,
          "userName": "RAI0383",
          "firstName": "DIVYESHKUMAR",
          "lastName": "PATEL",
          "phoneNumber": "+918238179393",
          "email": "1.dharmainfosystem@gmail.com",
          "updatedAt": "2024-02-19T00:00:00.000Z",
          "id": "684d7ec24db7d9e62d1cccad"
        },
        {
          "userTypeId": 1004,
          "orgId": 1001,
          "userStatusId": 1,
          "createdBy": null,
          "deleted": false,
          "userName": "RAI0426",
          "firstName": "EKTA",
          "lastName": "BRAHMBHATT",
          "phoneNumber": "+919898282716",
          "email": "1.dharmainfosystem@gmail.com",
          "updatedAt": "2023-10-09T00:00:00.000Z",
          "id": "684d7ec34db7d9e62d1cccb7"
        },
        {
          "userTypeId": 1004,
          "orgId": 1001,
          "userStatusId": 1,
          "createdBy": null,
          "deleted": false,
          "userName": "RAI0435",
          "firstName": "VIJAYKUMAR",
          "lastName": "CHAUDHARI",
          "phoneNumber": "+919106696399",
          "email": "1.dharmainfosystem@gmail.com",
          "updatedAt": "2024-01-01T00:00:00.000Z",
          "id": "684d7ec34db7d9e62d1cccc1"
        },
        {
          "userTypeId": 1004,
          "orgId": 1001,
          "userStatusId": 1,
          "createdBy": null,
          "deleted": false,
          "userName": "RAI0440",
          "firstName": "KAJALBEN",
          "lastName": "VYAS",
          "phoneNumber": "+919408260171",
          "email": "1.dharmainfosystem@gmail.com",
          "updatedAt": "2024-01-16T00:00:00.000Z",
          "id": "684d7ec34db7d9e62d1ccccb"
        },
        {
          "userTypeId": 1004,
          "orgId": 1001,
          "userStatusId": 1,
          "createdBy": null,
          "deleted": false,
          "userName": "RAI0449",
          "firstName": "PRATIK",
          "lastName": "CHONDIKAR",
          "phoneNumber": "+919665269996",
          "email": "1.dharmainfosystem@gmail.com",
          "updatedAt": "2024-04-29T00:00:00.000Z",
          "id": "684d7ec44db7d9e62d1cccd5"
        },
        {
          "userTypeId": 1004,
          "orgId": 1001,
          "userStatusId": 1,
          "createdBy": null,
          "deleted": false,
          "userName": "RAI0458",
          "firstName": "YOGESHKUMAR",
          "lastName": "RAMANI",
          "phoneNumber": "+919099914632",
          "email": "1.dharmainfosystem@gmail.com",
          "updatedAt": "2023-09-18T00:00:00.000Z",
          "id": "684d7ec44db7d9e62d1cccdf"
        },
        {
          "userTypeId": 1004,
          "orgId": 1001,
          "userStatusId": 1,
          "createdBy": null,
          "deleted": false,
          "userName": "RAI0516",
          "firstName": "BHARATBHAI",
          "lastName": "PATEL",
          "phoneNumber": "+919099224828",
          "email": "1.dharmainfosystem@gmail.com",
          "updatedAt": "2024-04-15T00:00:00.000Z",
          "id": "684d7ec44db7d9e62d1ccce9"
        },
        {
          "userTypeId": 1004,
          "orgId": 1001,
          "userStatusId": 1,
          "createdBy": null,
          "deleted": false,
          "userName": "RAI0606",
          "firstName": "CHHAGANBHAI",
          "lastName": "PATEL",
          "phoneNumber": "+919879833887",
          "email": "1.dharmainfosystem@gmail.com",
          "updatedAt": "2024-03-04T00:00:00.000Z",
          "id": "684d7ec54db7d9e62d1cccfc"
        },
        {
          "userTypeId": 1004,
          "orgId": 1001,
          "userStatusId": 1,
          "createdBy": null,
          "deleted": false,
          "userName": "RAI0621",
          "firstName": "MANISHABEN",
          "lastName": "POKAR",
          "phoneNumber": "+919712437924",
          "email": "1.dharmainfosystem@gmail.com",
          "updatedAt": "2024-03-11T00:00:00.000Z",
          "id": "684d7ec54db7d9e62d1ccd06"
        },
        {
          "userTypeId": 1004,
          "orgId": 1001,
          "userStatusId": 1,
          "createdBy": null,
          "deleted": false,
          "userName": "RAI0631",
          "firstName": "TULSIDAS",
          "lastName": "PATEL",
          "phoneNumber": "+919426873872",
          "email": "1.dharmainfosystem@gmail.com",
          "updatedAt": "2024-12-16T00:00:00.000Z",
          "id": "684d7ec54db7d9e62d1ccd10"
        },
        {
          "userTypeId": 1004,
          "orgId": 1001,
          "userStatusId": 1,
          "createdBy": null,
          "deleted": false,
          "userName": "RAI0633",
          "firstName": "SANJAYKUMAR",
          "lastName": "PATEL",
          "phoneNumber": "+918200597811",
          "email": "1.dharmainfosystem@gmail.com",
          "updatedAt": "2023-12-11T00:00:00.000Z",
          "id": "684d7ec54db7d9e62d1ccd1a"
        },
        {
          "userTypeId": 1004,
          "orgId": 1001,
          "userStatusId": 1,
          "createdBy": null,
          "deleted": false,
          "userName": "RAI0713",
          "firstName": "PRIYANKKUMAR",
          "lastName": "DEVDA",
          "phoneNumber": "+919737775477",
          "email": "1.dharmainfosystem@gmail.com",
          "updatedAt": "2024-01-08T00:00:00.000Z",
          "id": "684d7ec64db7d9e62d1ccd24"
        }
      ];

      // Transform mock data and filter based on search
      let transformedMockUsers = mockApiUsers.map(transformApiUser);
      
      if (filters.search) {
        transformedMockUsers = transformedMockUsers.filter(user => 
          user.fullName.toLowerCase().includes(filters.search.toLowerCase()) ||
          user.username.toLowerCase().includes(filters.search.toLowerCase()) ||
          user.email.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      setUsers(transformedMockUsers);
      setPagination({
        currentPage: filters.page,
        totalPages: Math.ceil(transformedMockUsers.length / filters.limit),
        totalUsers: 1192, // Use the total from API response
        limit: filters.limit,
        hasNext: filters.page < Math.ceil(transformedMockUsers.length / filters.limit),
        hasPrev: filters.page > 1
      });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const setFilters = (newFilters: Partial<UsersFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  };

  const refetch = async () => {
    await fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    pagination,
    filters,
    setFilters,
    refetch
  };
};