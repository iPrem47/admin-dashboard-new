import React, { useState } from 'react';
import { 
  Calendar, 
  ChevronDown, 
  Download, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  FileSpreadsheet,
  Filter,
  Clock,
  Info,
  AlertTriangle
} from 'lucide-react';
import { TallyExportFormData, TallyExportPayload, TallyExportResponse, TypeOption } from './types';
import { convertExcel } from './utils/convertExcel';
import { convertDateFormat, getTodayDate, getDateDaysAgo } from './utils/dateUtils';
import { apiService } from '../../services/api';

const TallyExportForm: React.FC = () => {
  const [formData, setFormData] = useState<TallyExportFormData>({
    type: 'All',
    fromDate: getDateDaysAgo(30), // Default to 30 days ago
    toDate: getTodayDate()
  });

  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [showLargeDataWarning, setShowLargeDataWarning] = useState(false);

  // Type options - only All and Payout as requested
  const typeOptions: TypeOption[] = [
    { value: 'All', label: 'All' },
    { value: 'Payout', label: 'Payout' }
  ];

  const validateForm = (): boolean => {
    if (!formData.fromDate) {
      setExportError('Please select a from date');
      return false;
    }

    if (!formData.toDate) {
      setExportError('Please select a to date');
      return false;
    }

    const fromDate = new Date(formData.fromDate);
    const toDate = new Date(formData.toDate);

    if (fromDate > toDate) {
      setExportError('From date cannot be later than to date');
      return false;
    }

    // Check if date range is large (more than 90 days)
    const daysDifference = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDifference > 90) {
      setShowLargeDataWarning(true);
    } else {
      setShowLargeDataWarning(false);
    }

    return true;
  };

  const exportCsv = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsExporting(true);
      setExportError(null);
      
      const payload: TallyExportPayload = {
        type: formData.type,
        fromDate: convertDateFormat(formData.fromDate, "fromDate"),
        toDate: convertDateFormat(formData.toDate, "toDate"),
      };

      console.log('Exporting data with payload:', payload);

      const exportResponse: TallyExportResponse = await apiService.post('/export-data/admin/exportData', payload);

      if (exportResponse.success && exportResponse.data) {
        // Convert and download the Excel file
        convertExcel(exportResponse.data.buffer.data, exportResponse.data.filename);
        
        setExportSuccess(true);
        showNotification('Export completed successfully!', 'success');
        
        // Reset form after successful export
        setTimeout(() => {
          setExportSuccess(false);
          setFormData({
            type: 'All',
            fromDate: getDateDaysAgo(30),
            toDate: getTodayDate()
          });
          setShowLargeDataWarning(false);
        }, 3000);
      } else {
        throw new Error(exportResponse.message || 'Export failed');
      }
    } catch (error: any) {
      console.error('CSV Export Failed:', error);
      const errorMessage = error.message || 'Export failed. Please try again.';
      setExportError(errorMessage);
      showNotification(errorMessage, 'error');
    } finally {
      setIsExporting(false);
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

  const handleTypeSelect = (type: string) => {
    setFormData(prev => ({ ...prev, type }));
    setIsTypeDropdownOpen(false);
    if (exportError) {
      setExportError(null);
    }
  };

  const handleDateChange = (field: 'fromDate' | 'toDate', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (exportError) {
      setExportError(null);
    }
  };

  const selectedTypeOption = typeOptions.find(option => option.value === formData.type);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl">
            <FileSpreadsheet size={24} className="text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payout TDS</h1>
            <p className="text-gray-600 mt-1">Export your payout and TDS data to Excel format for Tally integration</p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {exportSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <CheckCircle size={24} className="text-green-600" />
            <div>
              <h3 className="text-green-800 font-semibold">Export Completed Successfully!</h3>
              <p className="text-green-600">Your Excel file has been downloaded and is ready for Tally import.</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {exportError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <AlertCircle size={24} className="text-red-600" />
            <div>
              <h3 className="text-red-800 font-semibold">Export Error</h3>
              <p className="text-red-600">{exportError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Export Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-end">
          {/* From Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              From Date:
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="date"
                value={formData.fromDate}
                onChange={(e) => handleDateChange('fromDate', e.target.value)}
                className="w-full pl-11 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white text-gray-900"
                placeholder="DD MMM YYYY"
              />
            </div>
          </div>

          {/* To Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              To Date:
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="date"
                value={formData.toDate}
                onChange={(e) => handleDateChange('toDate', e.target.value)}
                className="w-full pl-11 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white text-gray-900"
                placeholder="DD MMM YYYY"
              />
            </div>
          </div>

          {/* Type Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Type:
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                disabled={isExporting}
                className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white text-left flex items-center justify-between hover:border-gray-400"
              >
                <span className="text-gray-900 font-medium">
                  {selectedTypeOption?.label || 'All'}
                </span>
                <ChevronDown 
                  size={20} 
                  className={`text-gray-400 transition-transform ${isTypeDropdownOpen ? 'rotate-180' : ''}`} 
                />
              </button>
              
              {isTypeDropdownOpen && !isExporting && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg">
                  {typeOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleTypeSelect(option.value)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl flex items-center justify-between"
                    >
                      <span className="font-medium">{option.label}</span>
                      {formData.type === option.value && (
                        <CheckCircle size={16} className="text-green-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Export Button */}
          <div>
            <button
              onClick={exportCsv}
              disabled={isExporting || exportSuccess}
              className={`w-full flex items-center justify-center space-x-2 px-6 py-4 rounded-xl font-semibold transition-all shadow-lg ${
                isExporting || exportSuccess
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
              }`}
            >
              {isExporting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Exporting...</span>
                </>
              ) : exportSuccess ? (
                <>
                  <CheckCircle size={20} />
                  <span>Exported!</span>
                </>
              ) : (
                <>
                  <Download size={20} />
                  <span>Export</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Large Data Warning - Always Show */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
              <AlertTriangle size={20} className="text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-yellow-900 mb-2">Large amount of data included</h3>
            <p className="text-yellow-800 leading-relaxed">
              You're about to queue a large amount of data that may take a while to export and appear in your email. 
              Consider picking a different date range.
            </p>
          </div>
        </div>
      </div>

      {/* Additional Information Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
              <Info size={20} className="text-blue-600" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Export Information</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• The exported Excel file will be compatible with Tally ERP for seamless data import</p>
              <p>• Large date ranges may take several minutes to process and will be sent to your registered email</p>
              <p>• For optimal performance, we recommend exporting data in monthly intervals</p>
              <p>• All financial data is encrypted and securely processed during export</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TallyExportForm;