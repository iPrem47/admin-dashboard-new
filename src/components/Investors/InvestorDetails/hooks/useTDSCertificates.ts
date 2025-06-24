import { useState, useEffect } from 'react';
import { apiService } from '../../../../services/api';
import { TDSCertificate, TDSCertificatesApiResponse } from '../types';

interface UseTDSCertificatesReturn {
  certificates: TDSCertificate[];
  loading: boolean;
  error: string | null;
  refetch: (year?: string) => Promise<void>;
  selectedYear: string;
  setSelectedYear: (year: string) => void;
}

export const useTDSCertificates = (investorId: string): UseTDSCertificatesReturn => {
  const [certificates, setCertificates] = useState<TDSCertificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());

  const fetchTDSCertificates = async (year: string = selectedYear) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`Fetching TDS certificates for investor ID: ${investorId}, year: ${year}`);
      
      const response: TDSCertificatesApiResponse = await apiService.get(`/tds-certificates/admin/${investorId}?year=${year}&page=1&limit=10`);
      
      if (response.success) {
        setCertificates(response.data || []);
        console.log('Successfully loaded TDS certificates:', response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch TDS certificates');
      }
    } catch (err: any) {
      console.error('Error fetching TDS certificates:', err);
      setError(err.message || 'Failed to load TDS certificates');
      
      // Fallback to empty array for development
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async (year?: string) => {
    await fetchTDSCertificates(year || selectedYear);
  };

  useEffect(() => {
    if (investorId) {
      fetchTDSCertificates();
    }
  }, [investorId, selectedYear]);

  return {
    certificates,
    loading,
    error,
    refetch,
    selectedYear,
    setSelectedYear
  };
};