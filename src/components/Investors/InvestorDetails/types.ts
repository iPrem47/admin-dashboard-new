export interface InvestorProfile {
  returnInPercentage: number;
  id: string;
  publicIdentifier: string;
  investorTypeId: number;
  name: string;
  investorTypeName: string;
  paymentSystemId: number;
  paymentSystemName: string;
  investorStatusId: number;
  referenceId: string;
  referenceName: string | null;
  transactionalBankId: number;
  transactionalBankName: string;
  description: string | null;
  amount: number;
  investorAmount: number;
  amountText: string;
  amountColour: string;
  amountWithPnl: number;
  profitOrLossAmount: number;
  profitOrLossAmountText: string;
  profitOrLossAmountColour: string;
  userName: string;
  email: string;
  address1: string;
  address2: string;
  district: string;
  country: string;
  state: string;
  pinCode: string;
  nomineeName: string;
  nomineeAadharCardNumber: string;
  nomineeRelation: string;
  nameAsPerBank: string;
  bankName: string;
  bankAccountNumber: string;
  ifscCode: string;
  aadharCardNumber: string;
  panCardTypeId: number;
  panCardTypeName: string;
  nameAsPerPanCard: string;
  panCardNumber: string;
  chequeORPassbookURL: string;
  bankStatementURL: string | null;
  signatureURL: string | null;
  aadharCardURL: string | null;
  panCardURL: string;
}

export interface InvestorProfileApiResponse {
  statusCode: number;
  data: InvestorProfile;
  message: string;
  success: boolean;
}

export interface TDSCertificate {
  certificateId: string;
  certificateFileUrl: string;
  quarter: string;
  fromDate: string;
  toDate: string;
  remarks: string;
}

export interface TDSCertificatesApiResponse {
  statusCode: number;
  data: TDSCertificate[];
  message: string;
  success: boolean;
}

export interface InvestorTransaction {
  _id: string;
  tag: string;
  withdrawStatus: string;
  withdrawAmount: number;
  withdrawTransactionReferenceIds: string[];
  amount: number;
  investorId: string;
  transactionTypeId: number;
  bulkTransactionId: string | null;
  note: string;
  createdAt: string;
  updatedAt: string;
  transactionId: string;
  tagsBreakdown: {
    [key: string]: number;
  };
  __v: number;
  transactionMode: string;
  transactionStatus: string;
  transactionStatusId: number;
  transactionType: string;
  amountColour: string;
  accountName: string;
  transactionRefNumber?: string;
}

export interface InvestorTransactionsApiResponse {
  statusCode: number;
  data: {
    results: InvestorTransaction[];
    totalPages: number;
    currentPage: number;
    totalResults: number;
    page: number;
    limit: number;
  };
  message: string;
  success: boolean;
}

export interface TransactionsFilters {
  page: number;
  limit: number;
  investorId: string;
}

export interface TransactionsPagination {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}