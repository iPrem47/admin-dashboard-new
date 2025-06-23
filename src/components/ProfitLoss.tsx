import React, { useState } from 'react';
import { 
  IndianRupee, 
  TrendingUp, 
  TrendingDown, 
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react';

// Import reusable components
import PageHeader from './ProfitLoss/PageHeader';
import StatisticsCard from './ProfitLoss/StatisticsCard';
import PerformanceCards from './ProfitLoss/PerformanceCards';
import TransactionForm from './ProfitLoss/TransactionForm';
import TransactionTable from './ProfitLoss/TransactionTable';

// Import hooks and utilities
import { useTransactions } from './ProfitLoss/hooks/useTransactions';
import { useStatistics } from './ProfitLoss/hooks/useStatistics';
import { formatAmount, formatDate, getAmountColor, getTagColor } from './ProfitLoss/utils';

const ProfitLoss: React.FC = () => {
  // API data
  const { transactions, loading, error, refetch } = useTransactions();
  
  // Form state
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  
  // Filter state
  const [filterTag, setFilterTag] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Options
  const tagOptions = ['New', 'Old', 'Investment', 'Dividend', 'Loss', 'Profit', 'Trading', 'Bonus'];
  const filterOptions = ['All', 'New', 'Old', 'Investment', 'Dividend', 'Loss', 'Profit', 'Trading', 'Bonus'];

  // Calculate statistics using custom hook
  const statistics = useStatistics(transactions, filterTag);
  
  // Filter entries
  const filteredEntries = filterTag === 'All' ? transactions : transactions.filter(entry => entry.tag === filterTag);

  // Event handlers
  const handleSave = () => {
    if (!amount || !date || !selectedTag) {
      alert('Please fill in all required fields');
      return;
    }
    console.log('Saving entry:', { amount: parseFloat(amount), date, tag: selectedTag });
    // Reset form
    setAmount('');
    setDate('');
    setSelectedTag('');
  };

  const handleFinalAmount = () => {
    console.log('Final Amount:', statistics.netAmount);
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag);
    setIsTagDropdownOpen(false);
  };

  const handleFilterChange = (filter: string) => {
    setFilterTag(filter);
    setIsFilterOpen(false);
  };

  const handleRefresh = async () => {
    await refetch();
  };

  const handleExport = () => {
    console.log('Exporting data...');
    // Create CSV data
    const csvData = filteredEntries.map(entry => ({
      Amount: entry.amount,
      Tag: entry.tag,
      Date: entry.date,
      Category: entry.category,
      Status: entry.status
    }));
    
    // Convert to CSV string
    const csvString = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');
    
    // Download CSV
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `profit-loss-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader 
        onRefresh={handleRefresh} 
        onExport={handleExport}
        loading={loading}
        error={error}
      />

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-500"></div>
            <span className="text-gray-600">Loading transaction data...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-sm">!</span>
            </div>
            <div>
              <h3 className="text-red-800 font-semibold">Error Loading Data</h3>
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
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatisticsCard
          title="Net Amount"
          value={`${statistics.netAmount >= 0 ? '+' : ''}${formatAmount(statistics.netAmount)}`}
          subtitle={`${statistics.profitPercentage.toFixed(1)}% profit ratio`}
          icon={IndianRupee}
          trendIcon={statistics.netAmount >= 0 ? ArrowUpRight : ArrowDownRight}
          color={statistics.netAmount >= 0 ? 'emerald' : 'red'}
        />
        
        <StatisticsCard
          title="Total Profit"
          value={`+${formatAmount(statistics.totalProfit)}`}
          subtitle={`${statistics.profitTransactions} transactions`}
          icon={TrendingUp}
          trendIcon={TrendingUp}
          color="emerald"
        />
        
        <StatisticsCard
          title="Total Loss"
          value={`-${formatAmount(statistics.totalLoss)}`}
          subtitle={`${statistics.lossTransactions} transactions`}
          icon={TrendingDown}
          trendIcon={TrendingDown}
          color="red"
        />
        
        <StatisticsCard
          title="Total Transactions"
          value={statistics.totalTransactions.toString()}
          subtitle={`${statistics.pendingTransactions} pending`}
          icon={BarChart3}
          trendIcon={Activity}
          color="blue"
        />
      </div>

      {/* Performance Cards */}
      <PerformanceCards statistics={statistics} formatAmount={formatAmount} />

      {/* Transaction Form */}
      <TransactionForm
        amount={amount}
        date={date}
        selectedTag={selectedTag}
        isTagDropdownOpen={isTagDropdownOpen}
        tagOptions={tagOptions}
        onAmountChange={setAmount}
        onDateChange={setDate}
        onTagSelect={handleTagSelect}
        onTagDropdownToggle={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
        onSave={handleSave}
        onFinalAmount={handleFinalAmount}
        getTagColor={getTagColor}
      />

      {/* Transaction Table */}
      <TransactionTable
        entries={filteredEntries}
        totalEntries={transactions.length}
        filterTag={filterTag}
        isFilterOpen={isFilterOpen}
        filterOptions={filterOptions}
        onFilterChange={handleFilterChange}
        onFilterToggle={() => setIsFilterOpen(!isFilterOpen)}
        formatAmount={formatAmount}
        formatDate={formatDate}
        getAmountColor={getAmountColor}
        getTagColor={getTagColor}
        loading={loading}
      />
    </div>
  );
};

export default ProfitLoss;