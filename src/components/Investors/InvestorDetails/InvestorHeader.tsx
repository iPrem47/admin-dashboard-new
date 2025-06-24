import React from 'react';
import { ArrowLeft, RefreshCw, Download, Edit, Trash2, AlertCircle, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { InvestorProfile } from './types';
import { useExportInvestor } from './hooks/useExportInvestor';

interface InvestorHeaderProps {
  profile: InvestorProfile | null;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onAddFunds: () => void;
  onWithdraw: () => void;
  onStatement: () => void;
  onExport: () => void;
}

const InvestorHeader: React.FC<InvestorHeaderProps> = ({ 
  profile, 
  loading, 
  error, 
  onRefresh,
  onAddFunds,
  onWithdraw,
  onStatement,
  onExport
}) => {
  const navigate = useNavigate();
  const { exporting } = useExportInvestor();

  const handleBack = () => {
    navigate('/investors');
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
            onClick={onAddFunds}
            disabled={loading || !profile}
            className={`flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all shadow-md ${
              loading || !profile ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Plus size={18} />
            <span className="text-sm font-medium">Add Funds</span>
          </button>
          
          <button 
            onClick={onWithdraw}
            disabled={loading || !profile}
            className={`flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl hover:from-red-600 hover:to-orange-600 transition-all shadow-md ${
              loading || !profile ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Minus size={18} />
            <span className="text-sm font-medium">Withdraw</span>
          </button>
          
          <button 
            onClick={onStatement}
            disabled={loading || !profile}
            className={`flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all shadow-md ${
              loading || !profile ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span className="text-sm font-medium">Statement</span>
          </button>
          
          <button 
            onClick={onExport}
            disabled={loading || !profile || exporting}
            className={`flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all shadow-md ${
              loading || !profile || exporting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Download size={18} />
            <span className="text-sm font-medium">Export</span>
          </button>
          
          <button 
            onClick={onRefresh}
            disabled={loading}
            className={`flex items-center space-x-2 p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvestorHeader;