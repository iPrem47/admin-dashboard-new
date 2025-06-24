import React from 'react';
import { useNavigate } from 'react-router-dom';
import AddTransactionForm from './AddTransactionForm';

const AddTransaction: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/transactions');
  };

  return (
    <div className="space-y-6">
      <AddTransactionForm onBack={handleBack} />
    </div>
  );
};

export default AddTransaction;