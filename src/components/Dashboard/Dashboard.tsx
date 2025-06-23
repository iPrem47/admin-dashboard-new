import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  IndianRupee, 
  TrendingUp, 
  Activity,
  Clock,
  CheckCircle,
  DollarSign,
  TrendingDown,
  RefreshCw,
  Download
} from 'lucide-react';
import { useDashboardData } from './hooks/useDashboardData';
import StatsCard from './StatsCard';
import InvestmentChart from './InvestmentChart';
import PaymentSystemChart from './PaymentSystemChart';
import RecentActivity from './RecentActivity';
import TopInvestors from './TopInvestors';
import QuickActions from './QuickActions';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    stats,
    investmentTrends,
    paymentSystemData,
    recentActivities,
    topInvestors,
    loading,
    error,
    refetch
  } = useDashboardData();

  const handleQuickAction = (action: string) => {
    // Map action keys to routes
    const routeMap: { [key: string]: string } = {
      'add-investor': '/investors/add',
      'view-investors': '/investors',
      'profit-loss': '/profit-loss',
      'transactions': '/transactions',
      'reports': '/investors/reports',
      'analytics': '/dashboard'
    };

    const route = routeMap[action];
    if (route) {
      navigate(route);
    }
  };

  const handleRefresh = async () => {
    await refetch();
  };

  const handleExport = () => {
    console.log('Exporting dashboard data...');
    // Implement export functionality
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-50 via-white to-orange-50 rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-orange-500">AINFINITY</span> Dashboard
            </h1>
            <p className="text-gray-600">
              Monitor your investments, track performance, and manage your portfolio
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleRefresh}
              disabled={loading}
              className={`flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-xl transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              <span className="text-sm font-medium">{loading ? 'Loading...' : 'Refresh'}</span>
            </button>
            
            <button 
              onClick={handleExport}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-orange-500 text-white rounded-xl hover:from-cyan-600 hover:to-orange-600 transition-all shadow-md"
            >
              <Download size={18} />
              <span className="text-sm font-medium">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-sm">!</span>
            </div>
            <div>
              <h3 className="text-red-800 font-semibold">Error Loading Dashboard</h3>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Investors"
          value={stats.totalInvestors}
          change={{ value: 12.5, type: 'increase', period: 'vs last month' }}
          icon={Users}
          color="blue"
          loading={loading}
        />
        <StatsCard
          title="Total Investment"
          value={stats.totalInvestment}
          change={{ value: 8.2, type: 'increase', period: 'vs last month' }}
          icon={IndianRupee}
          color="green"
          loading={loading}
        />
        <StatsCard
          title="Monthly Returns"
          value={stats.monthlyReturn}
          change={{ value: 15.3, type: 'increase', period: 'vs last month' }}
          icon={TrendingUp}
          color="purple"
          loading={loading}
        />
        <StatsCard
          title="Active Users"
          value={stats.activeUsers}
          change={{ value: 5.7, type: 'increase', period: 'vs last month' }}
          icon={Activity}
          color="orange"
          loading={loading}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Pending Transactions"
          value={stats.pendingTransactions}
          icon={Clock}
          color="orange"
          loading={loading}
        />
        <StatsCard
          title="Completed Transactions"
          value={stats.completedTransactions}
          change={{ value: 23.1, type: 'increase', period: 'vs last month' }}
          icon={CheckCircle}
          color="green"
          loading={loading}
        />
        <StatsCard
          title="Total Profit"
          value={stats.totalProfit}
          change={{ value: 18.7, type: 'increase', period: 'vs last month' }}
          icon={DollarSign}
          color="cyan"
          loading={loading}
        />
        <StatsCard
          title="Total Loss"
          value={stats.totalLoss}
          change={{ value: 3.2, type: 'decrease', period: 'vs last month' }}
          icon={TrendingDown}
          color="red"
          loading={loading}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-1">
          <InvestmentChart data={investmentTrends} loading={loading} />
        </div>
        <div className="lg:col-span-1">
          <PaymentSystemChart data={paymentSystemData} loading={loading} />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <QuickActions onActionClick={handleQuickAction} />
        </div>
        <div className="lg:col-span-1">
          <RecentActivity activities={recentActivities} loading={loading} />
        </div>
        <div className="lg:col-span-1">
          <TopInvestors investors={topInvestors} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;