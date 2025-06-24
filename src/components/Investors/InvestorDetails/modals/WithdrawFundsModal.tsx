import React, { useState, useEffect } from 'react';
import { X, Minus, Plus, IndianRupee, Building2, AlertTriangle } from 'lucide-react';
import { InvestorProfile } from '../types';
import { apiService } from '../../../../services/api';

interface WithdrawFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  investor: InvestorProfile | null;
  onSuccess: () => void;
}

interface WithdrawalAmounts {
  pnlAmount: number;
  capitalAmount: number;
}

interface WithdrawFundsFormData {
  withdrawType: 'Capital' | 'Profit';
  amount: number;
}

const WithdrawFundsModal: React.FC<WithdrawFundsModalProps> = ({ isOpen, onClose, investor, onSuccess }) => {
  const [formData, setFormData] = useState<WithdrawFundsFormData>({
    withdrawType: 'Capital',
    amount: 0
  });
  
  const [withdrawalAmounts, setWithdrawalAmounts] = useState<WithdrawalAmounts>({
    pnlAmount: 0,
    capitalAmount: 0
  });
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tdsPercentage] = useState(10); // Fixed TDS percentage

  useEffect(() => {
    if (isOpen && investor) {
      fetchWithdrawalAmounts();
    }
  }, [isOpen, investor]);

  useEffect(() => {
    // Reset amount when withdraw type changes
    if (formData.withdrawType === 'Capital') {
      setFormData(prev => ({ ...prev, amount: 0 }));
    } else {
      setFormData(prev => ({ ...prev, amount: 0 }));
    }
  }, [formData.withdrawType]);

  if (!isOpen || !investor) return null;

  const fetchWithdrawalAmounts = async () => {
    if (!investor) return;
    
    try {
      setIsLoading(true);
      const response = await apiService.get(`/investor/admin/getWithdrawalAmount?investorId=${investor.id}`);
      
      if (response.success && response.data) {
        setWithdrawalAmounts({
          pnlAmount: response.data.pnlAmount,
          capitalAmount: response.data.capitalAmount
        });
        
        // Set initial amount based on withdraw type
        if (formData.withdrawType === 'Capital') {
          setFormData(prev => ({ ...prev, amount: 0 }));
        } else {
          setFormData(prev => ({ ...prev, amount: 0 }));
        }
      } else {
        throw new Error(response.message || 'Failed to fetch withdrawal amounts');
      }
    } catch (error: any) {
      console.error('Error fetching withdrawal amounts:', error);
      showNotification(error.message || 'Failed to fetch withdrawal amounts', 'error');
      
      // Fallback to mock data
      setWithdrawalAmounts({
        pnlAmount: 1125,
        capitalAmount: 500000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    const maxAmount = formData.withdrawType === 'Capital' 
      ? withdrawalAmounts.capitalAmount 
      : withdrawalAmounts.pnlAmount;

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    } else if (formData.amount > maxAmount) {
      newErrors.amount = `Amount cannot exceed ${formatAmount(maxAmount)}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate final amount (for profit, subtract TDS)
      const finalAmount = formData.withdrawType === 'Profit'
        ? formData.amount - (formData.amount * tdsPercentage / 100)
        : formData.amount;

      const payload = {
        amount: finalAmount,
        type: formData.withdrawType,
        transactionalBankId: investor.transactionalBankId,
        investorId: investor.id,
      };

      // Call API
      const response = await apiService.post('/transaction/admin/withdrawFunds', payload);
      
      if (response.success) {
        showNotification('Funds withdrawn successfully!', 'success');
        onSuccess();
        onClose();
      } else {
        throw new Error(response.message || 'Failed to withdraw funds');
      }
    } catch (error: any) {
      console.error('Error withdrawing funds:', error);
      showNotification(error.message || 'Failed to withdraw funds', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAmountChange = (amount: number) => {
    setFormData(prev => ({ ...prev, amount }));
    setErrors(prev => ({ ...prev, amount: '' }));
  };

  const incrementAmount = () => {
    const increment = formData.withdrawType === 'Capital' ? 100000 : 1000;
    const maxAmount = formData.withdrawType === 'Capital' 
      ? withdrawalAmounts.capitalAmount 
      : withdrawalAmounts.pnlAmount;
    
    const newAmount = Math.min(formData.amount + increment, maxAmount);
    setFormData(prev => ({ ...prev, amount: newAmount }));
    setErrors(prev => ({ ...prev, amount: '' }));
  };

  const decrementAmount = () => {
    const decrement = formData.withdrawType === 'Capital' ? 100000 : 1000;
    if (formData.amount > 0) {
      setFormData(prev => ({ ...prev, amount: Math.max(prev.amount - decrement, 0) }));
      setErrors(prev => ({ ...prev, amount: '' }));
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    // Create a simple toast notification
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg text-white font-medium transition-all duration-300 ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
      toast.style.opacity = '1';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      toast.style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 4000);
  };

  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate TDS amount and total amount for Profit withdrawal
  const tdsAmount = formData.withdrawType === 'Profit' ? (formData.amount * tdsPercentage / 100) : 0;
  const totalAmount = formData.amount - tdsAmount;

  // Check if amount exceeds available amount
  const maxAmount = formData.withdrawType === 'Capital' 
    ? withdrawalAmounts.capitalAmount 
    : withdrawalAmounts.pnlAmount;
  const isAmountExceeded = formData.amount > maxAmount;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Withdraw</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Withdraw Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Withdraw Type
            </label>
            <div className="flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="withdrawType"
                  value="Capital"
                  checked={formData.withdrawType === 'Capital'}
                  onChange={() => setFormData(prev => ({ ...prev, withdrawType: 'Capital' }))}
                  className="mr-2 text-green-600 focus:ring-green-500"
                />
                <span className="text-gray-900">Capital</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="withdrawType"
                  value="Profit"
                  checked={formData.withdrawType === 'Profit'}
                  onChange={() => setFormData(prev => ({ ...prev, withdrawType: 'Profit' }))}
                  className="mr-2 text-green-600 focus:ring-green-500"
                />
                <span className="text-gray-900">Profit</span>
              </label>
            </div>
          </div>

          {/* Withdrawal Amount */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Withdrawal Amount:
              </label>
              <span className="text-lg font-bold text-gray-900">
                {formData.withdrawType === 'Capital' 
                  ? formatAmount(withdrawalAmounts.capitalAmount)
                  : formatAmount(withdrawalAmounts.pnlAmount)}
              </span>
            </div>
            
            {formData.withdrawType === 'Profit' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="text-red-500 mr-1">*</span>
                  Enter Profit Amount
                </label>
                <input
                  type="number"
                  value={formData.amount || ''}
                  onChange={(e) => handleAmountChange(Number(e.target.value))}
                  placeholder="Enter amount"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-white ${
                    errors.amount || isAmountExceeded ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.amount && (
                  <p className="mt-2 text-sm text-red-600">{errors.amount}</p>
                )}
                {isAmountExceeded && !errors.amount && (
                  <p className="mt-2 text-sm text-red-600">
                    Amount cannot exceed {formatAmount(withdrawalAmounts.pnlAmount)}
                  </p>
                )}
              </div>
            )}
            
            {formData.withdrawType === 'Capital' && (
              <div className="flex items-center mb-4">
                <button
                  type="button"
                  onClick={decrementAmount}
                  className="p-3 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <Minus size={20} />
                </button>
                <div className="flex-1 mx-4">
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="number"
                      value={formData.amount || ''}
                      onChange={(e) => handleAmountChange(Number(e.target.value))}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-white text-center text-xl font-bold ${
                        errors.amount || isAmountExceeded ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.amount && (
                    <p className="mt-2 text-sm text-red-600">{errors.amount}</p>
                  )}
                  {isAmountExceeded && !errors.amount && (
                    <p className="mt-2 text-sm text-red-600">
                      Amount cannot exceed {formatAmount(withdrawalAmounts.capitalAmount)}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={incrementAmount}
                  className="p-3 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
            )}
          </div>

          {/* Details Card */}
          <div className="bg-gray-100 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Building2 size={20} className="text-gray-700" />
              <h3 className="text-lg font-semibold text-gray-900">
                {formData.withdrawType === 'Capital' ? 'Capital Details' : 'Profit Details'}
              </h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Withdraw Type:</span>
                <span className="font-semibold text-gray-900">{formData.withdrawType}</span>
              </div>
              
              {formData.withdrawType === 'Capital' ? (
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Total Amount:</span>
                  <span className="font-semibold text-green-600">{formatAmount(formData.amount)}</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Withdraw Amount:</span>
                    <span className="font-semibold text-gray-900">{formatAmount(formData.amount)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">TDS Percentage:</span>
                    <span className="font-semibold text-gray-900">{tdsPercentage}%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">TDS Amount:</span>
                    <span className="font-semibold text-red-600">- {formatAmount(tdsAmount)}</span>
                  </div>
                  
                  <div className="border-t border-gray-300 my-2 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-medium">Total Amount:</span>
                      <span className="font-bold text-green-600">{formatAmount(totalAmount)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Bank Details */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bank Details</h3>
            
            {/* Name As Per Bank */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="text-red-500 mr-1">*</span>
                Name As Per Bank
              </label>
              <input
                type="text"
                value={investor.nameAsPerPanCard}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700"
              />
            </div>
            
            {/* Bank Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="text-red-500 mr-1">*</span>
                Bank Name
              </label>
              <input
                type="text"
                value={investor.bankName}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700"
              />
            </div>
            
            {/* Account Number */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="text-red-500 mr-1">*</span>
                Account Number
              </label>
              <input
                type="text"
                value={investor.bankAccountNumber}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 font-mono"
              />
            </div>
            
            {/* IFSC Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="text-red-500 mr-1">*</span>
                IFSC Code
              </label>
              <input
                type="text"
                value={investor.ifscCode}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 font-mono"
              />
            </div>
          </div>

          {/* Warning for large withdrawals */}
          {formData.amount > 100000 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 pt-0.5">
                  <AlertTriangle size={20} className="text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">Large Withdrawal Warning</h3>
                  <p className="mt-1 text-sm text-yellow-700">
                    You are about to withdraw a large amount. Please verify all details before proceeding.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || isLoading || formData.amount <= 0 || isAmountExceeded}
              className={`w-full py-3 px-4 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all shadow-lg ${
                isSubmitting || isLoading || formData.amount <= 0 || isAmountExceeded
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600'
              }`}
            >
              {isSubmitting ? 'Processing...' : isLoading ? 'Loading...' : 'Proceed'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WithdrawFundsModal;