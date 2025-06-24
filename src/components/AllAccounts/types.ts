export interface Account {
  accountId: string;
  name: string;
  balance: number;
  amountColour: 'green' | 'red';
  accountTypeId: number;
}

export interface AccountsApiResponse {
  statusCode: number;
  data: Account[];
  message: string;
  success: boolean;
}

export interface AccountsFilters {
  page: number;
  limit: number;
  search: string;
  accountType?: string;
  balanceFilter?: 'positive' | 'negative' | 'zero' | 'all';
}

export interface AccountsPagination {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface AccountAction {
  type: 'view' | 'edit' | 'delete';
  accountId: string;
}