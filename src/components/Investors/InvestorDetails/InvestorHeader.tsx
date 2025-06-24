import React from 'react';
import { ArrowLeft, RefreshCw, Download, Edit, Trash2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { InvestorProfile } from './types';

interface InvestorHeaderProps {
  profile: InvestorProfile | null;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

const InvestorHeader: React.FC<InvestorHeaderProps> = ({ profile, loading, error, onRefresh }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/investors');
  };

  const handleExport = () => {
    if (!profile) return;
    
    // Create CSV data
    const csvData = {
      'Name': profile.name,
      'Username': profile.userName,
      'Email': profile.email,
      'Payment System': profile.paymentSystemName,
      'Amount': profile.amount,
      'PAN Card': profile.panCardNumber,
      'Aadhar Card': profile.aadharCardNumber,
      'Bank Name': profile.bankName,
      'Bank Account': profile.bankAccountNumber,
      'IFSC Code': profile.ifscCode,
      'Address': `${profile.address1}, ${profile.address2}, ${profile.district}, ${profile.state}, ${profile.pinCode}, ${profile.country}`
    };
    
    // Convert to CSV string
    const csvString = [
      Object.keys(csvData).join(','),
      Object.values(csvData).join(',')
    ].join('\n');
    
    // Download CSV
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `investor-${profile.userName}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {loading ? 'Loading Investor...' : profile ? profile.name : 'Investor Details'}
            </h1>
            <div className="flex items-center space-x-4 mt-1">
              <p className="text-sm text-gray-600">
                {profile ? `@${profile.userName}` : 'Loading investor details...'}
              </p>
              {error && (
                <div className="flex items-center space-x-2 text-red-600">
                  <AlertCircle size={16} />
                  <span className="text-sm">Error loading investor details</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={onRefresh}
            disabled={loading}
            className={`flex items-center space-x-2 px-4 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            <span className="text-sm font-medium">{loading ? 'Loading...' : 'Refresh'}</span>
          </button>
          
          <button 
            onClick={handleExport}
            disabled={loading || !profile}
            className={`flex items-center space-x-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors ${
              loading || !profile ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Download size={18} />
            <span className="text-sm font-medium">Export</span>
          </button>
          
          <button 
            disabled={loading || !profile}
            className={`flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-orange-500 text-white rounded-xl hover:from-cyan-600 hover:to-orange-600 transition-all shadow-md ${
              loading || !profile ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Edit size={18} />
            <span className="text-sm font-medium">Edit</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvestorHeader;