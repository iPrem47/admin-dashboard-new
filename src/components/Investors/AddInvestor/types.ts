export interface InvestorFormData {
  // Basic Details
  nameAsPanCard: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;

  // Investment Details
  amount: number;
  paymentSystem: string;
  referencePerson: string;

  // Payment Details
  paymentReceivedAccount: string;
  date: string;

  // Bank Details
  bankName: string;
  bankAccountNumber: string;
  ifsc: string;

  // Nominee Details
  nomineeName: string;
  nomineeRelation: string;
  nomineeAadharNumber: string;

  // Personal Details
  panCardAccountType: 'Individual' | 'HUF' | 'Minor';
  panCardNumber: string;
  aadharCard: string;
  addressLine1: string;
  addressLine2: string;
  district: string;
  state: string;
  pinCode: string;
  country: string;

  // Documents
  aadharCardFile?: File;
  panCardFile?: File;
  chequePassbookFile?: File;
  bankStatementFile?: File;
  signatureFile?: File;
  description: string;

  // Status
  activeInvestor: boolean;
}

export interface FormErrors {
  [key: string]: string;
}

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}