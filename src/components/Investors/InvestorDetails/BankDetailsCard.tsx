import React from 'react';
import { Building2, CreditCard, Hash } from 'lucide-react';
import { InvestorProfile } from './types';

interface BankDetailsCardProps {
  profile: InvestorProfile | null;
  loading: boolean;
}

const BankDetailsCard: React.FC<BankDetailsCardProps> = ({ profile, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-100">
        Bank Details
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-center space-x-3 mb-2">
            <Building2 size={18} className="text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Bank Name</span>
          </div>
          <div className="text-sm font-semibold text-gray-900">{profile.bankName}</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
          <div className="flex items-center space-x-3 mb-2">
            <CreditCard size={18} className="text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Account Number</span>
          </div>
          <div className="text-sm font-mono font-semibold text-gray-900">{profile.bankAccountNumber}</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-4 border border-green-100">
          <div className="flex items-center space-x-3 mb-2">
            <Hash size={18} className="text-green-600" />
            <span className="text-sm font-medium text-gray-700">IFSC Code</span>
          </div>
          <div className="text-sm font-mono font-semibold text-gray-900">{profile.ifscCode}</div>
        </div>
      </div>
      
      {profile.nameAsPerBank && (
        <div className="mt-4 bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <User size={16} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-600">Name as per Bank</span>
          </div>
          <div className="text-gray-900 pl-6">{profile.nameAsPerBank}</div>
        </div>
      )}
      
      {profile.transactionalBankName && (
        <div className="mt-4 bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <Building2 size={16} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-600">Transactional Bank</span>
          </div>
          <div className="text-gray-900 pl-6">{profile.transactionalBankName}</div>
        </div>
      )}
    </div>
  );
};

export default BankDetailsCard;