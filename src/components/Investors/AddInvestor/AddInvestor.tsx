import React from 'react';
import { useNavigate } from 'react-router-dom';
import AddInvestorForm from './AddInvestorForm';
import { InvestorFormData } from './types';

interface AddInvestorProps {
  onBack?: () => void;
}

const AddInvestor: React.FC<AddInvestorProps> = ({ onBack }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/investors');
    }
  };

  const handleSubmit = async (formData: InvestorFormData): Promise<void> => {
    try {
      console.log('Submitting investor data:', formData);
      
      // Create FormData for file uploads
      const submitData = new FormData();
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value instanceof File) {
          submitData.append(key, value);
        } else if (value !== undefined && value !== null) {
          submitData.append(key, value.toString());
        }
      });

      // TODO: Replace with actual API call
      // const response = await apiService.post('/investor/admin/create', submitData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Investor added successfully');
    } catch (error) {
      console.error('Error adding investor:', error);
      throw new Error('Failed to add investor. Please try again.');
    }
  };

  return (
    <AddInvestorForm
      onBack={handleBack}
      onSubmit={handleSubmit}
    />
  );
};

export default AddInvestor;