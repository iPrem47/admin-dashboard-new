import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { useBulkTransactionDetails } from './hooks/useBulkTransactionDetails';
import BulkTransactionHeader from './BulkTransactionHeader';
import BulkTransactionSummaryCard from './BulkTransactionSummaryCard';
import BulkTransactionDetailsTable from './BulkTransactionDetailsTable';

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
      <BulkTransactionSummaryCard summary={summary} loading={loading} />
      
      {/* Transaction Details Table */}
      <BulkTransactionDetailsTable 
        transactions={transactions}
        loading={loading}
        error={error}
        filters={filters}
        setFilters={setFilters}
        totalAmount={totalAmount}
      />
    </div>
  );
};

export default BulkTransactionDetails;