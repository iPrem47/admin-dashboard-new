import React from 'react';
import { Eye, Edit, Trash2, MoreVertical } from 'lucide-react';
import { User } from './types';

interface UserTableRowProps {
  user: User;
  index: number;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const UserTableRow: React.FC<UserTableRowProps> = ({
  user,
  index,
  onView,
  onEdit,
  onDelete
}) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2);
  };

  return (
    <tr className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
      <td className="px-8 py-4 whitespace-nowrap">
        <input 
          type="checkbox" 
          className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500" 
        />
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm font-semibold text-gray-900">{user.username}</span>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-orange-400 rounded-full flex items-center justify-center mr-3">
            <span className="text-white text-xs font-semibold">
              {getInitials(user.fullName)}
            </span>
          </div>
          <span className="text-sm text-gray-900 font-medium">{user.fullName}</span>
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-600">{user.email}</span>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-600 font-mono">{user.phoneNo}</span>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex px-3 py-1 text-xs font-semibold bg-gradient-to-r from-cyan-100 to-orange-100 text-cyan-700 rounded-full border border-cyan-200">
          {user.userType}
        </span>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${
          user.status === 'Active' 
            ? 'bg-green-100 text-green-800 border-green-200' 
            : 'bg-red-100 text-red-800 border-red-200'
        }`}>
          <div className={`w-2 h-2 rounded-full mr-2 mt-0.5 ${
            user.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          {user.status}
        </span>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => onView(user)}
            className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
            title="View User"
          >
            <Eye size={16} />
          </button>
          <button 
            onClick={() => onEdit(user)}
            className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
            title="Edit User"
          >
            <Edit size={16} />
          </button>
          <button 
            onClick={() => onDelete(user)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete User"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default UserTableRow;