import React, { useState } from 'react';
import { Save, ArrowLeft, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { InvestorFormData, FormErrors } from './types';
import { validateForm, validateSingleField } from './validation';
import FormSection from './FormSection';
import FormField from './FormField';
import FileUpload from './FileUpload';

interface AddInvestorFormProps {
  onBack: () => void;
  onSubmit: (data: InvestorFormData) => Promise<void>;
}

const AddInvestorForm: React.FC<AddInvestorFormProps> = ({ onBack, onSubmit }) => {
  const [formData, setFormData] = useState<InvestorFormData>({
    nameAsPanCard: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    amount: 500000,
    paymentSystem: '',
    referencePerson: '',
    paymentReceivedAccount: '',
    date: new Date().toISOString().split('T')[0],
    bankName: '',
    bankAccountNumber: '',
    ifsc: '',
    nomineeName: '',
    nomineeRelation: '',
    nomineeAadharNumber: '',
    panCardAccountType: 'Individual',
    panCardNumber: '',
    aadharCard: '',
    addressLine1: '',
    addressLine2: '',
    district: '',
    state: '',
    pinCode: '',
    country: 'India',
    description: '',
    activeInvestor: true,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const paymentSystemOptions = [
    { value: 'Monthly', label: 'Monthly' },
    { value: 'Quarterly', label: 'Quarterly' },
    { value: 'Yearly', label: 'Yearly' },
    { value: 'None', label: 'None' },
  ];

  const paymentAccountOptions = [
    { value: 'Dharma HDFC', label: 'Dharma HDFC' },
    { value: 'Dharma SBI', label: 'Dharma SBI' },
    { value: 'Dharma ICICI', label: 'Dharma ICICI' },
  ];

  const relationOptions = [
    { value: 'Father', label: 'Father' },
    { value: 'Mother', label: 'Mother' },
    { value: 'Spouse', label: 'Spouse' },
    { value: 'Son', label: 'Son' },
    { value: 'Daughter', label: 'Daughter' },
    { value: 'Brother', label: 'Brother' },
    { value: 'Sister', label: 'Sister' },
    { value: 'Other', label: 'Other' },
  ];

  const stateOptions = [
    { value: 'Gujarat', label: 'Gujarat' },
    { value: 'Maharashtra', label: 'Maharashtra' },
    { value: 'Rajasthan', label: 'Rajasthan' },
    { value: 'Delhi', label: 'Delhi' },
    { value: 'Karnataka', label: 'Karnataka' },
    { value: 'Tamil Nadu', label: 'Tamil Nadu' },
    // Add more states as needed
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    let processedValue: any = value;
    
    if (type === 'number') {
      processedValue = value === '' ? 0 : parseFloat(value);
    } else if (type === 'checkbox') {
      processedValue = (e.target as HTMLInputElement).checked;
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const error = validateSingleField(name, value, formData);
    
    if (error) {
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleFileChange = (fieldName: string) => (file: File | undefined) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: file
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const formErrors = validateForm(formData);
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      setSubmitError('Please fix the errors above before submitting.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await onSubmit(formData);
      setSubmitSuccess(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        setSubmitSuccess(false);
        onBack();
      }, 2000);
    } catch (error: any) {
      setSubmitError(error.message || 'Failed to add investor. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add Investor</h1>
              <p className="text-gray-600">Create a new investor account with complete details</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Success/Error Messages */}
        {submitSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
            <div className="flex items-center space-x-3">
              <CheckCircle size={24} className="text-green-600" />
              <div>
                <h3 className="text-green-800 font-semibold">Investor Added Successfully!</h3>
                <p className="text-green-600">Redirecting to investors list...</p>
              </div>
            </div>
          </div>
        )}

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

        {/* Basic Details */}
        <FormSection title="Basic Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Name As Per PanCard"
              name="nameAsPanCard"
              value={formData.nameAsPanCard}
              onChange={handleInputChange}
              onBlur={handleBlur}
              error={errors.nameAsPanCard}
              required
              placeholder="Investor Name As Per Pan Card"
            />
            <FormField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              onBlur={handleBlur}
              error={errors.firstName}
              required
              placeholder="Investor First Name"
            />
            <FormField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              onBlur={handleBlur}
              error={errors.lastName}
              required
              placeholder="Investor Last Name"
            />
            <FormField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={handleBlur}
              error={errors.email}
              required
              placeholder="Investor Email"
            />
            <FormField
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              onBlur={handleBlur}
              error={errors.phoneNumber}
              required
              placeholder="Investor Phone Number"
              prefix="+91"
            />
          </div>
        </FormSection>

        {/* Investment Details */}
        <FormSection title="Investment Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleInputChange}
              onBlur={handleBlur}
              error={errors.amount}
              required
              placeholder="500,000"
            />
            <FormField
              label="Payment System"
              name="paymentSystem"
              value={formData.paymentSystem}
              onChange={handleInputChange}
              onBlur={handleBlur}
              error={errors.paymentSystem}
              required
              options={paymentSystemOptions}
              placeholder="Select Payment System"
            />
            <div className="md:col-span-2">
              <FormField
                label="Reference Person"
                name="referencePerson"
                value={formData.referencePerson}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={errors.referencePerson}
                required
                placeholder="Dharma[24070]es-d27b-4aa7-9652-d979fd48826B]"
              />
            </div>
          </div>
        </FormSection>

        {/* Payment Details */}
        <FormSection title="Payment">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Payment Received Account"
              name="paymentReceivedAccount"
              value={formData.paymentReceivedAccount}
              onChange={handleInputChange}
              onBlur={handleBlur}
              error={errors.paymentReceivedAccount}
              required
              options={paymentAccountOptions}
              placeholder="Select Account"
            />
            <FormField
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              onBlur={handleBlur}
              error={errors.date}
              required
            />
          </div>
        </FormSection>

        {/* Bank Details */}
        <FormSection title="Bank Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Bank Name"
              name="bankName"
              value={formData.bankName}
              onChange={handleInputChange}
              onBlur={handleBlur}
              error={errors.bankName}
              required
              placeholder="Bank Name"
            />
            <FormField
              label="Bank Account Number"
              name="bankAccountNumber"
              value={formData.bankAccountNumber}
              onChange={handleInputChange}
              onBlur={handleBlur}
              error={errors.bankAccountNumber}
              required
              placeholder="Investor Bank Account Number"
            />
            <FormField
              label="IFSC"
              name="ifsc"
              value={formData.ifsc}
              onChange={handleInputChange}
              onBlur={handleBlur}
              error={errors.ifsc}
              required
              placeholder="IFSC"
            />
          </div>
        </FormSection>

        {/* Nominee Details */}
        <FormSection title="Nominee Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Nominee Name"
              name="nomineeName"
              value={formData.nomineeName}
              onChange={handleInputChange}
              onBlur={handleBlur}
              error={errors.nomineeName}
              required
              placeholder="Nominee Name"
            />
            <FormField
              label="Nominee Relation"
              name="nomineeRelation"
              value={formData.nomineeRelation}
              onChange={handleInputChange}
              onBlur={handleBlur}
              error={errors.nomineeRelation}
              required
              options={relationOptions}
              placeholder="Select Nominee Relation"
            />
            <FormField
              label="Nominee Aadhar Card Number"
              name="nomineeAadharNumber"
              value={formData.nomineeAadharNumber}
              onChange={handleInputChange}
              onBlur={handleBlur}
              error={errors.nomineeAadharNumber}
              required
              placeholder="Nominee Aadhar Card Number"
            />
          </div>
        </FormSection>

        {/* Personal Details */}
        <FormSection title="Personal Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <span className="text-red-500 mr-1">*</span>
                Pan Card Account Type
              </label>
              <div className="flex space-x-6">
                {['Individual', 'HUF', 'Minor'].map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="radio"
                      name="panCardAccountType"
                      value={type}
                      checked={formData.panCardAccountType === type}
                      onChange={handleInputChange}
                      className="mr-2 text-cyan-600 focus:ring-cyan-500"
                    />
                    <span className="text-sm text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>
            <FormField
              label="PAN Card Number"
              name="panCardNumber"
              value={formData.panCardNumber}
              onChange={handleInputChange}
              onBlur={handleBlur}
              error={errors.panCardNumber}
              required
              placeholder="Enter PAN Card Number"
            />
            <FormField
              label="Aadhar Card"
              name="aadharCard"
              value={formData.aadharCard}
              onChange={handleInputChange}
              onBlur={handleBlur}
              error={errors.aadharCard}
              required
              placeholder="Investor Aadhar Card"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <FormField
              label="Address Line 1"
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleInputChange}
              onBlur={handleBlur}
              error={errors.addressLine1}
              required
              placeholder="Address Line 1"
            />
            <FormField
              label="Address Line 2"
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleInputChange}
              placeholder="Address Line 2"
            />
            <FormField
              label="District"
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              onBlur={handleBlur}
              error={errors.district}
              required
              placeholder="District"
            />
            <FormField
              label="State"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              onBlur={handleBlur}
              error={errors.state}
              required
              options={stateOptions}
              placeholder="Select State"
            />
            <FormField
              label="PinCode"
              name="pinCode"
              value={formData.pinCode}
              onChange={handleInputChange}
              onBlur={handleBlur}
              error={errors.pinCode}
              required
              placeholder="PinCode"
            />
            <FormField
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              onBlur={handleBlur}
              error={errors.country}
              required
              placeholder="Country"
            />
          </div>
        </FormSection>

        {/* Documents Upload */}
        <FormSection title="Documents Upload">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileUpload
              label="Aadhar Card"
              name="aadharCardFile"
              file={formData.aadharCardFile}
              onChange={handleFileChange('aadharCardFile')}
              required
            />
            <FileUpload
              label="Pan Card"
              name="panCardFile"
              file={formData.panCardFile}
              onChange={handleFileChange('panCardFile')}
              required
            />
            <FileUpload
              label="Cheque/Passbook File"
              name="chequePassbookFile"
              file={formData.chequePassbookFile}
              onChange={handleFileChange('chequePassbookFile')}
              required
            />
            <FileUpload
              label="Bank Statement File"
              name="bankStatementFile"
              file={formData.bankStatementFile}
              onChange={handleFileChange('bankStatementFile')}
              required
            />
            <FileUpload
              label="Signature File"
              name="signatureFile"
              file={formData.signatureFile}
              onChange={handleFileChange('signatureFile')}
              required
            />
          </div>

          <div className="mt-6">
            <FormField
              label="Description"
              name="description"
              type="textarea"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Additional notes or description..."
              rows={4}
            />
          </div>
        </FormSection>

        {/* Active Investor Toggle */}
        <FormSection title="">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="activeInvestor"
              checked={formData.activeInvestor}
              onChange={handleInputChange}
              className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
            />
            <label className="text-sm font-medium text-gray-700">
              Active Investor
            </label>
          </div>
        </FormSection>

        {/* Submit Button */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span className="text-red-500">*</span> Required fields
            </div>
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
                  <span>Adding Investor...</span>
                </>
              ) : submitSuccess ? (
                <>
                  <CheckCircle size={20} />
                  <span>Added Successfully!</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>Add Investor</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddInvestorForm;