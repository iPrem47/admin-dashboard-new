import React from 'react';
import { DivideIcon as LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period: string;
  };
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'cyan';
  loading?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  color,
  loading = false
}) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-500',
      light: 'bg-blue-50',
      text: 'text-blue-600',
      gradient: 'from-blue-500 to-blue-600'
    },
    green: {
      bg: 'bg-emerald-500',
      light: 'bg-emerald-50',
      text: 'text-emerald-600',
      gradient: 'from-emerald-500 to-emerald-600'
    },
    purple: {
      bg: 'bg-purple-500',
      light: 'bg-purple-50',
      text: 'text-purple-600',
      gradient: 'from-purple-500 to-purple-600'
    },
    orange: {
      bg: 'bg-orange-500',
      light: 'bg-orange-50',
      text: 'text-orange-600',
      gradient: 'from-orange-500 to-orange-600'
    },
    red: {
      bg: 'bg-red-500',
      light: 'bg-red-50',
      text: 'text-red-600',
      gradient: 'from-red-500 to-red-600'
    },
    cyan: {
      bg: 'bg-cyan-500',
      light: 'bg-cyan-50',
      text: 'text-cyan-600',
      gradient: 'from-cyan-500 to-cyan-600'
    }
  };

  const currentColor = colorClasses[color];

  const formatValue = (val: string | number): string => {
    if (typeof val === 'number') {
      if (val >= 10000000) {
        return `₹${(val / 10000000).toFixed(1)}Cr`;
      } else if (val >= 100000) {
        return `₹${(val / 100000).toFixed(1)}L`;
      } else if (val >= 1000) {
        return `₹${(val / 1000).toFixed(1)}K`;
      }
      return val.toLocaleString();
    }
    return val.toString();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-10 w-10 bg-gray-200 rounded-xl"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
          {title}
        </h3>
        <div className={`p-3 ${currentColor.light} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={24} className={currentColor.text} />
        </div>
      </div>
      
      <div className="space-y-2">
        <p className={`text-3xl font-bold bg-gradient-to-r ${currentColor.gradient} bg-clip-text text-transparent`}>
          {formatValue(value)}
        </p>
        
        {change && (
          <div className="flex items-center space-x-1">
            {change.type === 'increase' ? (
              <TrendingUp size={16} className="text-emerald-500" />
            ) : (
              <TrendingDown size={16} className="text-red-500" />
            )}
            <span className={`text-sm font-medium ${
              change.type === 'increase' ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {change.value}%
            </span>
            <span className="text-sm text-gray-500">{change.period}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;