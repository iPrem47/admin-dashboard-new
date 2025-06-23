import React from 'react';
import UsersTable from './Users/UsersTable';

// This is a wrapper component to maintain backward compatibility
const UsersTableWrapper: React.FC = () => {
  return <UsersTable />;
};

export default UsersTableWrapper;