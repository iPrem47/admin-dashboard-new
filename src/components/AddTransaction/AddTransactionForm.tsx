import React, { useState } from 'react';
import { ArrowLeft, Save, Loader2, CheckCircle, AlertCircle, Plus, Calendar, FileText, Tag, DollarSign } from 'lucide-react';
import { useInvestors } from './hooks/useInvestors';
import { TransactionFormData, AddTransactionPayload, AddTransactionResponse, Investor } from './types';
import { apiService } from '../../services/api';
import InvestorDropdown from './InvestorDropdown';

interface AddTransactionFormProps {
  onBack: () => void;
}

const AddTransactionForm: React.FC<AddTransactionFormProps> = ({ onBack }) => {
  const { investors, loading: loadingInvestors, error: investorsError, searchInvestors } = useInvestors();
  
  const [formData, setFormData] = useState<TransactionFormData>({
    investorId: '',
    tag: '',
    amount: 0,
    dateTime: new Date().toISOString().slice(0, 16), // YYYY-MM-DDTHH:mm format
    note: ''
  });

  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const tagOptions = [
    { value: 'Old', label: 'Old' },
    { value: 'New', label: 'New' }
  ];

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.investorId) {
      newErrors.investorId = 'Please select an investor';
    }

    if (!formData.tag) {
      newErrors.tag = 'Please select a tag';
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!formData.dateTime) {
      newErrors.dateTime = 'Please select a date and time';
    }

    if (!formData.note.trim()) {
      newErrors.note = 'Please enter a note';
    } else if (formData.note.length > 500) {
      newErrors.note = 'Note must not exceed 500 characters';
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
    setSubmitError(null);

    try {
      // Format the date as required by the API (YYYY-MM-DD)
      const formattedDate = new Date(formData.dateTime).toISOString().slice(0, 10);
      
      const payload: AddTransactionPayload = {
        tag: formData.tag,
        investorId: formData.investorId,
        amount: formData.amount,
        date: formattedDate,
        note: formData.note.trim()
      };

      console.log('Submitting transaction:', payload);

      const response: AddTransactionResponse = await apiService.post('/transaction/addTransaction', payload);

      if (response.success) {
        setSubmitSuccess(true);
        console.log('Transaction created successfully:', response.message);
        
        // Show success notification
        showNotification('Transaction added successfully!', 'success');
        
        // Reset form
        setFormData({
          investorId: '',
          tag: '',
          amount: 0,
          dateTime: new Date().toISOString().slice(0, 16),
          note: ''
        });
        setSelectedInvestor(null);
        
        // Navigate back after a short delay
        setTimeout(() => {
          setSubmitSuccess(false);
          onBack();
        }, 2000);
      } else {
        throw new Error(response.message || 'Failed to create transaction');
      }
    } catch (error: any) {
      console.error('Error creating transaction:', error);
      const errorMessage = error.message || 'Failed to create transaction. Please try again.';
      setSubmitError(errorMessage);
      showNotification(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
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
        document.body.removeChild(toast);
      }, 300);
    }, 4000);
  };

  const handleInvestorSelect = (investor: Investor) => {
    setSelectedInvestor(investor);
    setFormData(prev => ({ ...prev, investorId: investor._id }));
    if (errors.investorId) {
      setErrors(prev => ({ ...prev, investorId: '' }));
    }
  };

  const handleInputChange = (field: keyof TransactionFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add Transaction</h1>
            <p className="text-gray-600">Create a new transaction for an investor</p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {submitSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <CheckCircle size={24} className="text-green-600" />
            <div>
              <h3 className="text-green-800 font-semibold">Transaction Added Successfully!</h3>
              <p className="text-green-600">Redirecting back to transactions...</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <AlertCircle size={24} className="text-red-600" />
            <div>
              <h3 className="text-red-800 font-semibold">Submission Error</h3>
              <p className="text-red-600">{submitError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Investor Selection */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-emerald-100 to-green-100 rounded-xl">
              <Plus size={24} className="text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Transaction Details</h2>
              <p className="text-gray-600">Select investor and enter transaction information</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Investor Dropdown */}
            <div className="lg:col-span-2">
              <InvestorDropdown
                investors={investors}
                selectedInvestor={selectedInvestor}
                onSelect={handleInvestorSelect}
                onSearch={searchInvestors}
                loading={loadingInvestors}
                error={errors.investorId || investorsError || undefined}
                required
              />
            </div>

            {/* Tag Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <span className="text-red-500 mr-1">*</span>
                Tag
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  value={formData.tag}
                  onChange={(e) => handleInputChange('tag', e.target.value)}
                  className={`w-full pl-11 pr-4 py-4 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white text-gray-900 ${
                    errors.tag ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Tag</option>
                  {tagOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              {errors.tag && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle size={16} className="mr-1" />
                  {errors.tag}
                </p>
              )}
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <span className="text-red-500 mr-1">*</span>
                Amount
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="number"
                  value={formData.amount || ''}
                  onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                  className={`w-full pl-11 pr-4 py-4 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white text-gray-900 ${
                    errors.amount ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.amount && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle size={16} className="mr-1" />
                  {errors.amount}
                </p>
              )}
            </div>

            {/* Date and Time */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <span className="text-red-500 mr-1">*</span>
                Date & Time
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="datetime-local"
                  value={formData.dateTime}
                  onChange={(e) => handleInputChange('dateTime', e.target.value)}
                  className={`w-full pl-11 pr-4 py-4 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white text-gray-900 ${
                    errors.dateTime ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.dateTime && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle size={16} className="mr-1" />
                  {errors.dateTime}
                </p>
              )}
            </div>

            {/* Note */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <span className="text-red-500 mr-1">*</span>
                Note
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-4 text-gray-400" size={20} />
                <textarea
                  value={formData.note}
                  onChange={(e) => handleInputChange('note', e.target.value)}
                  placeholder="Enter transaction note or description..."
                  rows={4}
                  maxLength={500}
                  className={`w-full pl-11 pr-4 py-4 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white text-gray-900 placeholder-gray-400 resize-none ${
                    errors.note ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                {errors.note ? (
                  <p className="text-sm text-red-600 flex items-center">
                    <AlertCircle size={16} className="mr-1" />
                    {errors.note}
                  </p>
                ) : (
                  <div></div>
                )}
                <span className="text-sm text-gray-500">
                  {formData.note.length} / 500
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span className="text-red-500">*</span> Required fields
            </div>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={onBack}
                disabled={isSubmitting}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || submitSuccess}
                className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-semibold transition-all shadow-lg ${
                  isSubmitting || submitSuccess
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Adding Transaction...</span>
                  </>
                ) : submitSuccess ? (
                  <>
                    <CheckCircle size={20} />
                    <span>Added Successfully!</span>
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    <span>Add Transaction</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddTransactionForm;