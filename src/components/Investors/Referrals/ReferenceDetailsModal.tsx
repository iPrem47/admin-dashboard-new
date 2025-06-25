import React from 'react';
import { X, Users, Calendar, Link2, User, CheckCircle, XCircle } from 'lucide-react';
import { Reference } from './types';

interface ReferenceDetailsModalProps {
  reference: Reference | null;
  isOpen: boolean;
  onClose: () => void;
}

const ReferenceDetailsModal: React.FC<ReferenceDetailsModalProps> = ({ reference, isOpen, onClose }) => {
  if (!isOpen || !reference) return null;

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2);
  };

  // Generate a consistent color based on the reference name
  const getColorClass = (name: string) => {
    const colors = [
      'from-blue-400 to-indigo-400',
      'from-green-400 to-emerald-400',
      'from-purple-400 to-pink-400',
      'from-orange-400 to-red-400',
      'from-yellow-400 to-amber-400',
      'from-cyan-400 to-blue-400',
      'from-rose-400 to-pink-400',
      'from-indigo-400 to-violet-400'
    ];
    
    // Simple hash function to get a consistent index
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const colorClass = getColorClass(reference.name);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-200 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${colorClass} rounded-full flex items-center justify-center shadow-md`}>
                <span className="text-white text-lg font-semibold">
                  {getInitials(reference.name)}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{reference.name}</h2>
                <p className="text-gray-600 mt-1">Reference Details</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Reference ID */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-center space-x-3 mb-2">
              <Link2 size={20} className="text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Reference ID</h3>
            </div>
            <div className="pl-9">
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <p className="font-mono text-gray-800 break-all">{reference.referenceId}</p>
              </div>
              <p className="text-xs text-gray-500 mt-2">Use this ID when adding investors through this reference</p>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center space-x-3 mb-2">
                <Users size={20} className="text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Total Investors</h3>
              </div>
              <div className="pl-9">
                <p className="text-3xl font-bold text-gray-900">{reference.totalInvestors}</p>
                <p className="text-xs text-gray-500 mt-1">Investors referred by this person</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center space-x-3 mb-2">
                <Calendar size={20} className="text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">Last Updated</h3>
              </div>
              <div className="pl-9">
                <p className="text-lg font-medium text-gray-900">{formatDate(reference.updatedAt)}</p>
                <p className="text-xs text-gray-500 mt-1">Last modification date</p>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-center space-x-3 mb-2">
              <User size={20} className="text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900">Status</h3>
            </div>
            <div className="pl-9">
              <div className="flex items-center space-x-2">
                {reference.deleted ? (
                  <>
                    <XCircle size={20} className="text-red-500" />
                    <span className="text-lg font-medium text-red-600">Deleted</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} className="text-green-500" />
                    <span className="text-lg font-medium text-green-600">Active</span>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Current reference status</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 rounded-b-2xl">
          <div className="flex justify-between">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
            <button
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all shadow-sm"
            >
              View Investors
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferenceDetailsModal;