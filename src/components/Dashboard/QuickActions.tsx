import React from 'react';
import { 
  Plus, 
  Download, 
  FileText, 
  TrendingUp, 
  Users, 
  CreditCard,
  BarChart3,
  Settings
} from 'lucide-react';

interface QuickActionsProps {
  onActionClick: (action: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onActionClick }) => {
  const actions = [
    {
      id: 'add-investor',
      title: 'Add Investor',
      description: 'Register new investor',
      icon: Plus,
      color: 'from-emerald-500 to-green-500',
      hoverColor: 'hover:from-emerald-600 hover:to-green-600'
    },
    {
      id: 'view-investors',
      title: 'View Investors',
      description: 'Manage all investors',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      hoverColor: 'hover:from-blue-600 hover:to-cyan-600'
    },
    {
      id: 'profit-loss',
      title: 'Profit & Loss',
      description: 'Financial overview',
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500',
      hoverColor: 'hover:from-purple-600 hover:to-pink-600'
    },
    {
      id: 'transactions',
      title: 'Transactions',
      description: 'Payment history',
      icon: CreditCard,
      color: 'from-orange-500 to-red-500',
      hoverColor: 'hover:from-orange-600 hover:to-red-600'
    },
    {
      id: 'reports',
      title: 'Generate Report',
      description: 'Export analytics',
      icon: FileText,
      color: 'from-gray-500 to-gray-600',
      hoverColor: 'hover:from-gray-600 hover:to-gray-700'
    },
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'Detailed insights',
      icon: BarChart3,
      color: 'from-indigo-500 to-purple-500',
      hoverColor: 'hover:from-indigo-600 hover:to-purple-600'
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          
          return (
            <button
              key={action.id}
              onClick={() => onActionClick(action.id)}
              className={`group p-4 rounded-xl bg-gradient-to-r ${action.color} ${action.hoverColor} text-white transition-all duration-300 hover:scale-105 hover:shadow-lg`}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                  <Icon size={20} />
                </div>
                <div className="text-left">
                  <h4 className="text-sm font-semibold">{action.title}</h4>
                  <p className="text-xs opacity-90">{action.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;