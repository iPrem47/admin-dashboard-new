import React from 'react';
import TransactionsTable from './TransactionsTable';

const Transactions: React.FC = () => {
  return (
    <div className="space-y-6">
      <TransactionsTable />
    </div>
  );
};

export default Transactions;