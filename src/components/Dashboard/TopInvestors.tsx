import React from 'react';
import { Crown, TrendingUp, User } from 'lucide-react';
import { TopInvestor } from './types';

interface TopInvestorsProps {
  investors: TopInvestor[];
  loading?: boolean;
}

const TopInvestors: React.FC<TopInvestorsProps> = ({ investors, loading = false }) => {
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

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2);
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown size={16} className="text-yellow-500" />;
    if (index === 1) return <Crown size={16} className="text-gray-400" />;
    if (index === 2) return <Crown size={16} className="text-orange-500" />;
    return <span className="text-sm font-semibold text-gray-500">#{index + 1}</span>;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Investors</h3>
      
      <div className="space-y-4">
        {investors.map((investor, index) => (
          <div key={investor.id} className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-6 h-6">
                {getRankIcon(index)}
              </div>
              
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
                  {investor.avatar ? (
                    <img 
                      src={investor.avatar} 
                      alt={investor.name} 
                      className="w-12 h-12 rounded-full object-cover" 
                    />
                  ) : (
                    <span className="text-white text-sm font-semibold">
                      {getInitials(investor.name)}
                    </span>
                  )}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                  investor.status === 'active' ? 'bg-emerald-500' : 'bg-gray-400'
                }`}></div>
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-900 truncate">
                {investor.name}
              </h4>
              <p className="text-xs text-gray-500">
                @{investor.username}
              </p>
            </div>
            
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-900">
                {formatAmount(investor.totalInvestment)}
              </div>
              <div className="flex items-center space-x-1 text-xs text-emerald-600">
                <TrendingUp size={12} />
                <span>{formatAmount(investor.monthlyReturn)}/mo</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-100">
        <button className="w-full text-center text-sm font-medium text-cyan-600 hover:text-cyan-700 transition-colors">
          View All Investors
        </button>
      </div>
    </div>
  );
};

export default TopInvestors;