import { useState, useEffect } from 'react';
import { apiService } from '../../../services/api';
import { PaymentSystem, PaymentSystemsApiResponse } from '../types';

interface UsePaymentSystemsReturn {
  paymentSystems: PaymentSystem[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const usePaymentSystems = (): UsePaymentSystemsReturn => {
  const [paymentSystems, setPaymentSystems] = useState<PaymentSystem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPaymentSystems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response: PaymentSystemsApiResponse = await apiService.get('/investor/getAllPaymentSystem');
      
      if (response.success && response.data) {
        setPaymentSystems(response.data);
        console.log('Payment systems loaded successfully:', response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch payment systems');
      }
    } catch (err: any) {
      console.error('Error fetching payment systems:', err);
      setError(err.message || 'Failed to load payment systems');
      
      // Fallback to mock data
      const mockPaymentSystems: PaymentSystem[] = [
        { paymentSystemId: 7, name: "Weekly" },
        { paymentSystemId: 31, name: "Monthly" },
        { paymentSystemId: 0, name: "None" }
      ];
      setPaymentSystems(mockPaymentSystems);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchPaymentSystems();
  };

  useEffect(() => {
    fetchPaymentSystems();
  }, []);

  return {
    paymentSystems,
    loading,
    error,
    refetch
  };
};