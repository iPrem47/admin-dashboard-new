import React from 'react';
import { Calendar, Tag, CheckCircle, Clock, XCircle, AlertCircle, ArrowUpDown, CreditCard } from 'lucide-react';
import { BulkTransactionSummary } from './types';

interface BulkTransactionSummaryCardProps {
  summary: BulkTransactionSummary | null;
  loading: boolean;
}

const BulkTransactionSummaryCard: React.FC<BulkTransactionSummaryCardProps> = ({ summary, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return CheckCircle;
      case 'Pending':
        return Clock;
      case 'Failed':
        return XCircle;
      default:
        return AlertCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'text-green-600 bg-green-100';
      case 'Pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'Failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'Profit':
        return 'text-emerald-600 bg-emerald-100';
      case 'Loss':
        return 'text-red-600 bg-red-100';
      case 'Deposit':
        return 'text-blue-600 bg-blue-100';
      case 'Withdraw':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPaymentSystemColor = (system: string) => {
    switch (system) {
      case 'Monthly':
        return 'text-blue-600 bg-blue-100';
      case 'Weekly':
        return 'text-purple-600 bg-purple-100';
      case 'None':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-cyan-600 bg-cyan-100';
    }
  };

  const StatusIcon = getStatusIcon(summary.bulkTransactionStatus);
  const TransactionTypeIcon = ArrowUpDown;
  const PaymentSystemIcon = CreditCard;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-100">
        Transaction Summary
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-3 rounded-xl ${getStatusColor(summary.bulkTransactionStatus)}`}>
              <StatusIcon size={24} className={getStatusColor(summary.bulkTransactionStatus).split(' ')[0]} />
            </div>
            <div>
              <div className="text-sm text-gray-600">Status</div>
              <div className="text-lg font-semibold text-gray-900">{summary.bulkTransactionStatus}</div>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Last Updated: <span className="text-gray-900">{formatDate(summary.updatedAt)}</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-3 rounded-xl ${getTransactionTypeColor(summary.transactionType)}`}>
              <TransactionTypeIcon size={24} className={getTransactionTypeColor(summary.transactionType).split(' ')[0]} />
            </div>
            <div>
              <div className="text-sm text-gray-600">Transaction Type</div>
              <div className="text-lg font-semibold text-gray-900">{summary.transactionType}</div>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Created: <span className="text-gray-900">{formatDate(summary.createdAt)}</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-3 rounded-xl ${getPaymentSystemColor(summary.paymentSystem)}`}>
              <PaymentSystemIcon size={24} className={getPaymentSystemColor(summary.paymentSystem).split(' ')[0]} />
            </div>
            <div>
              <div className="text-sm text-gray-600">Payment System</div>
              <div className="text-lg font-semibold text-gray-900">{summary.paymentSystem}</div>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Date: <span className="text-gray-900">{summary.date || formatDate(summary.createdAt).split(',')[0]}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkTransactionSummaryCard;