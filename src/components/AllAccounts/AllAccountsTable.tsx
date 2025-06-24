import React, { useState, useCallback } from 'react';
import { 
  Loader2, 
  AlertCircle, 
  Building2, 
  Search, 
  RefreshCw, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  ChevronDown,
  X,
  Plus,
  Filter,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { useAccounts } from './hooks/useAccounts';
import { Account, AccountAction } from './types';
import AccountsPagination from './AccountsPagination';

const AllAccountsTable: React.FC = () => {
  const { accounts, loading, error, pagination, filters, setFilters, refetch } = useAccounts();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isBalanceFilterOpen, setIsBalanceFilterOpen] = useState(false);
  const [selectedBalanceFilter, setSelectedBalanceFilter] = useState('All');

  // Balance filter options
  const balanceFilterOptions = [
    { value: 'all', label: 'All Balances' },
    { value: 'positive', label: 'Positive Balance' },
    { value: 'negative', label: 'Negative Balance' },
    { value: 'zero', label: 'Zero Balance' }
  ];

  // Debounced search
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    
    const timeoutId = setTimeout(() => {
      setFilters({ search: value, page: 1 });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [setFilters]);

  const handleBalanceFilterChange = (filterValue: string, filterLabel: string) => {
    setSelectedBalanceFilter(filterLabel);
    setIsBalanceFilterOpen(false);
    setFilters({ 
      balanceFilter: filterValue as any, 
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
    console.log('Exporting accounts data...');
    const csvData = accounts.map(account => ({
      'Account ID': account.accountId,
      'Name': account.name,
      'Balance': account.balance,
      'Account Type ID': account.accountTypeId
    }));
    
    const csvString = [
      Object.keys(csvData[0] || {}).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `accounts-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const clearAllFilters = () => {
    setSelectedBalanceFilter('All');
    setSearchTerm('');
    setFilters({
      search: '',
      balanceFilter: 'all',
      page: 1
    });
  };

  const handleAccountAction = async (action: AccountAction) => {
    console.log('Account action:', action);
    
    if (action.type === 'view') {
      console.log('Viewing account:', action.accountId);
      // TODO: Implement view account modal/page
    } else if (action.type === 'edit') {
      console.log('Editing account:', action.accountId);
      // TODO: Implement edit account modal/page
    } else if (action.type === 'delete') {
      if (window.confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
        try {
          console.log('Deleting account:', action.accountId);
          // TODO: Implement API call to delete account
          // await apiService.delete(`/transaction-accounts/${action.accountId}`);
          await refetch();
        } catch (error) {
          console.error('Error deleting account:', error);
        }
      }
    }
  };

  const formatBalance = (balance: number): string => {
    const absBalance = Math.abs(balance);
    if (absBalance >= 10000000) {
      return `${balance < 0 ? '-' : ''}${(absBalance / 10000000).toFixed(1)}Cr`;
    } else if (absBalance >= 100000) {
      return `${balance < 0 ? '-' : ''}${(absBalance / 100000).toFixed(1)}L`;
    } else if (absBalance >= 1000) {
      return `${balance < 0 ? '-' : ''}${(absBalance / 1000).toFixed(1)}K`;
    }
    return balance.toLocaleString();
  };

  const getBalanceIcon = (balance: number) => {
    if (balance > 0) return TrendingUp;
    if (balance < 0) return TrendingDown;
    return Minus;
  };

  const getBalanceColor = (balance: number, amountColour: string) => {
    if (balance === 0) return 'text-gray-600';
    return amountColour === 'green' ? 'text-emerald-600' : 'text-red-600';
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2);
  };

  const hasActiveFilters = selectedBalanceFilter !== 'All' || searchTerm;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-white to-gray-50 px-8 py-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">All Accounts</h2>
            <div className="flex items-center space-x-4 mt-1">
              <p className="text-sm text-gray-600">
                Manage and monitor all account balances
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
                placeholder="Search accounts..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
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
            
            <button className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all shadow-md">
              <Plus size={18} />
              <span className="text-sm font-medium">Add Account</span>
            </button>
          </div>
        </div>
        
        {/* Filters Row */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Balance Filter */}
            <div className="relative">
              <button
                onClick={() => setIsBalanceFilterOpen(!isBalanceFilterOpen)}
                disabled={loading}
                className={`flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors min-w-[160px] justify-between ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Filter size={16} className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">
                    {selectedBalanceFilter}
                  </span>
                </div>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isBalanceFilterOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isBalanceFilterOpen && !loading && (
                <div className="absolute z-10 w-48 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg">
                  {balanceFilterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleBalanceFilterChange(option.value, option.label)}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                        selectedBalanceFilter === option.label ? 'bg-blue-50 text-blue-700' : ''
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
            Total Accounts: <span className="font-semibold text-gray-900">{pagination.totalResults}</span>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="p-12 text-center">
          <div className="flex items-center justify-center space-x-3">
            <Loader2 size={24} className="animate-spin text-blue-500" />
            <span className="text-gray-600">Loading accounts...</span>
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
                <h3 className="text-red-800 font-semibold">Error Loading Accounts</h3>
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
          {accounts.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Building2 size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Accounts Found</h3>
              <p className="text-gray-600">
                {filters.search || hasActiveFilters
                  ? 'No accounts found matching your filters.' 
                  : 'No accounts available at the moment.'
                }
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center space-x-1">
                      <span>Balance</span>
                      <TrendingUp size={14} className="text-gray-400" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {accounts.map((account, index) => {
                  const BalanceIcon = getBalanceIcon(account.balance);
                  
                  return (
                    <tr key={account.accountId} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                      <td className="px-8 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-xs font-semibold">
                              {getInitials(account.name)}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{account.name}</div>
                            <div className="text-xs text-gray-500">ID: {account.accountId.slice(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <BalanceIcon size={16} className={`mr-2 ${getBalanceColor(account.balance, account.amountColour)}`} />
                          <div className={`text-lg font-bold ${getBalanceColor(account.balance, account.amountColour)}`}>
                            {formatBalance(account.balance)}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleAccountAction({ type: 'view', accountId: account.accountId })}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Account"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            onClick={() => handleAccountAction({ type: 'edit', accountId: account.accountId })}
                            className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Edit Account"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleAccountAction({ type: 'delete', accountId: account.accountId })}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Account"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
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
      {!loading && accounts.length > 0 && (
        <AccountsPagination
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

export default AllAccountsTable;