import React from 'react';
import { Search, Filter, Plus, RefreshCw, Download, AlertCircle } from 'lucide-react';

interface UserTableHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  onExport: () => void;
  loading: boolean;
  error: string | null;
  totalUsers: number;
}

const UserTableHeader: React.FC<UserTableHeaderProps> = ({
  searchTerm,
  onSearchChange,
  onRefresh,
  onExport,
  loading,
  error,
  totalUsers
}) => {
  return (
    <div className="bg-gradient-to-r from-white to-gray-50 px-8 py-6 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Users</h2>
          <div className="flex items-center space-x-4 mt-1">
            <p className="text-sm text-gray-600">
              Manage your user accounts and permissions
            </p>
            {error && (
              <div className="flex items-center space-x-2 text-red-600">
                <AlertCircle size={16} />
                <span className="text-sm">Data loading error</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all bg-white"
            />
          </div>
          
          {/* Action Buttons */}
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
            onClick={onExport}
            disabled={loading}
            className={`flex items-center space-x-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Download size={18} />
            <span className="text-sm font-medium">Export</span>
          </button>
          
          <button className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-orange-500 text-white rounded-xl hover:from-cyan-600 hover:to-orange-600 transition-all shadow-md">
            <Plus size={18} />
            <span className="text-sm font-medium">Add User</span>
          </button>
        </div>
      </div>
      
      {/* Stats */}
      <div className="mt-4 flex items-center space-x-6">
        <div className="text-sm text-gray-600">
          Total Users: <span className="font-semibold text-gray-900">{totalUsers}</span>
        </div>
      </div>
    </div>
  );
};

export default UserTableHeader;