import React, { useState, useCallback } from 'react';
import { Loader2, AlertCircle, CreditCard, Search, Filter, RefreshCw, Download, Eye, Edit, Trash2 } from 'lucide-react';
import { usePayouts } from './hooks/usePayouts';
import { PayoutEntry } from './types';

interface PayoutsTableProps {
  onAddPayout?: () => void;
}

const PayoutsTable: React.FC<PayoutsTableProps> = ({ onAddPayout }) => {
  const { payouts, loading, error, pagination, filters, setFilters, refetch } = usePayouts();
  const [searchTerm, setSearchTerm] = useState('');

  // Debounced search
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    
    const timeoutId = setTimeout(() => {
      setFilters({ search: value, page: 1 });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [setFilters]);

  const handleRefresh = async () => {
    await refetch();
  };

  const handleExport = () => {
    console.log('Exporting payouts data...');
    const csvData = payouts.map(payout => ({
      'Payment System': payout.paymentSystemName,
      'Date': new Date(payout.asOnDate).toLocaleString(),
      'Note': payout.note,
      'Status': payout.status,
      'Total Amount': payout.totalAmount || 0,
      'Investors Count': payout.investorsCount || 0
    }));
    
    const csvString = [
      Object.keys(csvData[0] || {}).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payouts-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatAmount = (amount: number): string => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentSystemColor = (paymentSystem: string) => {
    switch (paymentSystem) {
      case 'Monthly':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Weekly':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'None':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-white to-gray-50 px-8 py-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Payouts</h2>
            <div className="flex items-center space-x-4 mt-1">
              <p className="text-sm text-gray-600">
                Manage investor payouts and distributions
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
                placeholder="Search payouts..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all bg-white"
              />
            </div>
            
            {/* Action Buttons */}
            <button 
              onClick={handleRefresh}
              disabled={loading}
              className={`flex items-center space-x-2 px-4 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              <span className="text-sm font-medium">{loading ? 'Loading...' : 'Refresh'}</span>
            </button>
            
            <button 
              onClick={handleExport}
              disabled={loading}
              className={`flex items-center space-x-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Download size={18} />
              <span className="text-sm font-medium">Export</span>
            </button>
            
            {onAddPayout && (
              <button 
                onClick={onAddPayout}
                className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all shadow-md"
              >
                <CreditCard size={18} />
                <span className="text-sm font-medium">Add Payout</span>
              </button>
            )}
          </div>
        </div>
        
        {/* Stats */}
        <div className="mt-4 flex items-center space-x-6">
          <div className="text-sm text-gray-600">
            Total Payouts: <span className="font-semibold text-gray-900">{pagination.totalPayouts}</span>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="p-12 text-center">
          <div className="flex items-center justify-center space-x-3">
            <Loader2 size={24} className="animate-spin text-cyan-500" />
            <span className="text-gray-600">Loading payouts...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="p-8">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle size={20} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-red-800 font-semibold">Error Loading Payouts</h3>
                <p className="text-red-600 text-sm">{error}</p>
                <button 
                  onClick={handleRefresh}
                  className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium underline"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="overflow-x-auto">
          {payouts.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <CreditCard size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Payouts Found</h3>
              <p className="text-gray-600">
                {filters.search 
                  ? `No payouts found matching "${filters.search}".` 
                  : 'No payouts available at the moment.'
                }
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Payment System
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Note
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Investors
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {payouts.map((payout, index) => (
                  <tr key={payout.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                    <td className="px-8 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getPaymentSystemColor(payout.paymentSystemName)}`}>
                        {payout.paymentSystemName}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 font-medium">{formatDate(payout.asOnDate)}</span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <span className="text-sm text-gray-600 line-clamp-2">{payout.note}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-emerald-600">
                        {payout.totalAmount ? formatAmount(payout.totalAmount) : '-'}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {payout.investorsCount || '-'}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(payout.status)}`}>
                        <div className={`w-2 h-2 rounded-full mr-2 mt-0.5 ${
                          payout.status === 'Completed' ? 'bg-green-500' : 
                          payout.status === 'Pending' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        {payout.status}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors">
                          <Eye size={16} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                          <Edit size={16} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default PayoutsTable;