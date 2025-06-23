import React from 'react';
import { RefreshCw, Download, AlertCircle } from 'lucide-react';

interface PageHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
  loading?: boolean;
  error?: string | null;
}

const PageHeader: React.FC<PageHeaderProps> = ({ onRefresh, onExport, loading, error }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profit & Loss Dashboard</h1>
          <div className="flex items-center space-x-4">
            <p className="text-gray-600">Track and analyze your financial performance</p>
            {error && (
              <div className="flex items-center space-x-2 text-red-600">
                <AlertCircle size={16} />
                <span className="text-sm">Data loading error</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={onRefresh}
            disabled={loading}
            className={`flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            <span className="text-sm font-medium">{loading ? 'Loading...' : 'Refresh'}</span>
          </button>
          <button 
            onClick={onExport}
            disabled={loading}
            className={`flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Download size={18} />
            <span className="text-sm font-medium">Export</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;