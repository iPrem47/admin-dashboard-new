import React from 'react';
import { ArrowLeft, RefreshCw, Download, Calendar, Tag, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BulkTransactionSummary } from './types';

interface BulkTransactionHeaderProps {
  summary: BulkTransactionSummary | null;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onExport: () => void;
}

const BulkTransactionHeader: React.FC<BulkTransactionHeaderProps> = ({ 
  summary, 
  loading, 
  error, 
  onRefresh,
  onExport
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/bulk-transactions');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bulk Transaction Details</h1>
            <div className="flex items-center space-x-4 mt-1">
              <p className="text-sm text-gray-600">
                {loading ? 'Loading transaction details...' : summary ? `ID: ${summary.bulkTransactionId.slice(0, 8)}...` : 'Transaction details'}
              </p>
              {error && (
                <div className="flex items-center space-x-2 text-red-600">
                  <AlertCircle size={16} />
                  <span className="text-sm">Error loading details</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={onExport}
            disabled={loading || !summary}
            className={`flex items-center space-x-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors ${
              loading || !summary ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Download size={18} />
            <span className="text-sm font-medium">Export</span>
          </button>
          
          <button 
            onClick={onRefresh}
            disabled={loading}
            className={`flex items-center space-x-2 p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkTransactionHeader;