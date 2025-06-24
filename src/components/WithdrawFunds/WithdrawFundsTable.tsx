import React, { useState, useCallback } from 'react';
import { 
  Loader2, 
  AlertCircle, 
  Minus, 
  Search, 
  RefreshCw, 
  Download, 
  Eye,
  ChevronDown,
  X,
  Clock,
  CheckCircle,
  XCircle,
  ArrowDownLeft
} from 'lucide-react';
import { useWithdrawFunds } from './hooks/useWithdrawFunds';
import { WithdrawFundsRequest, StatusOption } from './types';
import WithdrawFundsPagination from './WithdrawFundsPagination';
import WithdrawFundsDetailDialog from './WithdrawFundsDetailDialog';

const WithdrawFundsTable: React.FC = () => {
  const { requests, loading, error, pagination, filters, setFilters, refetch } = useWithdrawFunds();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedRequest, setSelectedRequest] = useState<WithdrawFundsRequest | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  // Status options
  const statusOptions: StatusOption[] = [
    { value: null, label: 'All', color: 'bg-gray-100 text-gray-800 border-gray-200' },
    { value: 0, label: 'Pending', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    { value: 1, label: 'Approved', color: 'bg-green-100 text-green-800 border-green-200' },
    { value: 2, label: 'Rejected', color: 'bg-red-100 text-red-800 border-red-200' }
  ];

  // Debounced search
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    
    const timeoutId = setTimeout(() => {
      setFilters({ search: value, page: 1 });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [setFilters]);

  const handleStatusChange = (statusValue: number | null, statusLabel: string) => {
    setSelectedStatus(statusLabel);
    setIsStatusOpen(false);
    setFilters({ 
      transactionStatusId: statusValue, 
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
    console.log('Exporting withdraw funds data...');
    const csvData = requests.map(request => ({
      'Transaction ID': request.transactionId,
      'Investor Name': request.investorName,
      'Username': request.userName,
      'Amount': request.amount,
      'Reference Number': request.transactionRefNumber,
      'Status': getStatusLabel(request.transactionStatusId),
      'Withdraw Status': request.withdrawStatus,
      'Withdrawn Amount': request.withdrawAmount,
      'Tag': request.tag,
      'Created Date': new Date(request.createdAt).toLocaleString(),
      'Email': request.email
    }));
    
    const csvString = [
      Object.keys(csvData[0] || {}).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `withdraw-funds-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const clearAllFilters = () => {
    setSelectedStatus('All');
    setSearchTerm('');
    setFilters({
      search: '',
      transactionStatusId: undefined,
      page: 1
    });
  };

  const handleViewRequest = (request: WithdrawFundsRequest) => {
    setSelectedRequest(request);
    setIsDetailDialogOpen(true);
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
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusLabel = (statusId: number): string => {
    const status = statusOptions.find(opt => opt.value === statusId);
    return status?.label || 'Unknown';
  };

  const getStatusColor = (statusId: number) => {
    const status = statusOptions.find(opt => opt.value === statusId);
    return status?.color || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (statusId: number) => {
    switch (statusId) {
      case 0:
        return Clock;
      case 1:
        return CheckCircle;
      case 2:
        return XCircle;
      default:
        return AlertCircle;
    }
  };

  const getWithdrawStatusColor = (status: string) => {
    switch (status) {
      case 'Not':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Partial':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Full':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'new':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'old':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'investment':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2);
  };

  const hasActiveFilters = selectedStatus !== 'All' || searchTerm;

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-white to-gray-50 px-8 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">List Withdraw Funds</h2>
              <div className="flex items-center space-x-4 mt-1">
                <p className="text-sm text-gray-600">
                  Monitor and manage withdraw funds requests
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
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-white"
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
              {/* Status Filter */}
              <div className="relative">
                <button
                  onClick={() => setIsStatusOpen(!isStatusOpen)}
                  disabled={loading}
                  className={`flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors min-w-[140px] justify-between ${
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
                        key={option.label}
                        onClick={() => handleStatusChange(option.value, option.label)}
                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                          selectedStatus === option.label ? 'bg-red-50 text-red-700' : ''
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
              Total Requests: <span className="font-semibold text-gray-900">{pagination.totalResults}</span>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="p-12 text-center">
            <div className="flex items-center justify-center space-x-3">
              <Loader2 size={24} className="animate-spin text-red-500" />
              <span className="text-gray-600">Loading withdraw funds requests...</span>
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
                  <h3 className="text-red-800 font-semibold">Error Loading Requests</h3>
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
            {requests.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Minus size={48} className="mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Withdraw Funds Requests Found</h3>
                <p className="text-gray-600">
                  {filters.search || hasActiveFilters
                    ? 'No requests found matching your filters.' 
                    : 'No withdraw funds requests available at the moment.'
                  }
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Investor
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Reference Number
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Tag
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Withdraw Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {requests.map((request, index) => {
                    const StatusIcon = getStatusIcon(request.transactionStatusId);
                    
                    return (
                      <tr key={request.transactionId} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                        <td className="px-8 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-orange-400 rounded-full flex items-center justify-center mr-3">
                              <span className="text-white text-xs font-semibold">
                                {getInitials(request.investorName)}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">{request.investorName}</div>
                              <div className="text-xs text-gray-500">@{request.userName}</div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <ArrowDownLeft size={16} className="text-red-500 mr-2" />
                            <div className="text-lg font-bold text-red-600">
                              {formatAmount(request.amount)}
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-mono text-gray-900">{request.transactionRefNumber}</span>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getTagColor(request.tag)}`}>
                            {request.tag}
                          </span>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getWithdrawStatusColor(request.withdrawStatus)}`}>
                            {request.withdrawStatus === 'Not' ? 'Not Withdrawn' : 
                             request.withdrawStatus === 'Partial' ? 'Partially Withdrawn' : 
                             request.withdrawStatus === 'Full' ? 'Fully Withdrawn' : request.withdrawStatus}
                          </span>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(request.transactionStatusId)}`}>
                            <StatusIcon size={12} className="mr-1 mt-0.5" />
                            {getStatusLabel(request.transactionStatusId)}
                          </span>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900 font-medium">{formatDate(request.createdAt)}</span>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button 
                            onClick={() => handleViewRequest(request)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && requests.length > 0 && (
          <WithdrawFundsPagination
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

      {/* Detail Dialog */}
      <WithdrawFundsDetailDialog
        request={selectedRequest}
        isOpen={isDetailDialogOpen}
        onClose={() => {
          setIsDetailDialogOpen(false);
          setSelectedRequest(null);
        }}
      />
    </>
  );
};

export default WithdrawFundsTable;