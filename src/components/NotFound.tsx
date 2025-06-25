import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-gradient-to-r from-cyan-400 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg mx-auto">
              <span className="text-white font-bold text-5xl">404</span>
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md">
              <span className="text-red-500 font-bold text-xl">!</span>
            </div>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Page Not Found
        </h1>
        
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm text-gray-700 dark:text-gray-200"
          >
            <ArrowLeft size={18} />
            <span className="font-medium">Go Back</span>
          </button>
          
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-orange-500 text-white rounded-xl hover:from-cyan-600 hover:to-orange-600 transition-all shadow-md"
          >
            <Home size={18} />
            <span className="font-medium">Go to Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;