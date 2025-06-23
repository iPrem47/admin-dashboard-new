import React from 'react';
import PendingTransactionsTable from './PendingTransactionsTable';

const PendingTransactions: React.FC = () => {
  return (
    <div className="space-y-6">
      <PendingTransactionsTable />
    </div>
  );
};

export default PendingTransactions;