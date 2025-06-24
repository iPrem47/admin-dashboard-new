import React from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Loader2, 
  AlertCircle, 
  CreditCard, 
  ChevronLeft, 
  ChevronRight,
  Tag
} from 'lucide-react';
import { InvestorTransaction, TransactionsPagination } from './types';

interface TransactionsCardProps {
  transactions: InvestorTransaction[];
  loading: boolean;
  error: string | null;
  pagination: TransactionsPagination;
  onPageChange: (page: number) => void;
}

const TransactionsCard: React.FC<TransactionsCardProps> = ({ 
  transactions, 
  loading, 
  error, 
  pagination,
  onPageChange
}) => {
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
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
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

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-100">
        Transaction History
      </h3>
      
      {/* Loading State */}
      {loading && (
        <div className="py-8 text-center">
          <div className="flex items-center justify-center space-x-3">
            <Loader2 size={24} className="animate-spin text-cyan-500" />
            <span className="text-gray-600">Loading transactions...</span>
          </div>
        </div>
      )}
      
      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
          <div className="flex items-center space-x-3">
            <AlertCircle size={20} className="text-red-600" />
            <div>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Empty State */}
      {!loading && !error && transactions.length === 0 && (
        <div className="py-12 text-center">
          <CreditCard size={48} className="mx-auto text-gray-300 mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No Transactions Found</h4>
          <p className="text-gray-500">
            This investor doesn't have any transactions yet
          </p>
        </div>
      )}
      
      {/* Transactions Table */}
      {!loading && !error && transactions.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Mode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Tag
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {transactions.map((transaction, index) => (
                  <tr key={transaction.transactionId} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {transaction.transactionMode === 'Credit' ? (
                          <ArrowUpRight size={16} className="text-green-500 mr-2" />
                        ) : (
                          <ArrowDownRight size={16} className="text-red-500 mr-2" />
                        )}
                        <span className={`text-sm font-bold ${transaction.amountColour === 'green' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.amountColour === 'green' ? '+' : '-'}{formatAmount(Math.abs(transaction.amount))}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getTransactionTypeColor(transaction.transactionType)}`}>
                        {transaction.transactionType}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getTransactionModeColor(transaction.transactionMode)}`}>
                        {transaction.transactionMode}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getTagColor(transaction.tag)}`}>
                        {transaction.tag}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(transaction.transactionStatus)}`}>
                        <div className={`w-2 h-2 rounded-full mr-2 mt-0.5 ${
                          transaction.transactionStatus === 'Completed' ? 'bg-green-500' : 
                          transaction.transactionStatus === 'Pending' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        {transaction.transactionStatus}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{formatDate(transaction.createdAt)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold">{(pagination.currentPage - 1) * pagination.limit + 1}-{Math.min(pagination.currentPage * pagination.limit, pagination.totalResults)}</span> of <span className="font-semibold">{pagination.totalResults}</span> transactions
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onPageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={18} />
                </button>
                
                <div className="text-sm font-medium text-gray-700">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </div>
                
                <button
                  onClick={() => onPageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TransactionsCard;