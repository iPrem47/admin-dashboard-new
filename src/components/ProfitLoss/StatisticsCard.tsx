import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatisticsCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendIcon?: LucideIcon;
  color?: 'emerald' | 'red' | 'blue' | 'gray';
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend = 'neutral',
  trendIcon: TrendIcon,
  color = 'gray'
}) => {
  const colorClasses = {
    emerald: {
      text: 'text-emerald-600',
      bg: 'bg-emerald-100',
      trend: 'text-emerald-600'
    },
    red: {
      text: 'text-red-500',
      bg: 'bg-red-100',
      trend: 'text-red-500'
    },
    blue: {
      text: 'text-blue-600',
      bg: 'bg-blue-100',
      trend: 'text-blue-500'
    },
    gray: {
      text: 'text-gray-900',
      bg: 'bg-gray-100',
      trend: 'text-gray-600'
    }
  };

  const currentColor = colorClasses[color];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-2xl font-bold ${currentColor.text}`}>
            {value}
          </p>
          <div className="flex items-center mt-2">
            {TrendIcon && (
              <TrendIcon size={16} className={`${currentColor.trend} mr-1`} />
            )}
            <span className={`text-xs font-medium ${currentColor.trend}`}>
              {subtitle}
            </span>
          </div>
        </div>
        <div className={`p-3 ${currentColor.bg} rounded-xl`}>
          <Icon size={24} className={currentColor.text} />
        </div>
      </div>
    </div>
  );
};

export default StatisticsCard;