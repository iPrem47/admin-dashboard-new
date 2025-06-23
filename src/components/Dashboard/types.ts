export interface DashboardStats {
  totalInvestors: number;
  totalInvestment: number;
  monthlyReturn: number;
  activeUsers: number;
  pendingTransactions: number;
  completedTransactions: number;
  totalProfit: number;
  totalLoss: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderWidth?: number;
    fill?: boolean;
  }[];
}

export interface InvestmentTrend {
  month: string;
  investment: number;
  returns: number;
  profit: number;
}

export interface PaymentSystemData {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

export interface RecentActivity {
  id: string;
  type: 'investment' | 'withdrawal' | 'profit' | 'user_registration';
  title: string;
  description: string;
  amount?: number;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface TopInvestor {
  id: string;
  name: string;
  username: string;
  totalInvestment: number;
  monthlyReturn: number;
  status: 'active' | 'inactive';
  avatar?: string;
}