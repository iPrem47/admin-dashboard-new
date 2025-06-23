export interface ApiUser {
  id: string;
  userTypeId: number;
  orgId: number;
  userStatusId: number;
  createdBy: string | null;
  deleted: boolean;
  userName: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  updatedAt: string;
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phoneNo: string;
  userType: string;
  status: 'Active' | 'Inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface UsersApiResponse {
  statusCode: number;
  data: {
    users: ApiUser[];
    totalUsers: number;
    totalPages: number;
    currentPage: number;
  };
  message: string;
  success: boolean;
}

export interface UsersFilters {
  page: number;
  limit: number;
  search: string;
  userType?: string;
  status?: string;
}