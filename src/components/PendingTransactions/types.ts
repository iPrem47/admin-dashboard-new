export interface PendingTransaction {
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
  createdBy?: string;
  investorId: string;
  dateTime: string;
  updatedAt: string;
  updatedBy?: string;
}

export interface PendingTransactionsApiResponse {
  statusCode: number;
  data: {
    results: PendingTransaction[];
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

export interface TransactionalBank {
  id: number;
  label: string;
}

export interface TransactionalBanksApiResponse {
  statusCode: number;
  data: (TransactionalBank | null)[];
  message: string;
  success: boolean;
}

export interface Account {
  accountId: string;
  name: string;
  balance: number;
  amountColour: 'red' | 'green';
  accountTypeId: number;
}

export interface AccountsApiResponse {
  statusCode: number;
  data: Account[];
  message: string;
  success: boolean;
}

export interface PendingTransactionsFilters {
  page: number;
  limit: number;
  search: string;
  transactionModeFilter?: number;
  transactionalBankFilter?: string;
  dateYYYYMMddFilter?: string;
  accountFilter?: string;
}

export interface PendingTransactionsPagination {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PendingTransactionAction {
  type: 'unpaid' | 'delete';
  transactionId: string;
}