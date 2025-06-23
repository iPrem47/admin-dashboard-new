import React, { useState } from 'react';
import { Calendar, ChevronDown, Save, Loader2, CheckCircle, AlertCircle, CreditCard, FileText } from 'lucide-react';
import { usePaymentSystems } from './hooks/usePaymentSystems';
import { PayoutFormData, PayoutApiPayload, PayoutApiResponse } from './types';
import { apiService } from '../../services/api';

interface AddPayoutFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const AddPayoutForm: React.FC<AddPayoutFormProps> = ({ onSuccess, onCancel }) => {
  const { paymentSystems, loading: loadingPaymentSystems } = usePaymentSystems();
  
  const [formData, setFormData] = useState<PayoutFormData>({
    paymentSystemId: null,
    asOnDate: new Date().toISOString().slice(0, 16), // YYYY-MM-DDTHH:mm format
    note: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.paymentSystemId) {
      newErrors.paymentSystemId = 'Payment system is required';
    }

    if (!formData.asOnDate) {
      newErrors.asOnDate = 'Date is required';
    }

    if (!formData.note.trim()) {
      newErrors.note = 'Note is required';
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
      // Format the date as required by the API
      const formattedDate = new Date(formData.asOnDate).toISOString().slice(0, 19).replace('T', ' ');
      
      const payload: PayoutApiPayload = {
        paymentSystemId: formData.paymentSystemId!,
        asOnDate: formattedDate,
        note: formData.note.trim()
      };

      console.log('Submitting payout:', payload);

      const response: PayoutApiResponse = await apiService.post('/transaction/admin/payout', payload);

      if (response.success) {
        setSubmitSuccess(true);
        console.log('Payout created successfully:', response.message);
        
        // Reset form
        setFormData({
          paymentSystemId: null,
          asOnDate: new Date().toISOString().slice(0, 16),
          note: ''
        });
        
        // Call success callback after a short delay
        setTimeout(() => {
          setSubmitSuccess(false);
          onSuccess?.();
        }, 2000);
      } else {
        throw new Error(response.message || 'Failed to create payout');
      }
    } catch (error: any) {
      console.error('Error creating payout:', error);
      setSubmitError(error.message || 'Failed to create payout. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSystemSelect = (paymentSystemId: number, name: string) => {
    setFormData(prev => ({ ...prev, paymentSystemId }));
    setIsDropdownOpen(false);
    if (errors.paymentSystemId) {
      setErrors(prev => ({ ...prev, paymentSystemId: '' }));
    }
  };

  const handleInputChange = (field: keyof PayoutFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const selectedPaymentSystem = paymentSystems.find(ps => ps.paymentSystemId === formData.paymentSystemId);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-gradient-to-r from-emerald-100 to-green-100 rounded-xl">
          <CreditCard size={24} className="text-emerald-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Add Payout</h2>
          <p className="text-gray-600">Create a new payout for investors</p>
        </div>
      </div>

      {/* Success Message */}
      {submitSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6">
          <div className="flex items-center space-x-3">
            <CheckCircle size={24} className="text-green-600" />
            <div>
              <h3 className="text-green-800 font-semibold">Payout Created Successfully!</h3>
              <p className="text-green-600">The payout has been processed and will be distributed to investors.</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
          <div className="flex items-center space-x-3">
            <AlertCircle size={24} className="text-red-600" />
            <div>
              <h3 className="text-red-800 font-semibold">Submission Error</h3>
              <p className="text-red-600">{submitError}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Payment System and Date Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Payment System Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <span className="text-red-500 mr-1">*</span>
              Payment System
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                disabled={loadingPaymentSystems || isSubmitting}
                className={`w-full px-4 py-4 border rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all bg-white text-left flex items-center justify-between ${
                  errors.paymentSystemId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                } ${loadingPaymentSystems || isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'}`}
              >
                <span className={selectedPaymentSystem ? 'text-gray-900' : 'text-gray-400'}>
                  {loadingPaymentSystems ? 'Loading...' : selectedPaymentSystem?.name || 'Select Payment System'}
                </span>
                <ChevronDown 
                  size={20} 
                  className={`text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                />
              </button>
              
              {isDropdownOpen && !loadingPaymentSystems && !isSubmitting && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                  {paymentSystems.map((system) => (
                    <button
                      key={system.paymentSystemId}
                      type="button"
                      onClick={() => handlePaymentSystemSelect(system.paymentSystemId, system.name)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl flex items-center justify-between"
                    >
                      <span>{system.name}</span>
                      {system.paymentSystemId === formData.paymentSystemId && (
                        <CheckCircle size={16} className="text-emerald-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {errors.paymentSystemId && (
              <div className="flex items-center space-x-2 text-red-600 mt-2">
                <AlertCircle size={16} />
                <span className="text-sm">{errors.paymentSystemId}</span>
              </div>
            )}
          </div>

          {/* Date Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <span className="text-red-500 mr-1">*</span>
              Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={formData.asOnDate.slice(0, 10)} 
                onChange={(e) => handleInputChange('asOnDate', e.target.value)}
                disabled={isSubmitting}
                className={`w-full px-4 py-4 border rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all bg-white text-gray-900 ${
                  errors.asOnDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>
            {errors.asOnDate && (
              <div className="flex items-center space-x-2 text-red-600 mt-2">
                <AlertCircle size={16} />
                <span className="text-sm">{errors.asOnDate}</span>
              </div>
            )}
          </div>
        </div>

        {/* Note Field */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Note
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-4 text-gray-400" size={20} />
            <textarea
              value={formData.note}
              onChange={(e) => handleInputChange('note', e.target.value)}
              disabled={isSubmitting}
              placeholder="Enter payout description or notes..."
              rows={4}
              maxLength={500}
              className={`w-full pl-11 pr-4 py-4 border rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all bg-white text-gray-900 placeholder-gray-400 resize-none ${
                errors.note ? 'border-red-300 bg-red-50' : 'border-gray-300'
              } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            {errors.note ? (
              <div className="flex items-center space-x-2 text-red-600">
                <AlertCircle size={16} />
                <span className="text-sm">{errors.note}</span>
              </div>
            ) : (
              <div></div>
            )}
            <span className="text-sm text-gray-500">
              {formData.note.length} / 500
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-100">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors font-medium"
            >
              Cancel
            </button>
          )}
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
                <span>Creating Payout...</span>
              </>
            ) : submitSuccess ? (
              <>
                <CheckCircle size={20} />
                <span>Created Successfully!</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span>Add Payout</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPayoutForm;