export interface ApiInvestor {
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
}

export interface Investor {
  id: string;
  name: string;
  username: string;
  email?: string;
  phoneNumber?: string;
  paymentSystem: 'Monthly' | 'Quarterly' | 'Yearly' | 'None';
  amount: number;
  amountText: string;
  amountColour: string;
  investorType: string;
  status: 'Active' | 'Inactive' | 'Pending';
  investmentDate?: string;
  updatedAt?: string;
  panCardNumber?: string;
  aadharCardNumber?: string;
}

export interface InvestorsApiResponse {
  statusCode: number;
  data: {
    results: ApiInvestor[];
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
  };
  message: string;
  success: boolean;
}

export interface InvestorsFilters {
  page: number;
  limit: number;
  search: string;
  investorStatusId?: number;
  paymentSystem?: string;
}