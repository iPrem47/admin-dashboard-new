import React, { useState, useCallback } from 'react';
import { 
  Loader2, 
  AlertCircle, 
  Clock, 
  Search, 
  Filter, 
  RefreshCw, 
  Download, 
  XCircle,
  Trash2,
  ChevronDown,
  X,
  ArrowUpRight,
  ArrowDownRight,
  User,
  Calendar,
  Building2
} from 'lucide-react';
import { usePendingTransactions } from './hooks/usePendingTransactions';
import { useTransactionModes } from './hooks/useTransactionModes';
import { useTransactionalBanks } from './hooks/useTransactionalBanks';
import { useAccounts } from './hooks/useAccounts';
import { PendingTransaction, PendingTransactionAction } from './types';
import PendingTransactionsPagination from './PendingTransactionsPagination';

const PendingTransactionsTable: React.FC = () => {
  const { transactions, loading, error, pagination, filters, setFilters, refetch } = usePendingTransactions();
  const { transactionModes, loading: loadingModes } = useTransactionModes();
  const { banks, loading: loadingBanks } = useTransactionalBanks();
  const { accounts, loading: loadingAccounts } = useAccounts();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isTransactionModeOpen, setIsTransactionModeOpen] = useState(false);
  const [isTransactionalBankOpen, setIsTransactionalBankOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState('All');
  const [selectedTransactionMode, setSelectedTransactionMode] = useState('All');
  const [selectedTransactionalBank, setSelectedTransactionalBank] = useState('All');
  const [selectedDate, setSelectedDate] = useState('');

  // Transaction Mode options (Credit/Debit)
  const transactionModeOptions = [
    { label: "All Modes", value: -1 },
    { label: "Credit", value: 1 },
    { label: "Debit", value: 2 },
  ];

  // Debounced search
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    
    const timeoutId = setTimeout(() => {
      setFilters({ search: value, page: 1 });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [setFilters]);

  const handleAccountChange = (accountId: string, accountName: string) => {
    setSelectedAccount(accountName);
    setIsAccountOpen(false);
    setFilters({ 
      accountFilter: accountId === 'All' ? undefined : accountId, 
      page: 1 
    });
  };

  const handleTransactionModeChange = (modeId: number, modeName: string) => {
    setSelectedTransactionMode(modeName);
    setIsTransactionModeOpen(false);
    setFilters({ 
      transactionModeFilter: modeId === -1 ? undefined : modeId, 
      page: 1 
    });
  };

  const handleTransactionalBankChange = (bankId: number, bankName: string) => {
    setSelectedTransactionalBank(bankName);
    setIsTransactionalBankOpen(false);
    setFilters({ 
      transactionalBankFilter: bankId === -1 ? undefined : bankId.toString(), 
      page: 1 
    });
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    // Convert YYYY-MM-DD to YYYYMMDD format for API
    const formattedDate = date ? date.replace(/-/g, '') : '';
    setFilters({ 
      dateYYYYMMddFilter: formattedDate || undefined, 
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
    console.log('Exporting pending transactions data...');
    const csvData = transactions.map(transaction => ({
      'Transaction ID': transaction.transactionId,
      'Investor Name': transaction.name,
      'Username': transaction.investorName,
      'Transaction Type': transaction.transactionType,
      'Transaction Mode': transaction.transactionMode,
      'Amount': transaction.amount,
      'Account Name': transaction.accountName,
      'Status': transaction.transactionStatus,
      'Date': new Date(transaction.dateTime).toLocaleString()
    }));
    
    const csvString = [
      Object.keys(csvData[0] || {}).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pending-transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const clearAllFilters = () => {
    setSelectedAccount('All');
    setSelectedTransactionMode('All');
    setSelectedTransactionalBank('All');
    setSelectedDate('');
    setSearchTerm('');
    setFilters({
      search: '',
      transactionModeFilter: undefined,
      transactionalBankFilter: undefined,
      dateYYYYMMddFilter: undefined,
      accountFilter: undefined,
      page: 1
    });
  };

  const handleTransactionAction = async (action: PendingTransactionAction) => {
    console.log('Pending transaction action:', action);
    
    if (action.type === 'unpaid') {
      // Handle mark as unpaid
      if (window.confirm('Are you sure you want to mark this transaction as unpaid?')) {
        try {
          // TODO: Implement API call to mark as unpaid
          console.log('Marking transaction as unpaid:', action.transactionId);
          // await apiService.post(`/transaction/admin/mark-unpaid/${action.transactionId}`);
          await refetch();
        } catch (error) {
          console.error('Error marking transaction as unpaid:', error);
        }
      }
    } else if (action.type === 'delete') {
      // Handle delete transaction
      if (window.confirm('Are you sure you want to delete this transaction? This action cannot be undone.')) {
        try {
          // TODO: Implement API call to delete transaction
          console.log('Deleting transaction:', action.transactionId);
          // await apiService.delete(`/transaction/admin/${action.transactionId}`);
          await refetch();
        } catch (error) {
          console.error('Error deleting transaction:', error);
        }
      }
    }
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

  const getTransactionModeColor = (mode: string) => {
    switch (mode) {
      case 'Credit':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Debit':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2);
  };

  const hasActiveFilters = selectedAccount !== 'All' || selectedTransactionMode !== 'All' || selectedTransactionalBank !== 'All' || selectedDate || searchTerm;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-white to-gray-50 px-8 py-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Pending Transactions</h2>
            <div className="flex items-center space-x-4 mt-1">
              <p className="text-sm text-gray-600">
                Monitor and manage pending transaction activities
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
                placeholder="Search..."
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
            {/* Account Filter */}
            <div className="relative">
              <button
                onClick={() => setIsAccountOpen(!isAccountOpen)}
                disabled={loading || loadingAccounts}
                className={`flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors min-w-[160px] justify-between ${
                  loading || loadingAccounts ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Building2 size={16} className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">
                    {selectedAccount}
                  </span>
                </div>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isAccountOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isAccountOpen && !loading && !loadingAccounts && (
                <div className="absolute z-10 w-64 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                  <button
                    onClick={() => handleAccountChange('All', 'All')}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-xl ${
                      selectedAccount === 'All' ? 'bg-cyan-50 text-cyan-700' : ''
                    }`}
                  >
                    All Accounts
                  </button>
                  {accounts.map((account) => (
                    <button
                      key={account.accountId}
                      onClick={() => handleAccountChange(account.accountId, account.name)}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors last:rounded-b-xl ${
                        selectedAccount === account.name ? 'bg-cyan-50 text-cyan-700' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{account.name}</span>
                        <span className={`text-xs ${account.amountColour === 'green' ? 'text-green-600' : 'text-red-600'}`}>
                          {formatAmount(account.balance)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Transaction Mode Filter */}
            <div className="relative">
              <button
                onClick={() => setIsTransactionModeOpen(!isTransactionModeOpen)}
                disabled={loading}
                className={`flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors min-w-[160px] justify-between ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <span className="text-sm font-medium text-gray-700">
                  {selectedTransactionMode}
                </span>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isTransactionModeOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isTransactionModeOpen && !loading && (
                <div className="absolute z-10 w-48 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg">
                  {transactionModeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleTransactionModeChange(option.value, option.label)}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                        selectedTransactionMode === option.label ? 'bg-cyan-50 text-cyan-700' : ''
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Transactional Bank Filter */}
            <div className="relative">
              <button
                onClick={() => setIsTransactionalBankOpen(!isTransactionalBankOpen)}
                disabled={loading || loadingBanks}
                className={`flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors min-w-[160px] justify-between ${
                  loading || loadingBanks ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <span className="text-sm font-medium text-gray-700">
                  {selectedTransactionalBank}
                </span>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isTransactionalBankOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isTransactionalBankOpen && !loading && !loadingBanks && (
                <div className="absolute z-10 w-48 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                  <button
                    onClick={() => handleTransactionalBankChange(-1, 'All')}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-xl ${
                      selectedTransactionalBank === 'All' ? 'bg-cyan-50 text-cyan-700' : ''
                    }`}
                  >
                    All Banks
                  </button>
                  {banks.map((bank) => (
                    <button
                      key={bank.id}
                      onClick={() => handleTransactionalBankChange(bank.id, bank.label)}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors last:rounded-b-xl ${
                        selectedTransactionalBank === bank.label ? 'bg-cyan-50 text-cyan-700' : ''
                      }`}
                    >
                      {bank.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Date Filter */}
            <div className="relative">
              <div className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-300 rounded-xl">
                <Calendar size={16} className="text-gray-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="text-sm font-medium text-gray-700 bg-transparent border-none outline-none"
                  placeholder="DD MMM YYYY"
                />
              </div>
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
            <Loader2 size={24} className="animate-spin text-cyan-500" />
            <span className="text-gray-600">Loading pending transactions...</span>
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
                <Clock size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Transactions Found</h3>
              <p className="text-gray-600">
                {filters.search || hasActiveFilters
                  ? 'No pending transactions found matching your filters.' 
                  : 'No pending transactions available at the moment.'
                }
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-4 text-left">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500" 
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Investor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Account
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Transaction Mode
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
                {transactions.map((transaction, index) => (
                  <tr key={transaction.transactionId} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500" 
                      />
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        ({transaction.investorName})
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 max-w-xs">
                        <div className="font-medium">{transaction.accountName}</div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="text-lg font-bold text-gray-900">
                          {formatAmount(transaction.amount)}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {transaction.transactionMode === 'Credit' ? (
                          <ArrowUpRight size={16} className="text-green-500 mr-2" />
                        ) : (
                          <ArrowDownRight size={16} className="text-red-500 mr-2" />
                        )}
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getTransactionModeColor(transaction.transactionMode)}`}>
                          {transaction.transactionMode}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 font-medium">{formatDate(transaction.dateTime)}</span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleTransactionAction({ type: 'unpaid', transactionId: transaction.transactionId })}
                          className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Mark as Unpaid"
                        >
                          <XCircle size={16} />
                        </button>
                        <button 
                          onClick={() => handleTransactionAction({ type: 'delete', transactionId: transaction.transactionId })}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Transaction"
                        >
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
        <PendingTransactionsPagination
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

export default PendingTransactionsTable;