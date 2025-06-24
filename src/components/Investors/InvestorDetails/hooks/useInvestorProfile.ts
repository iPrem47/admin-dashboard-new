import { useState, useEffect } from 'react';
import { apiService } from '../../../../services/api';
import { InvestorProfile, InvestorProfileApiResponse } from '../types';

interface UseInvestorProfileReturn {
  profile: InvestorProfile | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useInvestorProfile = (investorId: string): UseInvestorProfileReturn => {
  const [profile, setProfile] = useState<InvestorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvestorProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`Fetching investor profile for ID: ${investorId}`);
      
      const response: InvestorProfileApiResponse = await apiService.get(`/investor/admin/getInvestorProfile/${investorId}`);
      
      if (response.success && response.data) {
        setProfile(response.data);
        console.log('Successfully loaded investor profile:', response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch investor profile');
      }
    } catch (err: any) {
      console.error('Error fetching investor profile:', err);
      setError(err.message || 'Failed to load investor profile');
      
      // Fallback to mock data for development
      const mockProfile: InvestorProfile = {
        returnInPercentage: 0.22,
        id: investorId,
        publicIdentifier: "c6312c20-cc47-4b5e-bb06-126cfa60f2ba",
        investorTypeId: 0,
        name: "VARSHA PANKAJ SHAH",
        investorTypeName: "",
        paymentSystemId: 0,
        paymentSystemName: "None",
        investorStatusId: 1,
        referenceId: "24f07be5-d27b-4ea7-9652-d979fd488268",
        referenceName: null,
        transactionalBankId: 1,
        transactionalBankName: "HDFC",
        description: null,
        amount: 508990,
        investorAmount: 500000,
        amountText: "Payable",
        amountColour: "red",
        amountWithPnl: 508990,
        profitOrLossAmount: 8990,
        profitOrLossAmountText: "Loss",
        profitOrLossAmountColour: "red",
        userName: "RAI1673",
        email: "1.dharmainfosystem@gmail.com",
        address1: "AHMEDABAD",
        address2: "AHMEDABAD",
        district: "AHMEDABAD",
        country: "India",
        state: "AHMEDABAD",
        pinCode: "380054",
        nomineeName: "",
        nomineeAadharCardNumber: "",
        nomineeRelation: "",
        nameAsPerBank: "",
        bankName: "PUNJAB BANK",
        bankAccountNumber: "10682010009780",
        ifscCode: "PUNB0106810",
        aadharCardNumber: "388122408248",
        panCardTypeId: 1,
        panCardTypeName: "Individual",
        nameAsPerPanCard: "VARSHA PANKAJ SHAH",
        panCardNumber: "AIXPS9216K",
        chequeORPassbookURL: "",
        bankStatementURL: null,
        signatureURL: null,
        aadharCardURL: null,
        panCardURL: ""
      };
      
      setProfile(mockProfile);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchInvestorProfile();
  };

  useEffect(() => {
    if (investorId) {
      fetchInvestorProfile();
    }
  }, [investorId]);

  return {
    profile,
    loading,
    error,
    refetch
  };
};