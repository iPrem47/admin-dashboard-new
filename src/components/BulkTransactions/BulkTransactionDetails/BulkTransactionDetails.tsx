import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { useBulkTransactionDetails } from './hooks/useBulkTransactionDetails';
import BulkTransactionHeader from './BulkTransactionHeader';
import BulkTransactionSummaryCard from './BulkTransactionSummaryCard';
import BulkTransactionDetailsTable from './BulkTransactionDetailsTable';
import { apiService } from '../../../services/api';

const BulkTransactionDetails: React.FC = () => {
  const { bulkTransactionId } = useParams<{ bulkTransactionId: string }>();
  
  const { 
    transactions, 
    summary, 
    loading, 
    error, 
    filters, 
    setFilters, 
    refetch 
  } = useBulkTransactionDetails(bulkTransactionId || '');

  const [activeTab, setActiveTab] = useState<'completed' | 'pending'>('completed');
  const [completedTransactions, setCompletedTransactions] = useState<any[]>([]);
  const [pendingTransactions, setPendingTransactions] = useState<any[]>([]);
  const [loadingCompleted, setLoadingCompleted] = useState(false);
  const [loadingPending, setLoadingPending] = useState(false);
  const [completedError, setCompletedError] = useState<string | null>(null);
  const [pendingError, setPendingError] = useState<string | null>(null);
  const [completedPagination, setCompletedPagination] = useState({
    page: 1,
    limit: 20,
    totalPages: 0,
    totalResults: 0
  });
  const [pendingPagination, setPendingPagination] = useState({
    page: 1,
    limit: 20,
    totalPages: 0,
    totalResults: 0
  });

  // Fetch completed and pending transactions separately
  useEffect(() => {
    if (!bulkTransactionId) return;
    
    const fetchCompletedTransactions = async () => {
      try {
        setLoadingCompleted(true);
        setCompletedError(null);
        
        const response = await apiService.get(`/transaction/admin/all?bulkTransactionId=${bulkTransactionId}&transactionStatusId=1&page=1&limit=20`);
        
        if (response.success && response.data) {
          setCompletedTransactions(response.data.results);
          setCompletedPagination({
            page: response.data.page,
            limit: response.data.limit,
            totalPages: response.data.totalPages,
            totalResults: response.data.totalResults
          });
        } else {
          throw new Error(response.message || 'Failed to fetch completed transactions');
        }
      } catch (err: any) {
        console.error('Error fetching completed transactions:', err);
        setCompletedError(err.message || 'Failed to load completed transactions');
      } finally {
        setLoadingCompleted(false);
      }
    };
    
    const fetchPendingTransactions = async () => {
      try {
        setLoadingPending(true);
        setPendingError(null);
        
        const response = await apiService.get(`/transaction/admin/all?bulkTransactionId=${bulkTransactionId}&transactionStatusId=0&page=1&limit=20`);
        
        if (response.success && response.data) {
          setPendingTransactions(response.data.results);
          setPendingPagination({
            page: response.data.page,
            limit: response.data.limit,
            totalPages: response.data.totalPages,
            totalResults: response.data.totalResults
          });
        } else {
          throw new Error(response.message || 'Failed to fetch pending transactions');
        }
      } catch (err: any) {
        console.error('Error fetching pending transactions:', err);
        setPendingError(err.message || 'Failed to load pending transactions');
      } finally {
        setLoadingPending(false);
      }
    };
    
    fetchCompletedTransactions();
    fetchPendingTransactions();
  }, [bulkTransactionId]);

  // Calculate total amount
  const totalAmount = transactions.reduce((sum, transaction) => {
    // Only count credit transactions to avoid double counting
    if (transaction.transactionMode === 'Credit') {
      return sum + transaction.amount;
    }
    return sum;
  }, 0);

  // Handle refresh
  const handleRefresh = () => {
    refetch();
  };

  // Handle export
  const handleExport = () => {
    if (!transactions.length) return;
    
    console.log('Exporting bulk transaction details...');
    const csvData = transactions.map(transaction => ({
      'Investor': transaction.investorName || '-',
      'Investor ID': transaction.investor || '-',
      'Account': transaction.accountName || '-',
      'Amount': transaction.amount,
      'Transaction Mode': transaction.transactionMode || '-',
      'Tag': transaction.tag,
      'Status': transaction.bulkTransactionStatus,
      'Date': new Date(transaction.createdAt).toLocaleString()
    }));
    
    const csvString = [
      Object.keys(csvData[0] || {}).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulk-transaction-${bulkTransactionId}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // If no bulkTransactionId is provided, show error
  if (!bulkTransactionId) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 my-6">
        <div className="flex items-center space-x-3">
          <AlertCircle size={24} className="text-red-600" />
          <div>
            <h3 className="text-red-800 font-semibold">Error Loading Transaction</h3>
            <p className="text-red-600">No transaction ID provided</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <BulkTransactionHeader 
        summary={summary} 
        loading={loading} 
        error={error} 
        onRefresh={handleRefresh}
        onExport={handleExport}
      />
      
      {/* Main Loading State */}
      {loading && !summary && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="flex flex-col items-center justify-center">
            <Loader2 size={48} className="animate-spin text-cyan-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Transaction Details</h3>
            <p className="text-gray-600">Please wait while we fetch the transaction information...</p>
          </div>
        </div>
      )}
      
      {/* Main Error State */}
      {error && !loading && !summary && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
          <div className="flex items-center space-x-3">
            <AlertCircle size={24} className="text-red-600" />
            <div>
              <h3 className="text-red-800 font-semibold">Error Loading Transaction</h3>
              <p className="text-red-600">{error}</p>
              <button 
                onClick={handleRefresh}
                className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium underline"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Transaction Summary */}
      {summary && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <div className="text-sm font-medium text-gray-600 mb-1">Date</div>
              <div className="text-lg font-semibold text-green-600">
                {new Date(summary.createdAt).toLocaleDateString('en-US', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-600 mb-1">Transaction Type</div>
              <div className="text-lg font-semibold text-green-600">{summary.transactionType}</div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-600 mb-1">Payment System</div>
              <div className="text-lg font-semibold text-green-600">{summary.paymentSystem}</div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-600 mb-1">Bulk Transaction Status</div>
              <div className="text-lg font-semibold text-green-600">{summary.bulkTransactionStatus}</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex items-center space-x-2 px-6 py-4 font-medium text-sm transition-colors ${
              activeTab === 'completed'
                ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
              <path d="m9 12 2 2 4-4"></path>
            </svg>
            <span>Completed</span>
            {completedPagination.totalResults > 0 && (
              <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {completedPagination.totalResults}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex items-center space-x-2 px-6 py-4 font-medium text-sm transition-colors ${
              activeTab === 'pending'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>Pending</span>
            {pendingPagination.totalResults > 0 && (
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {pendingPagination.totalResults}
              </span>
            )}
          </button>
        </div>
        
        {/* Search and Filter Row */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all bg-white"
              />
            </div>
            
            <div className="relative">
              <button
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium">Account</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Completed Transactions Tab Content */}
        {activeTab === 'completed' && (
          <div>
            {loadingCompleted ? (
              <div className="p-12 text-center">
                <div className="flex items-center justify-center space-x-3">
                  <Loader2 size={24} className="animate-spin text-green-500" />
                  <span className="text-gray-600">Loading completed transactions...</span>
                </div>
              </div>
            ) : completedError ? (
              <div className="p-8">
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <AlertCircle size={20} className="text-red-600" />
                    <div>
                      <p className="text-red-600">{completedError}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : completedTransactions.length === 0 ? (
              <div className="p-12 text-center">
                <div className="flex flex-col items-center justify-center">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 mb-4">
                    <rect x="2" y="2" width="20" height="20" rx="2" ry="2"></rect>
                    <path d="M7 12h10"></path>
                    <path d="M7 16h10"></path>
                    <path d="M7 8h10"></path>
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No data</h3>
                  <p className="text-gray-500">No completed transactions found for this bulk transaction.</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Investor</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Account</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Transaction Mode</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Transaction Type</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {completedTransactions.map((transaction, index) => (
                      <tr key={transaction.transactionId} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">{transaction.name}</div>
                          <div className="text-xs text-gray-500">@{transaction.investorName}</div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{transaction.accountName}</div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-bold ${transaction.amountColour === 'green' ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.amountColour === 'green' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
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
                          <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full border bg-blue-100 text-blue-800 border-blue-200">
                            {transaction.transactionType}
                          </span>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full border bg-green-100 text-green-800 border-green-200">
                            <div className="w-2 h-2 rounded-full mr-2 mt-0.5 bg-green-500"></div>
                            {transaction.transactionStatus}
                          </span>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {new Date(transaction.dateTime).toLocaleDateString('en-US', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
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
              </div>
            )}
            
            {/* Pagination for Completed Transactions */}
            {!loadingCompleted && completedTransactions.length > 0 && (
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing <span className="font-semibold">{completedTransactions.length}</span> of <span className="font-semibold">{completedPagination.totalResults}</span> transactions
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-white transition-colors text-gray-600 hover:text-gray-900">
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page <span className="font-semibold">{completedPagination.page}</span> of <span className="font-semibold">{completedPagination.totalPages}</span>
                  </span>
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-white transition-colors text-gray-600 hover:text-gray-900">
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Pending Transactions Tab Content */}
        {activeTab === 'pending' && (
          <div>
            {loadingPending ? (
              <div className="p-12 text-center">
                <div className="flex items-center justify-center space-x-3">
                  <Loader2 size={24} className="animate-spin text-blue-500" />
                  <span className="text-gray-600">Loading pending transactions...</span>
                </div>
              </div>
            ) : pendingError ? (
              <div className="p-8">
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <AlertCircle size={20} className="text-red-600" />
                    <div>
                      <p className="text-red-600">{pendingError}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : pendingTransactions.length === 0 ? (
              <div className="p-12 text-center">
                <div className="flex flex-col items-center justify-center">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 mb-4">
                    <rect x="2" y="2" width="20" height="20" rx="2" ry="2"></rect>
                    <path d="M7 12h10"></path>
                    <path d="M7 16h10"></path>
                    <path d="M7 8h10"></path>
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No data</h3>
                  <p className="text-gray-500">No pending transactions found for this bulk transaction.</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Investor</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Account</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Transaction Mode</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Transaction Type</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {pendingTransactions.map((transaction, index) => (
                      <tr key={transaction.transactionId} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">{transaction.name}</div>
                          <div className="text-xs text-gray-500">@{transaction.investorName}</div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{transaction.accountName}</div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-bold ${transaction.amountColour === 'green' ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.amountColour === 'green' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
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
                          <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full border bg-blue-100 text-blue-800 border-blue-200">
                            {transaction.transactionType}
                          </span>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full border bg-yellow-100 text-yellow-800 border-yellow-200">
                            <div className="w-2 h-2 rounded-full mr-2 mt-0.5 bg-yellow-500"></div>
                            {transaction.transactionStatus}
                          </span>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {new Date(transaction.dateTime).toLocaleDateString('en-US', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
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
              </div>
            )}
            
            {/* Pagination for Pending Transactions */}
            {!loadingPending && pendingTransactions.length > 0 && (
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing <span className="font-semibold">{pendingTransactions.length}</span> of <span className="font-semibold">{pendingPagination.totalResults}</span> transactions
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-white transition-colors text-gray-600 hover:text-gray-900">
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page <span className="font-semibold">{pendingPagination.page}</span> of <span className="font-semibold">{pendingPagination.totalPages}</span>
                  </span>
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-white transition-colors text-gray-600 hover:text-gray-900">
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkTransactionDetails;