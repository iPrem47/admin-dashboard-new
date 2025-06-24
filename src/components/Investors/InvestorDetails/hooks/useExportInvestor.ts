import { useState } from 'react';
import { apiService } from '../../../../services/api';
import { convertExcel } from '../../../TallyExport/utils/convertExcel';

interface UseExportInvestorReturn {
  exportInvestor: (investorId: string) => Promise<void>;
  exporting: boolean;
  error: string | null;
}

export const useExportInvestor = (): UseExportInvestorReturn => {
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportInvestor = async (investorId: string) => {
    try {
      setExporting(true);
      setError(null);
      
      const response = await apiService.post('/export-data/admin/exportInvestorData', { investorId });
      
      if (response.success && response.data) {
        convertExcel(response.data.buffer.data, response.data.filename);
        showNotification('Investor data exported successfully!', 'success');
      } else {
        throw new Error(response.message || 'Failed to export investor data');
      }
    } catch (err: any) {
      console.error('Error exporting investor data:', err);
      setError(err.message || 'Failed to export investor data');
      showNotification('Failed to export investor data', 'error');
    } finally {
      setExporting(false);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    // Create a simple toast notification
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg text-white font-medium transition-all duration-300 ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
      toast.style.opacity = '1';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      toast.style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 4000);
  };

  return {
    exportInvestor,
    exporting,
    error
  };
};