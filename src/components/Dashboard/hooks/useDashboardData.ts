import { useState, useEffect } from 'react';
import { DashboardStats, InvestmentTrend, PaymentSystemData, RecentActivity, TopInvestor } from '../types';
import { apiService } from '../../../services/api';

interface UseDashboardDataReturn {
  stats: DashboardStats;
  investmentTrends: InvestmentTrend[];
  paymentSystemData: PaymentSystemData[];
  recentActivities: RecentActivity[];
  topInvestors: TopInvestor[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useDashboardData = (): UseDashboardDataReturn => {
  const [stats, setStats] = useState<DashboardStats>({
    totalInvestors: 0,
    totalInvestment: 0,
    monthlyReturn: 0,
    activeUsers: 0,
    pendingTransactions: 0,
    completedTransactions: 0,
    totalProfit: 0,
    totalLoss: 0,
  });

  const [investmentTrends, setInvestmentTrends] = useState<InvestmentTrend[]>([]);
  const [paymentSystemData, setPaymentSystemData] = useState<PaymentSystemData[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [topInvestors, setTopInvestors] = useState<TopInvestor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with actual API calls
      // const [statsResponse, trendsResponse, activitiesResponse] = await Promise.all([
      //   apiService.get('/dashboard/stats'),
      //   apiService.get('/dashboard/trends'),
      //   apiService.get('/dashboard/activities')
      // ]);

      // Mock data for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock stats
      setStats({
        totalInvestors: 1722,
        totalInvestment: 125000000,
        monthlyReturn: 8500000,
        activeUsers: 1192,
        pendingTransactions: 45,
        completedTransactions: 2847,
        totalProfit: 15750000,
        totalLoss: 2340000,
      });

      // Mock investment trends
      setInvestmentTrends([
        { month: 'Jan', investment: 8500000, returns: 680000, profit: 425000 },
        { month: 'Feb', investment: 9200000, returns: 736000, profit: 460000 },
        { month: 'Mar', investment: 10100000, returns: 808000, profit: 505000 },
        { month: 'Apr', investment: 11500000, returns: 920000, profit: 575000 },
        { month: 'May', investment: 12800000, returns: 1024000, profit: 640000 },
        { month: 'Jun', investment: 14200000, returns: 1136000, profit: 710000 },
        { month: 'Jul', investment: 15600000, returns: 1248000, profit: 780000 },
        { month: 'Aug', investment: 17100000, returns: 1368000, profit: 855000 },
        { month: 'Sep', investment: 18900000, returns: 1512000, profit: 945000 },
        { month: 'Oct', investment: 20500000, returns: 1640000, profit: 1025000 },
        { month: 'Nov', investment: 22300000, returns: 1784000, profit: 1115000 },
        { month: 'Dec', investment: 24100000, returns: 1928000, profit: 1205000 },
      ]);

      // Mock payment system data
      setPaymentSystemData([
        { name: 'Monthly', value: 1245, color: '#10B981', percentage: 72.3 },
        { name: 'Quarterly', value: 287, color: '#3B82F6', percentage: 16.7 },
        { name: 'Yearly', value: 134, color: '#8B5CF6', percentage: 7.8 },
        { name: 'None', value: 56, color: '#6B7280', percentage: 3.2 },
      ]);

      // Mock recent activities
      setRecentActivities([
        {
          id: '1',
          type: 'investment',
          title: 'New Investment',
          description: 'RAHUL KUMAR SHANTILAL PATEL invested ₹5,01,690',
          amount: 501690,
          timestamp: '2 minutes ago',
          status: 'completed'
        },
        {
          id: '2',
          type: 'profit',
          title: 'Monthly Return',
          description: 'Monthly returns distributed to 245 investors',
          amount: 1250000,
          timestamp: '1 hour ago',
          status: 'completed'
        },
        {
          id: '3',
          type: 'user_registration',
          title: 'New User Registration',
          description: 'NAMRATABEN RATILAL NAYANI registered as new investor',
          timestamp: '3 hours ago',
          status: 'pending'
        },
        {
          id: '4',
          type: 'withdrawal',
          title: 'Withdrawal Request',
          description: 'PATEL PARTH CHANDRAKANT requested withdrawal of ₹2,50,000',
          amount: 250000,
          timestamp: '5 hours ago',
          status: 'pending'
        },
        {
          id: '5',
          type: 'investment',
          title: 'Investment Update',
          description: 'Indira Bhattacharjee updated investment amount',
          amount: 2009915,
          timestamp: '1 day ago',
          status: 'completed'
        }
      ]);

      // Mock top investors
      setTopInvestors([
        {
          id: '1',
          name: 'NAMRATABEN RATILAL NAYANI',
          username: 'RAI1726',
          totalInvestment: 2508450,
          monthlyReturn: 200676,
          status: 'active'
        },
        {
          id: '2',
          name: 'Indira Bhattacharjee',
          username: 'RAI1710',
          totalInvestment: 2009915,
          monthlyReturn: 160793,
          status: 'active'
        },
        {
          id: '3',
          name: 'JYOTI PATEL',
          username: 'RAI1719',
          totalInvestment: 1505070,
          monthlyReturn: 120406,
          status: 'active'
        },
        {
          id: '4',
          name: 'Gaurang Jagdishbhai Chhatrola',
          username: 'RAI1721',
          totalInvestment: 1003380,
          monthlyReturn: 80270,
          status: 'active'
        },
        {
          id: '5',
          name: 'RAHUL KUMAR SHANTILAL PATEL',
          username: 'RAI1727',
          totalInvestment: 501690,
          monthlyReturn: 40135,
          status: 'active'
        }
      ]);

    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchDashboardData();
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    stats,
    investmentTrends,
    paymentSystemData,
    recentActivities,
    topInvestors,
    loading,
    error,
    refetch
  };
};