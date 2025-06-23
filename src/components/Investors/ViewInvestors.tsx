import React, { useState, useCallback } from 'react';
import { Loader2, AlertCircle, TrendingUp } from 'lucide-react';
import { useInvestors } from './hooks/useInvestors';
import { Investor } from './types';
import InvestorTableHeader from './InvestorTableHeader';
import InvestorTableRow from './InvestorTableRow';
import InvestorTablePagination from './InvestorTablePagination';

const ViewInvestors: React.FC = () => {
  const { investors, loading, error, pagination, filters, setFilters, refetch } = useInvestors();
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentTypeFilter, setPaymentTypeFilter] = useState('All');
  const [isPaymentFilterOpen, setIsPaymentFilterOpen] = useState(false);

  // Debounced search
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    
    // Debounce search API call
    const timeoutId = setTimeout(() => {
      console.log('Searching for:', value);
      setFilters({ search: value, page: 1 });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [setFilters]);

  const handlePaymentTypeChange = (paymentType: string) => {
    console.log('Changing payment type filter to:', paymentType);
    setPaymentTypeFilter(paymentType);
    setIsPaymentFilterOpen(false);
    setFilters({ 
      paymentSystem: paymentType === 'All' ? undefined : paymentType, 
      page: 1 
    });
  };

  const handlePageChange = (page: number) => {
    console.log('Changing page to:', page);
    setFilters({ page });
  };

  const handleLimitChange = (limit: number) => {
    console.log('Changing limit to:', limit);
    setFilters({ limit, page: 1 });
  };

  const handleRefresh = async () => {
    console.log('Refreshing investors data...');
    try {
      await refetch();
      console.log('Refresh completed successfully');
    } catch (error) {
      console.error('Refresh failed:', error);
    }
  };

  const handleExport = () => {
    console.log('Exporting investors data...');
    // Create CSV data
    const csvData = investors.map(investor => ({
      Name: investor.name,
      Username: investor.username,
      'Payment System': investor.paymentSystem,
      Amount: investor.amount,
      'Investor Type': investor.investorType,
      Status: investor.status,
      'PAN Card': investor.panCardNumber || '',
      'Aadhar Card': investor.aadharCardNumber || ''
    }));
    
    // Convert to CSV string
    const csvString = [
      Object.keys(csvData[0] || {}).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');
    
    // Download CSV
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `investors-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Investor action handlers
  const handleViewInvestor = (investor: Investor) => {
    console.log('View investor:', investor);
    // Implement view investor modal/page
  };

  const handleEditInvestor = (investor: Investor) => {
    console.log('Edit investor:', investor);
    // Implement edit investor modal/page
  };

  const handleDeleteInvestor = (investor: Investor) => {
    console.log('Delete investor:', investor);
    // Implement delete confirmation modal
    if (window.confirm(`Are you sure you want to delete investor ${investor.name}?`)) {
      // Call delete API
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <InvestorTableHeader
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        paymentTypeFilter={paymentTypeFilter}
        onPaymentTypeChange={handlePaymentTypeChange}
        isPaymentFilterOpen={isPaymentFilterOpen}
        onPaymentFilterToggle={() => setIsPaymentFilterOpen(!isPaymentFilterOpen)}
        onRefresh={handleRefresh}
        onExport={handleExport}
        loading={loading}
        error={error}
        totalInvestors={pagination.totalInvestors}
      />

      {/* Loading State */}
      {loading && (
        <div className="p-12 text-center">
          <div className="flex items-center justify-center space-x-3">
            <Loader2 size={24} className="animate-spin text-cyan-500" />
            <span className="text-gray-600">Loading investors...</span>
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
                <h3 className="text-red-800 font-semibold">Error Loading Investors</h3>
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
                <TrendingUp size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Investors Found</h3>
              <p className="text-gray-600">
                {filters.search 
                  ? `No investors found matching "${filters.search}".` 
                  : 'No investors available at the moment.'
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
                    Username
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Payment System
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {investors.map((investor, index) => (
                  <InvestorTableRow
                    key={investor.id}
                    investor={investor}
                    index={index}
                    onView={handleViewInvestor}
                    onEdit={handleEditInvestor}
                    onDelete={handleDeleteInvestor}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && investors.length > 0 && (
        <InvestorTablePagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalInvestors={pagination.totalInvestors}
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

export default ViewInvestors;