import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './components/auth/LoginPage';
import Sidebar from './components/Sidebar';
import UsersTable from './components/UsersTable';
import ProfitLoss from './components/ProfitLoss';
import ViewInvestors from './components/Investors/ViewInvestors';
import AddInvestor from './components/Investors/AddInvestor/AddInvestor';
import Dashboard from './components/Dashboard/Dashboard';
import Payouts from './components/Payouts/Payouts';
import BulkTransactions from './components/BulkTransactions/BulkTransactions';
import Transactions from './components/Transactions/Transactions';
import PendingTransactions from './components/PendingTransactions/PendingTransactions';
import AddFunds from './components/AddFunds/AddFunds';
import WithdrawFunds from './components/WithdrawFunds/WithdrawFunds';

const DashboardLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <Routes>
              {/* Dashboard Routes */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* User Routes */}
              <Route path="/users" element={<UsersTable />} />
              
              {/* Investor Routes */}
              <Route path="/investors" element={<ViewInvestors />} />
              <Route path="/investors/add" element={<AddInvestor onBack={() => window.history.back()} />} />
              <Route path="/investors/reports" element={
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Investor Reports</h2>
                  <p className="text-gray-600">This section is under development.</p>
                </div>
              } />
              
              {/* Transaction Routes */}
              <Route path="/profit-loss" element={<ProfitLoss />} />
              <Route path="/payouts" element={<Payouts />} />
              <Route path="/bulk-transactions" element={<BulkTransactions />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/pending-transactions" element={<PendingTransactions />} />
              <Route path="/add-transaction" element={
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Add Transaction</h2>
                  <p className="text-gray-600">This section is under development.</p>
                </div>
              } />
              <Route path="/add-funds" element={<AddFunds />} />
              <Route path="/withdraw-funds" element={<WithdrawFunds />} />
              
              {/* Account Routes */}
              <Route path="/account-settings" element={
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Settings</h2>
                  <p className="text-gray-600">This section is under development.</p>
                </div>
              } />
              <Route path="/profile" element={
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile</h2>
                  <p className="text-gray-600">This section is under development.</p>
                </div>
              } />
              <Route path="/security" element={
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Security</h2>
                  <p className="text-gray-600">This section is under development.</p>
                </div>
              } />
              
              {/* Tally Export Route */}
              <Route path="/tally-export" element={
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Tally Export</h2>
                  <p className="text-gray-600">This section is under development.</p>
                </div>
              } />
              
              {/* Catch all route - redirect to dashboard */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/*" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;