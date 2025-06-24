import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../../../../services/api';
import { Reference, ReferencesApiResponse, ReferenceFilters } from '../types';

interface UseReferencesReturn {
  references: Reference[];
  loading: boolean;
  error: string | null;
  filters: ReferenceFilters;
  setFilters: (filters: Partial<ReferenceFilters>) => void;
  refetch: () => Promise<void>;
}

export const useReferences = (): UseReferencesReturn => {
  const [references, setReferences] = useState<Reference[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<ReferenceFilters>({
    search: ''
  });

  const fetchReferences = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching references...');
      
      const response: ReferencesApiResponse = await apiService.get('/references');
      
      if (response && response.results) {
        let filteredReferences = response.results;
        
        // Apply search filter if present
        if (filters.search) {
          filteredReferences = response.results.filter(reference => 
            reference.name.toLowerCase().includes(filters.search.toLowerCase())
          );
        }
        
        setReferences(filteredReferences);
        console.log('Successfully loaded references:', filteredReferences.length);
      } else {
        throw new Error('Failed to fetch references');
      }
    } catch (err: any) {
      console.error('Error fetching references:', err);
      setError(err.message || 'Failed to load references');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const setFilters = (newFilters: Partial<ReferenceFilters>) => {
    console.log('Setting new filters:', newFilters);
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  };

  const refetch = async () => {
    console.log('Refetching references...');
    await fetchReferences();
  };

  useEffect(() => {
    fetchReferences();
  }, [fetchReferences]);

  return {
    references,
    loading,
    error,
    filters,
    setFilters,
    refetch
  };
};