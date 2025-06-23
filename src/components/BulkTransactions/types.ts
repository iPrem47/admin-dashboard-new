export interface BulkTransaction {
  bulkTransactionId: string;
  createdAt: string;
  updatedAt: string;
  transactionType: string;
  paymentSystem: string;
  bulkTransactionStatus: string;
}

export interface BulkTransactionsApiResponse {
  statusCode: number;
  data: {
    results: BulkTransaction[];
    totalPages: number;
    totalResults: number;
    page: number;
    limit: number;
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

export interface PaymentSystem {
  paymentSystemId: number;
  name: string;
}

export interface PaymentSystemsApiResponse {
  statusCode: number;
  data: PaymentSystem[];
  message: string;
  success: boolean;
}

export interface BulkTransactionsFilters {
  page: number;
  limit: number;
  search: string;
  transactionType?: string;
  paymentSystem?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface BulkTransactionsPagination {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}