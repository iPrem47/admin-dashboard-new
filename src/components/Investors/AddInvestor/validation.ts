import { InvestorFormData, FormErrors, ValidationRules } from './types';

export const validationRules: ValidationRules = {
  nameAsPanCard: {
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  firstName: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  lastName: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  phoneNumber: {
    required: true,
    pattern: /^[+]?[1-9]\d{1,14}$/,
  },
  amount: {
    required: true,
    custom: (value: number) => {
      if (value <= 0) return 'Amount must be greater than 0';
      if (value > 100000000) return 'Amount cannot exceed 10 crores';
      return null;
    },
  },
  paymentSystem: {
    required: true,
  },
  referencePerson: {
    required: true,
    minLength: 2,
  },
  paymentReceivedAccount: {
    required: true,
  },
  date: {
    required: true,
    custom: (value: string) => {
      const selectedDate = new Date(value);
      const today = new Date();
      if (selectedDate > today) return 'Date cannot be in the future';
      return null;
    },
  },
  bankName: {
    required: true,
    minLength: 2,
  },
  bankAccountNumber: {
    required: true,
    pattern: /^\d{9,18}$/,
  },
  ifsc: {
    required: true,
    pattern: /^[A-Z]{4}0[A-Z0-9]{6}$/,
  },
  nomineeName: {
    required: true,
    minLength: 2,
  },
  nomineeRelation: {
    required: true,
  },
  nomineeAadharNumber: {
    required: true,
    pattern: /^\d{12}$/,
  },
  panCardAccountType: {
    required: true,
  },
  panCardNumber: {
    required: true,
    pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  },
  aadharCard: {
    required: true,
    pattern: /^\d{12}$/,
  },
  addressLine1: {
    required: true,
    minLength: 5,
  },
  district: {
    required: true,
  },
  state: {
    required: true,
  },
  pinCode: {
    required: true,
    pattern: /^\d{6}$/,
  },
  country: {
    required: true,
  },
};

export const validateField = (
  fieldName: string,
  value: any,
  rules: ValidationRule
): string | null => {
  // Required validation
  if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
    return `${fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`;
  }

  // Skip other validations if field is empty and not required
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return null;
  }

  // String validations
  if (typeof value === 'string') {
    if (rules.minLength && value.length < rules.minLength) {
      return `Must be at least ${rules.minLength} characters long`;
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return `Must not exceed ${rules.maxLength} characters`;
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return getPatternErrorMessage(fieldName);
    }
  }

  // Custom validation
  if (rules.custom) {
    const customError = rules.custom(value);
    if (customError) return customError;
  }

  return null;
};

const getPatternErrorMessage = (fieldName: string): string => {
  switch (fieldName) {
    case 'email':
      return 'Please enter a valid email address';
    case 'phoneNumber':
      return 'Please enter a valid phone number';
    case 'panCardNumber':
      return 'PAN card must be in format: ABCDE1234F';
    case 'aadharCard':
    case 'nomineeAadharNumber':
      return 'Aadhar number must be 12 digits';
    case 'bankAccountNumber':
      return 'Bank account number must be 9-18 digits';
    case 'ifsc':
      return 'IFSC code must be in format: ABCD0123456';
    case 'pinCode':
      return 'PIN code must be 6 digits';
    default:
      return 'Invalid format';
  }
};

export const validateForm = (formData: InvestorFormData): FormErrors => {
  const errors: FormErrors = {};

  Object.keys(validationRules).forEach((fieldName) => {
    const rules = validationRules[fieldName];
    const value = formData[fieldName as keyof InvestorFormData];
    const error = validateField(fieldName, value, rules);
    
    if (error) {
      errors[fieldName] = error;
    }
  });

  return errors;
};

export const validateSingleField = (
  fieldName: string,
  value: any,
  formData: InvestorFormData
): string | null => {
  const rules = validationRules[fieldName];
  if (!rules) return null;

  return validateField(fieldName, value, rules);
};