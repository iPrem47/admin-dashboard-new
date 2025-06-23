export interface AddFundsRequest {
  transactionId: string;
  transactionStatusId: number;
  tag: string;
  withdrawStatus: string;
  withdrawAmount: number;
  withdrawTransactionReferenceIds: string[];
  amount: number;
  investorId: string;
  transactionRefNumber: string;
  createdBy: string;
  accountId: string;
  createdAt: string;
  transactionImage: string;
  transactionTypeId: number;
  transactionModeId: number;
  note: string;
  updatedBy: string;
  updatedAt: string;
  tagsBreakdown: {
    [key: string]: number;
  };
  withdrawLastUpdated?: string;
  userName: string;
  investorName: string;
  email: string;
  phoneNumber: string;
  requestType: string;
}

export interface AddFundsApiResponse {
  results: AddFundsRequest[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

export interface AddFundsFilters {
  page: number;
  limit: number;
  search: string;
  transactionStatusId?: number | null;
}

export interface AddFundsPagination {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface StatusOption {
  value: number | null;
  label: string;
  color: string;
}