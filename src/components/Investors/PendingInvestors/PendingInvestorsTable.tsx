import React, { useState, useCallback } from 'react';
import { 
  Loader2, 
  AlertCircle, 
  Clock, 
  Search, 
  RefreshCw, 
  Download, 
  Eye, 
  CheckCircle, 
  XCircle,
  ChevronDown,
  X,
  User,
  Calendar
} from 'lucide-react';
import { usePendingInvestors } from './hooks/usePendingInvestors';
import { PendingInvestor, PendingInvestorAction } from './types';
import PendingInvestorsPagination from './PendingInvestorsPagination';

const PendingInvestorsTable: React.FC = () => {
  const { investors, loading, error, pagination, filters, setFilters, refetch } = usePendingInvestors();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isPaymentSystemOpen, setIsPaymentSystemOpen] = useState(false);
  const [selectedPaymentSystem, setSelectedPaymentSystem] = useState('All');

  // Payment system options
  const paymentSystemOptions = [
    { value: 'All', label: 'All Payment Systems' },
    { value: 'Monthly', label: 'Monthly' },
    { value: 'Weekly', label: 'Weekly' },
    { value: 'Quarterly', label: 'Quarterly' },
    { value: 'Yearly', label: 'Yearly' },
    { value: 'None', label: 'None' }
  ];

  // Debounced search
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    
    const timeoutId = setTimeout(() => {
      setFilters({ search: value, page: 1 });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [setFilters]);

  const handlePaymentSystemChange = (system: string) => {
    setSelectedPaymentSystem(system);
    setIsPaymentSystemOpen(false);
    setFilters({ 
      paymentSystem: system === 'All' ? undefined : system, 
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
    console.log('Exporting pending investors data...');
    const csvData = investors.map(investor => ({
      'Investor ID': investor.investorId,
      'Name': investor.name,
      'Username': investor.userName,
      'Email': investor.email || '',
      'Phone': investor.phoneNumber || '',
      'Amount': investor.amount,
      'Payment System': investor.paymentSystemName,
      'Investor Type': investor.investorTypeName,
      'PAN Card': investor.panCardNumber,
      'Aadhar Card': investor.aadharCardNumber,
      'Created Date': investor.createdAt ? new Date(investor.createdAt).toLocaleString() : ''
    }));
    
    const csvString = [
      Object.keys(csvData[0] || {}).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pending-investors-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const clearAllFilters = () => {
    setSelectedPaymentSystem('All');
    setSearchTerm('');
    setFilters({
      search: '',
      paymentSystem: undefined,
      page: 1
    });
  };

  const handleInvestorAction = async (action: PendingInvestorAction) => {
    console.log('Pending investor action:', action);
    
    if (action.type === 'approve') {
      if (window.confirm('Are you sure you want to approve this investor?')) {
        try {
          console.log('Approving investor:', action.investorId);
          // TODO: Implement API call to approve investor
          // await apiService.post(`/investor/admin/approve/${action.investorId}`);
          showNotification('Investor approved successfully!', 'success');
          await refetch();
        } catch (error) {
          console.error('Error approving investor:', error);
          showNotification('Failed to approve investor', 'error');
        }
      }
    } else if (action.type === 'reject') {
      if (window.confirm('Are you sure you want to reject this investor? This action cannot be undone.')) {
        try {
          console.log('Rejecting investor:', action.investorId);
          // TODO: Implement API call to reject investor
          // await apiService.post(`/investor/admin/reject/${action.investorId}`);
          showNotification('Investor rejected successfully!', 'success');
          await refetch();
        } catch (error) {
          console.error('Error rejecting investor:', error);
          showNotification('Failed to reject investor', 'error');
        }
      }
    } else if (action.type === 'view') {
      console.log('Viewing investor:', action.investorId);
      // TODO: Implement view investor modal/page
    } else if (action.type === 'edit') {
      console.log('Editing investor:', action.investorId);
      // TODO: Implement edit investor modal/page
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

  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getPaymentSystemColor = (paymentSystem: string) => {
    switch (paymentSystem) {
      case 'Monthly':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Weekly':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Quarterly':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Yearly':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'None':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2);
  };

  const hasActiveFilters = selectedPaymentSystem !== 'All' || searchTerm;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-white to-gray-50 px-8 py-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Pending Investors</h2>
            <div className="flex items-center space-x-4 mt-1">
              <p className="text-sm text-gray-600">
                Review and manage pending investor applications
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
                placeholder="Search pending investors..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white"
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
            {/* Payment System Filter */}
            <div className="relative">
              <button
                onClick={() => setIsPaymentSystemOpen(!isPaymentSystemOpen)}
                disabled={loading}
                className={`flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors min-w-[180px] justify-between ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <span className="text-sm font-medium text-gray-700">
                  {selectedPaymentSystem}
                </span>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isPaymentSystemOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isPaymentSystemOpen && !loading && (
                <div className="absolute z-10 w-56 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg">
                  {paymentSystemOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handlePaymentSystemChange(option.value)}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                        selectedPaymentSystem === option.value ? 'bg-orange-50 text-orange-700' : ''
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
            Total Pending: <span className="font-semibold text-gray-900">{pagination.totalResults}</span>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="p-12 text-center">
          <div className="flex items-center justify-center space-x-3">
            <Loader2 size={24} className="animate-spin text-orange-500" />
            <span className="text-gray-600">Loading pending investors...</span>
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
                <h3 className="text-red-800 font-semibold">Error Loading Pending Investors</h3>
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
          {investors.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Clock size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Investors Found</h3>
              <p className="text-gray-600">
                {filters.search || hasActiveFilters
                  ? 'No pending investors found matching your filters.' 
                  : 'No pending investor applications at the moment.'
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
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Payment System
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Applied Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {investors.map((investor, index) => (
                  <tr key={investor._id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                    <td className="px-8 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white text-xs font-semibold">
                            {getInitials(investor.name)}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{investor.name}</div>
                          <div className="text-xs text-gray-500">@{investor.userName}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="text-gray-900">{investor.email || 'N/A'}</div>
                        <div className="text-gray-500">{investor.phoneNumber || 'N/A'}</div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="text-xs text-red-500 font-medium">{investor.amountText}</div>
                        <div className="text-lg font-bold text-red-600">
                          ₹{formatAmount(investor.amount)}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getPaymentSystemColor(investor.paymentSystemName)}`}>
                        {investor.paymentSystemName}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar size={14} className="mr-2 text-gray-400" />
                        {formatDate(investor.createdAt)}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleInvestorAction({ type: 'approve', investorId: investor._id })}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Approve Investor"
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button 
                          onClick={() => handleInvestorAction({ type: 'reject', investorId: investor._id })}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Reject Investor"
                        >
                          <XCircle size={16} />
                        </button>
                        <button 
                          onClick={() => handleInvestorAction({ type: 'view', investorId: investor._id })}
                          className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
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
      {!loading && investors.length > 0 && (
        <PendingInvestorsPagination
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

export default PendingInvestorsTable;