import React from 'react';
import { Eye, Edit, Trash2, IndianRupee } from 'lucide-react';
import { Investor } from './types';

interface InvestorTableRowProps {
  investor: Investor;
  index: number;
  onView: (investor: Investor) => void;
  onEdit: (investor: Investor) => void;
  onDelete: (investor: Investor) => void;
}

const InvestorTableRow: React.FC<InvestorTableRowProps> = ({
  investor,
  index,
  onView,
  onEdit,
  onDelete
}) => {
  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPaymentSystemColor = (paymentSystem: string) => {
    switch (paymentSystem) {
      case 'Monthly':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Quarterly':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Yearly':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'None':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <tr className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
      <td className="px-8 py-4 whitespace-nowrap">
        <div className="text-sm font-semibold text-gray-900 max-w-xs">
          {investor.name}
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm font-medium text-gray-700">{investor.username}</span>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getPaymentSystemColor(investor.paymentSystem)}`}>
          {investor.paymentSystem}
        </span>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="text-sm">
            <div className="text-xs text-red-500 font-medium">{investor.amountText}</div>
            <div className="text-lg font-bold text-red-600">
              {formatAmount(investor.amount)}
            </div>
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => onView(investor)}
            className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
            title="View Investor"
          >
            <Eye size={16} />
          </button>
          <button 
            onClick={() => onEdit(investor)}
            className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
            title="Edit Investor"
          >
            <Edit size={16} />
          </button>
          <button 
            onClick={() => onDelete(investor)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Investor"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default InvestorTableRow;