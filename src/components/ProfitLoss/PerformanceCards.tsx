import React from 'react';
import { PieChart, Download } from 'lucide-react';

interface Statistics {
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

interface PerformanceCardsProps {
  statistics: Statistics;
  formatAmount: (amount: number) => string;
}

const PerformanceCards: React.FC<PerformanceCardsProps> = ({ statistics, formatAmount }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Performance</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Avg. Profit per Transaction</span>
            <span className="text-sm font-semibold text-emerald-600">+{formatAmount(statistics.avgProfit)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Avg. Loss per Transaction</span>
            <span className="text-sm font-semibold text-red-500">-{formatAmount(statistics.avgLoss)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Success Rate</span>
            <span className="text-sm font-semibold text-blue-600">{statistics.profitPercentage.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Breakdown</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Profit Transactions</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">{statistics.profitTransactions}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Loss Transactions</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">{statistics.lossTransactions}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Pending</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">{statistics.pendingTransactions}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all">
            <PieChart size={16} />
            <span className="text-sm font-medium">View Analytics</span>
          </button>
          <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all">
            <Download size={16} />
            <span className="text-sm font-medium">Export Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerformanceCards;