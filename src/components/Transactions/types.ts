export interface Transaction {
  transactionId: string;
  accountId: string;
  transactionStatusId: number;
  transactionModeId: number;
  transactionMode: 'Credit' | 'Debit';
  transactionType: string;
  investorName: string;
  name: string;
  transactionStatus: string;
  amount: number;
  amountColour: 'red' | 'green';
  accountName: string;
  investorId: string;
  dateTime: string;
  updatedAt: string;
}

export interface TransactionsApiResponse {
  statusCode: number;
  data: {
    results: Transaction[];
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
  };
  message: string;
  success: boolean;
}

export interface TransactionMode {
  id: number;
  name: string;
}

export interface TransactionModesApiResponse {
  statusCode: number;
  data: (TransactionMode | null)[];
  message: string;
  success: boolean;
}

export interface TransactionsFilters {
  page: number;
  limit: number;
  search: string;
  transactionTypeId?: number;
  transactionModeId?: number;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface TransactionsPagination {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface TransactionAction {
  type: 'unpaid' | 'delete';
  transactionId: string;
}