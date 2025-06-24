export interface PendingInvestor {
  _id: string;
  investorId: string;
  userId: string;
  userName: string;
  name: string;
  amount: number;
  amountText: string;
  amountColour: string;
  investorTypeId: number;
  investorTypeName: string;
  paymentSystemId: number;
  paymentSystemName: string;
  panCardNumber: string;
  aadharCardNumber: string;
  email?: string;
  phoneNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PendingInvestorsApiResponse {
  statusCode: number;
  data: {
    results: PendingInvestor[];
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
  };
  message: string;
  success: boolean;
}

export interface PendingInvestorsFilters {
  page: number;
  limit: number;
  search: string;
  paymentSystem?: string;
}

export interface PendingInvestorsPagination {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PendingInvestorAction {
  type: 'approve' | 'reject' | 'view' | 'edit';
  investorId: string;
}