export interface ProfitLossEntry {
  id: string;
  amount: number;
  tag: string;
  date: string;
  status: 'Completed' | 'Pending';
  category: 'Profit' | 'Loss';
}

export interface Statistics {
  totalProfit: number;
  totalLoss: number;
  netAmount: number;
  totalTransactions: number;
  profitTransactions: number;
  lossTransactions: number;
  pendingTransactions: number;
  profitPercentage: number;
  avgProfit: number;
  avgLoss: number;
}

export interface TagColorMap {
  [key: string]: string;
}