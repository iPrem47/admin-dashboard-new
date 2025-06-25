import React from 'react';
import { Eye, Edit, Trash2, Users, Link2, Calendar } from 'lucide-react';
import { Reference } from './types';
import { useNavigate } from 'react-router-dom';

interface ReferenceTableProps {
  references: Reference[];
  onEdit: (reference: Reference) => void;
  onDelete: (reference: Reference) => void;
  onView: (reference: Reference) => void;
}

const ReferenceTable: React.FC<ReferenceTableProps> = ({ references, onEdit, onDelete, onView }) => {
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
  
  const handleViewInvestors = (referenceId: string) => {
    navigate(`/reference-investors/${referenceId}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Reference ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Total Investors
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Last Updated
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {references.map((reference, index) => (
              <tr key={reference.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                <td className="px-8 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 bg-gradient-to-br ${getColorClass(reference.name)} rounded-full flex items-center justify-center mr-3`}>
                      <span className="text-white text-xs font-semibold">
                        {getInitials(reference.name)}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">{reference.name}</div>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <Link2 size={16} className="text-gray-400" />
                    <span className="text-sm font-mono text-gray-600">{reference.referenceId.substring(0, 8)}...</span>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <Users size={16} className="text-gray-400" />
                    <span className="text-sm font-semibold text-gray-900">{reference.totalInvestors}</span>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600">{formatDate(reference.updatedAt)}</span>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${
                    reference.deleted 
                      ? 'bg-red-100 text-red-800 border-red-200' 
                      : 'bg-green-100 text-green-800 border-green-200'
                  }`}>
                    {reference.deleted ? 'Deleted' : 'Active'}
                  </span>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => onView(reference)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      onClick={() => onEdit(reference)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Reference"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => onDelete(reference)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Reference"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleViewInvestors(reference.referenceId)}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="View Investors"
                    >
                      <Users size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReferenceTable;