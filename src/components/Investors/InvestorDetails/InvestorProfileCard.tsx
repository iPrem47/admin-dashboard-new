import React from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  CreditCard, 
  IndianRupee, 
  TrendingUp, 
  TrendingDown, 
  Tag, 
  Percent 
} from 'lucide-react';
import { InvestorProfile } from './types';

interface InvestorProfileCardProps {
  profile: InvestorProfile | null;
  loading: boolean;
}

const InvestorProfileCard: React.FC<InvestorProfileCardProps> = ({ profile, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="text-center py-8">
          <p className="text-gray-500">No investor profile data available</p>
        </div>
      </div>
    );
  }

  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-xl font-semibold">
              {getInitials(profile.name)}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-sm text-gray-600">@{profile.userName}</span>
              <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800 border border-green-200">
                Active
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="text-sm text-gray-500 mb-1">{profile.amountText}</div>
          <div className={`text-2xl font-bold ${profile.amountColour === 'red' ? 'text-red-600' : 'text-green-600'}`}>
            {formatAmount(profile.amount)}
          </div>
          <div className="flex items-center mt-1">
            {profile.profitOrLossAmount !== 0 && (
              <>
                {profile.profitOrLossAmountColour === 'red' ? (
                  <TrendingDown size={16} className="text-red-500 mr-1" />
                ) : (
                  <TrendingUp size={16} className="text-green-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${
                  profile.profitOrLossAmountColour === 'red' ? 'text-red-500' : 'text-green-500'
                }`}>
                  {formatAmount(Math.abs(profile.profitOrLossAmount))} {profile.profitOrLossAmountText}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-4 border border-cyan-100">
          <div className="flex items-center space-x-3 mb-2">
            <Mail size={18} className="text-cyan-600" />
            <span className="text-sm font-medium text-gray-700">Email</span>
          </div>
          <div className="text-sm text-gray-900 break-all">{profile.email || 'Not provided'}</div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border border-orange-100">
          <div className="flex items-center space-x-3 mb-2">
            <Percent size={18} className="text-orange-600" />
            <span className="text-sm font-medium text-gray-700">Return Percentage</span>
          </div>
          <div className="text-sm font-semibold text-gray-900">{profile.returnInPercentage}%</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
          <div className="flex items-center space-x-3 mb-2">
            <Calendar size={18} className="text-green-600" />
            <span className="text-sm font-medium text-gray-700">Payment System</span>
          </div>
          <div className="text-sm font-semibold text-gray-900">{profile.paymentSystemName}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
            Personal Information
          </h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <User size={16} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-600">Name as per PAN Card</span>
              </div>
              <div className="text-gray-900 pl-6">{profile.nameAsPerPanCard}</div>
            </div>
            
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <CreditCard size={16} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-600">PAN Card</span>
              </div>
              <div className="text-gray-900 pl-6">
                <span className="font-mono">{profile.panCardNumber}</span>
                <span className="ml-2 text-xs text-gray-500">({profile.panCardTypeName})</span>
              </div>
            </div>
            
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <CreditCard size={16} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-600">Aadhar Card</span>
              </div>
              <div className="text-gray-900 pl-6 font-mono">{profile.aadharCardNumber}</div>
            </div>
            
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Tag size={16} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-600">Investor Type</span>
              </div>
              <div className="text-gray-900 pl-6">{profile.investorTypeName || 'Not specified'}</div>
            </div>
            
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <IndianRupee size={16} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-600">Investment Amount</span>
              </div>
              <div className="text-gray-900 pl-6 font-semibold">{formatAmount(profile.investorAmount)}</div>
            </div>
          </div>
        </div>
        
        {/* Address Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
            Address Information
          </h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-start space-x-2 mb-1">
                <div className="mt-1">
                  <Mail size={16} className="text-gray-400" />
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Address</span>
                  <div className="text-gray-900">
                    {profile.address1}
                    {profile.address2 && <div>{profile.address2}</div>}
                    <div>{profile.district}, {profile.state}, {profile.pinCode}</div>
                    <div>{profile.country}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <User size={16} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-600">Nominee Name</span>
              </div>
              <div className="text-gray-900 pl-6">{profile.nomineeName || 'Not provided'}</div>
            </div>
            
            {profile.nomineeName && (
              <>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Tag size={16} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">Nominee Relation</span>
                  </div>
                  <div className="text-gray-900 pl-6">{profile.nomineeRelation || 'Not provided'}</div>
                </div>
                
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <CreditCard size={16} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">Nominee Aadhar</span>
                  </div>
                  <div className="text-gray-900 pl-6 font-mono">{profile.nomineeAadharCardNumber || 'Not provided'}</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorProfileCard;