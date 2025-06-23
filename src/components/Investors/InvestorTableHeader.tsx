import React from 'react';
import { Search, Filter, Plus, RefreshCw, Download, AlertCircle, ChevronDown } from 'lucide-react';

interface InvestorTableHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  paymentTypeFilter: string;
  onPaymentTypeChange: (value: string) => void;
  isPaymentFilterOpen: boolean;
  onPaymentFilterToggle: () => void;
  onRefresh: () => void;
  onExport: () => void;
  loading: boolean;
  error: string | null;
  totalInvestors: number;
}

const InvestorTableHeader: React.FC<InvestorTableHeaderProps> = ({
  searchTerm,
  onSearchChange,
  paymentTypeFilter,
  onPaymentTypeChange,
  isPaymentFilterOpen,
  onPaymentFilterToggle,
  onRefresh,
  onExport,
  loading,
  error,
  totalInvestors
}) => {
  const paymentTypeOptions = [
    { value: 'All', label: 'All Payment Types' },
    { value: 'Monthly', label: 'Monthly' },
    { value: 'Quarterly', label: 'Quarterly' },
    { value: 'Yearly', label: 'Yearly' },
    { value: 'None', label: 'None' }
  ];

  return (
    <div className="bg-gradient-to-r from-white to-gray-50 px-8 py-6 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Investors</h2>
          <div className="flex items-center space-x-4 mt-1">
            <p className="text-sm text-gray-600">
              Manage investor accounts and payment systems
            </p>
            {error && (
              <div className="flex items-center space-x-2 text-red-600">
                <AlertCircle size={16} />
                <span className="text-sm">Data loading error</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search investors..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all bg-white"
            />
          </div>
          
          {/* Payment Type Filter */}
          <div className="relative">
            <button
              onClick={onPaymentFilterToggle}
              disabled={loading}
              className={`flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors min-w-[160px] justify-between ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <span className="text-sm font-medium text-gray-700">
                {paymentTypeOptions.find(opt => opt.value === paymentTypeFilter)?.label || 'Payment Type'}
              </span>
              <ChevronDown size={16} className={`text-gray-400 transition-transform ${isPaymentFilterOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isPaymentFilterOpen && !loading && (
              <div className="absolute right-0 z-10 w-48 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg">
                {paymentTypeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onPaymentTypeChange(option.value)}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                      paymentTypeFilter === option.value ? 'bg-cyan-50 text-cyan-700' : ''
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <button 
            onClick={onRefresh}
            disabled={loading}
            className={`flex items-center space-x-2 px-4 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            <span className="text-sm font-medium">{loading ? 'Loading...' : 'Refresh'}</span>
          </button>
          
          <button 
            onClick={onExport}
            disabled={loading}
            className={`flex items-center space-x-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Download size={18} />
            <span className="text-sm font-medium">Export</span>
          </button>
          
          <button className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-orange-500 text-white rounded-xl hover:from-cyan-600 hover:to-orange-600 transition-all shadow-md">
            <Plus size={18} />
            <span className="text-sm font-medium">Add Investor</span>
          </button>
        </div>
      </div>
      
      {/* Stats */}
      <div className="mt-4 flex items-center space-x-6">
        <div className="text-sm text-gray-600">
          Total Investors: <span className="font-semibold text-gray-900">{totalInvestors}</span>
        </div>
        <div className="text-sm text-gray-600">
          Filter: <span className="font-semibold text-gray-900">
            {paymentTypeOptions.find(opt => opt.value === paymentTypeFilter)?.label}
          </span>
        </div>
      </div>
    </div>
  );
};

export default InvestorTableHeader;