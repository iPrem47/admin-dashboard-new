import React, { useState, useCallback } from 'react';
import { 
  Loader2, 
  AlertCircle, 
  ArrowUpDown, 
  Search, 
  Filter, 
  RefreshCw, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  ChevronDown,
  Calendar,
  X
} from 'lucide-react';
import { useBulkTransactions } from './hooks/useBulkTransactions';
import { useTransactionModes } from './hooks/useTransactionModes';
import { usePaymentSystems } from './hooks/usePaymentSystems';
import { BulkTransaction } from './types';
import BulkTransactionsPagination from './BulkTransactionsPagination';

const BulkTransactionsTable: React.FC = () => {
  const { transactions, loading, error, pagination, filters, setFilters, refetch } = useBulkTransactions();
  const { transactionModes, loading: loadingModes } = useTransactionModes();
  const { paymentSystems, loading: loadingSystems } = usePaymentSystems();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isTransactionTypeOpen, setIsTransactionTypeOpen] = useState(false);
  const [isPaymentSystemOpen, setIsPaymentSystemOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [selectedTransactionType, setSelectedTransactionType] = useState('All');
  const [selectedPaymentSystem, setSelectedPaymentSystem] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Status options
  const statusOptions = [
    { value: 'All', label: 'All Status' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Failed', label: 'Failed' }
  ];

  // Debounced search
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    
    const timeoutId = setTimeout(() => {
      setFilters({ search: value, page: 1 });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [setFilters]);

  const handleTransactionTypeChange = (type: string) => {
    setSelectedTransactionType(type);
    setIsTransactionTypeOpen(false);
    setFilters({ 
      transactionType: type === 'All' ? undefined : type, 
      page: 1 
    });
  };

  const handlePaymentSystemChange = (system: string) => {
    setSelectedPaymentSystem(system);
    setIsPaymentSystemOpen(false);
    setFilters({ 
      paymentSystem: system === 'All' ? undefined : system, 
      page: 1 
    });
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setIsStatusOpen(false);
    setFilters({ 
      status: status === 'All' ? undefined : status, 
      page: 1 
    });
  };

  const handlePageChange = (page: number) => {
    setFilters({ page });
  };

  const handleLimitChange = (limit: number) => {
    setFilters({ limit, page: 1 });
  };

  const handleRefresh = async () => {
    await refetch();
  };

  const handleExport = () => {
    console.log('Exporting bulk transactions data...');
    const csvData = transactions.map(transaction => ({
      'Transaction ID': transaction.bulkTransactionId,
      'Transaction Type': transaction.transactionType,
      'Payment System': transaction.paymentSystem,
      'Status': transaction.bulkTransactionStatus,
      'Created At': new Date(transaction.createdAt).toLocaleString(),
      'Updated At': new Date(transaction.updatedAt).toLocaleString()
    }));
    
    const csvString = [
      Object.keys(csvData[0] || {}).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulk-transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const clearAllFilters = () => {
    setSelectedTransactionType('All');
    setSelectedPaymentSystem('All');
    setSelectedStatus('All');
    setSearchTerm('');
    setFilters({
      search: '',
      transactionType: undefined,
      paymentSystem: undefined,
      status: undefined,
      page: 1
    });
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

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'Profit':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Loss':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Deposit':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Withdraw':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Profit Withdraw':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Profit Withdraw TDS':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentSystemColor = (system: string) => {
    switch (system) {
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

  const hasActiveFilters = selectedTransactionType !== 'All' || selectedPaymentSystem !== 'All' || selectedStatus !== 'All' || searchTerm;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-white to-gray-50 px-8 py-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">All Bulk Transactions</h2>
            <div className="flex items-center space-x-4 mt-1">
              <p className="text-sm text-gray-600">
                Manage and monitor bulk transaction operations
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
                placeholder="Search transactions..."
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
          </div>
        </div>
        
        {/* Filters Row */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Transaction Type Filter */}
            <div className="relative">
              <button
                onClick={() => setIsTransactionTypeOpen(!isTransactionTypeOpen)}
                disabled={loading || loadingModes}
                className={`flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors min-w-[160px] justify-between ${
                  loading || loadingModes ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <span className="text-sm font-medium text-gray-700">
                  {selectedTransactionType}
                </span>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isTransactionTypeOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isTransactionTypeOpen && !loading && !loadingModes && (
                <div className="absolute z-10 w-48 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                  <button
                    onClick={() => handleTransactionTypeChange('All')}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-xl ${
                      selectedTransactionType === 'All' ? 'bg-cyan-50 text-cyan-700' : ''
                    }`}
                  >
                    All Transaction Types
                  </button>
                  {transactionModes.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => handleTransactionTypeChange(mode.name)}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors last:rounded-b-xl ${
                        selectedTransactionType === mode.name ? 'bg-cyan-50 text-cyan-700' : ''
                      }`}
                    >
                      {mode.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Payment System Filter */}
            <div className="relative">
              <button
                onClick={() => setIsPaymentSystemOpen(!isPaymentSystemOpen)}
                disabled={loading || loadingSystems}
                className={`flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors min-w-[140px] justify-between ${
                  loading || loadingSystems ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <span className="text-sm font-medium text-gray-700">
                  {selectedPaymentSystem}
                </span>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isPaymentSystemOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isPaymentSystemOpen && !loading && !loadingSystems && (
                <div className="absolute z-10 w-48 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg">
                  <button
                    onClick={() => handlePaymentSystemChange('All')}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-xl ${
                      selectedPaymentSystem === 'All' ? 'bg-cyan-50 text-cyan-700' : ''
                    }`}
                  >
                    All Payment Systems
                  </button>
                  {paymentSystems.map((system) => (
                    <button
                      key={system.paymentSystemId}
                      onClick={() => handlePaymentSystemChange(system.name)}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors last:rounded-b-xl ${
                        selectedPaymentSystem === system.name ? 'bg-cyan-50 text-cyan-700' : ''
                      }`}
                    >
                      {system.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Status Filter */}
            <div className="relative">
              <button
                onClick={() => setIsStatusOpen(!isStatusOpen)}
                disabled={loading}
                className={`flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors min-w-[120px] justify-between ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <span className="text-sm font-medium text-gray-700">
                  {selectedStatus}
                </span>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isStatusOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isStatusOpen && !loading && (
                <div className="absolute z-10 w-48 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleStatusChange(option.value)}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                        selectedStatus === option.value ? 'bg-cyan-50 text-cyan-700' : ''
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X size={16} />
                <span className="text-sm font-medium">Clear</span>
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="text-sm text-gray-600">
            Total Transactions: <span className="font-semibold text-gray-900">{pagination.totalResults}</span>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="p-12 text-center">
          <div className="flex items-center justify-center space-x-3">
            <Loader2 size={24} className="animate-spin text-cyan-500" />
            <span className="text-gray-600">Loading bulk transactions...</span>
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
                <h3 className="text-red-800 font-semibold">Error Loading Transactions</h3>
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
          {transactions.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <ArrowUpDown size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Transactions Found</h3>
              <p className="text-gray-600">
                {filters.search || hasActiveFilters
                  ? 'No transactions found matching your filters.' 
                  : 'No bulk transactions available at the moment.'
                }
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Transaction Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Payment System
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Updated At
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {transactions.map((transaction, index) => (
                  <tr key={transaction.bulkTransactionId} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                    <td className="px-8 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-900 max-w-xs truncate">
                        {transaction.bulkTransactionId}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getTransactionTypeColor(transaction.transactionType)}`}>
                        {transaction.transactionType}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getPaymentSystemColor(transaction.paymentSystem)}`}>
                        {transaction.paymentSystem}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(transaction.bulkTransactionStatus)}`}>
                        <div className={`w-2 h-2 rounded-full mr-2 mt-0.5 ${
                          transaction.bulkTransactionStatus === 'Completed' ? 'bg-green-500' : 
                          transaction.bulkTransactionStatus === 'Pending' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        {transaction.bulkTransactionStatus}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 font-medium">{formatDate(transaction.createdAt)}</span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{formatDate(transaction.updatedAt)}</span>
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

      {/* Pagination */}
      {!loading && transactions.length > 0 && (
        <BulkTransactionsPagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalResults={pagination.totalResults}
          limit={pagination.limit}
          hasNext={pagination.hasNext}
          hasPrev={pagination.hasPrev}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          loading={loading}
        />
      )}
    </div>
  );
};

export default BulkTransactionsTable;