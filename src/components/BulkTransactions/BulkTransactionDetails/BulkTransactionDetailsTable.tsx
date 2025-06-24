import React, { useState } from 'react';
import { 
  Loader2, 
  AlertCircle, 
  Search, 
  Filter, 
  ChevronDown,
  X,
  ArrowUpRight,
  ArrowDownRight,
  User,
  Building2
} from 'lucide-react';
import { BulkTransactionDetail, BulkTransactionFilters } from './types';

interface BulkTransactionDetailsTableProps {
  transactions: BulkTransactionDetail[];
  loading: boolean;
  error: string | null;
  filters: BulkTransactionFilters;
  setFilters: (filters: Partial<BulkTransactionFilters>) => void;
  totalAmount: number;
}

const BulkTransactionDetailsTable: React.FC<BulkTransactionDetailsTableProps> = ({
  transactions,
  loading,
  error,
  filters,
  setFilters,
  totalAmount
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAccountFilterOpen, setIsAccountFilterOpen] = useState(false);
  const [isTransactionModeOpen, setIsTransactionModeOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState('All');
  const [selectedTransactionMode, setSelectedTransactionMode] = useState('All');

  // Get unique accounts for filtering
  const uniqueAccounts = Array.from(new Set(transactions.map(t => t.accountName))).filter(Boolean) as string[];
  
  // Transaction mode options
  const transactionModeOptions = [
    { label: "All", value: "" },
    { label: "Credit", value: "Credit" },
    { label: "Debit", value: "Debit" },
  ];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFilters({ search: value });
  };

  const handleAccountChange = (account: string) => {
    setSelectedAccount(account);
    setIsAccountFilterOpen(false);
    setFilters({ 
      account: account === 'All' ? undefined : account
    });
  };

  const handleTransactionModeChange = (mode: string) => {
    setSelectedTransactionMode(mode);
    setIsTransactionModeOpen(false);
    setFilters({ 
      transactionMode: mode === 'All' ? undefined : mode as any
    });
  };

  const clearAllFilters = () => {
    setSelectedAccount('All');
    setSelectedTransactionMode('All');
    setSearchTerm('');
    setFilters({
      account: undefined,
      transactionMode: undefined,
      status: undefined,
      search: undefined
    });
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

  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'new':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'old':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getInitials = (name: string = '') => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2);
  };

  const hasActiveFilters = selectedAccount !== 'All' || selectedTransactionMode !== 'All' || searchTerm;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-white to-gray-50 px-8 py-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Transaction Details</h2>
            <div className="flex items-center space-x-4 mt-1">
              <p className="text-sm text-gray-600">
                Total Amount: <span className="font-semibold text-gray-900">{formatAmount(totalAmount)}</span>
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
                placeholder="Search investor or account..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2.5 w-80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all bg-white"
              />
            </div>
          </div>
        </div>
        
        {/* Filters Row */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Account Filter */}
            <div className="relative">
              <button
                onClick={() => setIsAccountFilterOpen(!isAccountFilterOpen)}
                disabled={loading}
                className={`flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors min-w-[160px] justify-between ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Building2 size={16} className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">
                    {selectedAccount}
                  </span>
                </div>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isAccountFilterOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isAccountFilterOpen && !loading && (
                <div className="absolute z-10 w-64 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                  <button
                    onClick={() => handleAccountChange('All')}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-xl ${
                      selectedAccount === 'All' ? 'bg-cyan-50 text-cyan-700' : ''
                    }`}
                  >
                    All Accounts
                  </button>
                  {uniqueAccounts.map((account) => (
                    <button
                      key={account}
                      onClick={() => handleAccountChange(account)}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors last:rounded-b-xl ${
                        selectedAccount === account ? 'bg-cyan-50 text-cyan-700' : ''
                      }`}
                    >
                      {account}
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
                      onClick={() => handleTransactionModeChange(option.label)}
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
            Total Transactions: <span className="font-semibold text-gray-900">{transactions.length}</span>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="p-12 text-center">
          <div className="flex items-center justify-center space-x-3">
            <Loader2 size={24} className="animate-spin text-cyan-500" />
            <span className="text-gray-600">Loading transaction details...</span>
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
                <h3 className="text-red-800 font-semibold">Error Loading Transaction Details</h3>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="overflow-x-auto">
          {transactions.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Filter size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Transactions Found</h3>
              <p className="text-gray-600">
                {hasActiveFilters
                  ? 'No transactions found matching your filters.' 
                  : 'No transaction details available for this bulk transaction.'
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
                    Account
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Transaction Mode
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Tag
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
                {transactions.map((transaction, index) => (
                  <tr key={transaction._id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                    <td className="px-8 py-4 whitespace-nowrap">
                      {transaction.investorName ? (
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-orange-400 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-xs font-semibold">
                              {getInitials(transaction.investorName)}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{transaction.investorName}</div>
                            {transaction.investor && (
                              <div className="text-xs text-gray-500">@{transaction.investor}</div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{transaction.accountName || '-'}</div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {transaction.transactionMode === 'Credit' ? (
                          <ArrowUpRight size={16} className="text-green-500 mr-2" />
                        ) : (
                          <ArrowDownRight size={16} className="text-red-500 mr-2" />
                        )}
                        <div className={`text-sm font-bold ${transaction.transactionMode === 'Credit' ? 'text-green-600' : 'text-red-600'}`}>
                          {formatAmount(transaction.amount)}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${
                        transaction.transactionMode === 'Credit' 
                          ? 'bg-green-100 text-green-800 border-green-200' 
                          : 'bg-red-100 text-red-800 border-red-200'
                      }`}>
                        {transaction.transactionMode}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getTagColor(transaction.tag)}`}>
                        {transaction.tag}
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
                      <span className="text-sm text-gray-900">{formatDate(transaction.createdAt)}</span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Footer with Pagination if needed */}
      {!loading && !error && transactions.length > 0 && (
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{transactions.length}</span> transactions
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                Page <span className="font-semibold text-gray-900">1</span> of <span className="font-semibold text-gray-900">1</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkTransactionDetailsTable;