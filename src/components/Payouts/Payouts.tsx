import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import AddPayoutForm from './AddPayoutForm';
// import PayoutsTable from './PayoutsTable';

const Payouts: React.FC = () => {
  const [currentView, setCurrentView] = useState<'list' | 'add'>('list');

  // const handleAddPayout = () => {
  //   setCurrentView('add');
  // };

  const handleBackToList = () => {
    setCurrentView('list');
  };

  const handlePayoutSuccess = () => {
    setCurrentView('list');
  };

  if (currentView === 'add') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBackToList}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add New Payout</h1>
              <p className="text-gray-600">Create a payout for investor distributions</p>
            </div>
          </div>
        </div>

        <AddPayoutForm 
          onSuccess={handlePayoutSuccess}
          onCancel={handleBackToList}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* <PayoutsTable onAddPayout={handleAddPayout} /> */}
      <AddPayoutForm 
          onSuccess={handlePayoutSuccess}
          onCancel={handleBackToList}
        />
    </div>
  );
};

export default Payouts;