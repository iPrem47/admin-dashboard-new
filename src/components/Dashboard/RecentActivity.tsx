import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  UserPlus, 
  IndianRupee,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { RecentActivity as ActivityType } from './types';

interface RecentActivityProps {
  activities: ActivityType[];
  loading?: boolean;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities, loading = false }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'investment':
        return TrendingUp;
      case 'withdrawal':
        return TrendingDown;
      case 'profit':
        return IndianRupee;
      case 'user_registration':
        return UserPlus;
      default:
        return AlertCircle;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'investment':
        return 'text-emerald-600 bg-emerald-100';
      case 'withdrawal':
        return 'text-red-600 bg-red-100';
      case 'profit':
        return 'text-blue-600 bg-blue-100';
      case 'user_registration':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-emerald-500" />;
      case 'pending':
        return <Clock size={16} className="text-yellow-500" />;
      case 'failed':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <AlertCircle size={16} className="text-gray-500" />;
    }
  };

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

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
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
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
      
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = getActivityIcon(activity.type);
          const colorClass = getActivityColor(activity.type);
          
          return (
            <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className={`p-2 rounded-xl ${colorClass}`}>
                <Icon size={20} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-semibold text-gray-900 truncate">
                    {activity.title}
                  </h4>
                  {getStatusIcon(activity.status)}
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {activity.timestamp}
                </p>
              </div>
              
              {activity.amount && (
                <div className="text-right">
                  <div className={`text-sm font-semibold ${
                    activity.type === 'withdrawal' ? 'text-red-600' : 'text-emerald-600'
                  }`}>
                    {activity.type === 'withdrawal' ? '-' : '+'}{formatAmount(activity.amount)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-100">
        <button className="w-full text-center text-sm font-medium text-cyan-600 hover:text-cyan-700 transition-colors">
          View All Activities
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;