import React from 'react';
import { Users, Calendar, Link2, Edit, Trash2, UserPlus, Eye } from 'lucide-react';
import { Reference } from './types';
import { useNavigate } from 'react-router-dom';

interface ReferenceCardProps {
  reference: Reference;
  onEdit: (reference: Reference) => void;
  onDelete: (reference: Reference) => void;
  onView: (reference: Reference) => void;
}

const ReferenceCard: React.FC<ReferenceCardProps> = ({ reference, onEdit, onDelete, onView }) => {
  const navigate = useNavigate();
  
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
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
  
  const handleViewInvestors = () => {
    navigate(`/reference-investors/${reference.referenceId}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 bg-gradient-to-br ${colorClass} rounded-full flex items-center justify-center shadow-md`}>
              <span className="text-white text-lg font-semibold">
                {getInitials(reference.name)}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{reference.name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs text-gray-500">Updated: {formatDate(reference.updatedAt)}</span>
                {reference.deleted && (
                  <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-800 border border-red-200">
                    Deleted
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => onView(reference)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="View Reference Details"
            >
              <Eye size={18} />
            </button>
            <button 
              onClick={() => onEdit(reference)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit Reference"
            >
              <Edit size={18} />
            </button>
            <button 
              onClick={() => onDelete(reference)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Reference"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users size={18} className="text-blue-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500">Total Investors</div>
              <div className="text-lg font-bold text-gray-900">{reference.totalInvestors}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Link2 size={18} className="text-purple-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500">Reference ID</div>
              <div className="text-sm font-mono text-gray-900 truncate max-w-[120px]" title={reference.referenceId}>
                {reference.referenceId.substring(0, 8)}...
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-200">
        <button 
          onClick={handleViewInvestors}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all shadow-sm"
        >
          <UserPlus size={16} />
          <span className="text-sm font-medium">View Investors</span>
        </button>
      </div>
    </div>
  );
};

export default ReferenceCard;