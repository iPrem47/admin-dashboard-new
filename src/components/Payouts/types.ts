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

export interface PayoutFormData {
  paymentSystemId: number | null;
  asOnDate: string;
  note: string;
}

export interface PayoutApiPayload {
  paymentSystemId: number;
  asOnDate: string;
  note: string;
}

export interface PayoutApiResponse {
  statusCode: number;
  data?: any;
  message: string;
  success: boolean;
}

export interface PayoutEntry {
  id: string;
  paymentSystemName: string;
  paymentSystemId: number;
  asOnDate: string;
  note: string;
  status: 'Completed' | 'Pending' | 'Failed';
  createdAt: string;
  totalAmount?: number;
  investorsCount?: number;
}

export interface PayoutsFilters {
  page: number;
  limit: number;
  search: string;
  paymentSystem?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}