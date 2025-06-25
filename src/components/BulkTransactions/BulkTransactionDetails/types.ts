export interface BulkTransactionDetail {
  bulkTransactionId: string;
  _id: string;
  amount: number;
  tag: string;
  createdAt: string;
  updatedAt: string;
  bulkTransactionStatus: string;
  investor?: string;
  investorName?: string;
  account?: string;
  accountName?: string;
  transactionMode?: 'Credit' | 'Debit';
}

export interface BulkTransactionDetailsApiResponse {
  statusCode: number;
  data: {
    results: BulkTransactionDetail[];
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
  };
  message: string;
  success: boolean;
}

export interface BulkTransactionSummary {
  bulkTransactionId: string;
  createdAt: string;
  updatedAt: string;
  transactionType: string;
  paymentSystem: string;
  bulkTransactionStatus: string;
  date?: string;
}

export interface BulkTransactionSummaryApiResponse {
  statusCode: number;
  data: BulkTransactionSummary;
  message: string;
  success: boolean;
}

export interface BulkTransactionFilters {
  account?: string;
  status?: string;
  transactionMode?: string;
  search?: string;
}

export interface BulkTransactionPagination {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}