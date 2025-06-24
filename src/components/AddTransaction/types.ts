export interface Investor {
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

export interface InvestorsApiResponse {
  statusCode: number;
  data: {
    results: Investor[];
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
  };
  message: string;
  success: boolean;
}

export interface TransactionFormData {
  investorId: string;
  tag: 'Old' | 'New' | '';
  amount: number;
  dateTime: string;
  note: string;
}

export interface AddTransactionPayload {
  tag: string;
  investorId: string;
  amount: number;
  date: string;
  note: string;
}

export interface AddTransactionResponse {
  statusCode: number;
  data?: any;
  message: string;
  success: boolean;
}