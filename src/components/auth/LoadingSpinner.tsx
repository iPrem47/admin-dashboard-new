import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-orange-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg mb-4 mx-auto">
            <span className="text-white font-bold text-xl">AI</span>
          </div>
          <Loader2 className="w-8 h-8 text-cyan-500 animate-spin absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">AINFINITY</h2>
        <p className="text-gray-600">Loading your dashboard...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;