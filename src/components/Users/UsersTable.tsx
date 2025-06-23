import React, { useState, useCallback } from 'react';
import { Loader2, AlertCircle, Users as UsersIcon } from 'lucide-react';
import { useUsers } from './hooks/useUsers';
import { User } from './types';
import UserTableHeader from './UserTableHeader';
import UserTableRow from './UserTableRow';
import UserTablePagination from './UserTablePagination';

const UsersTable: React.FC = () => {
  const { users, loading, error, pagination, filters, setFilters, refetch } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');

  // Debounced search
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    
    // Debounce search API call
    const timeoutId = setTimeout(() => {
      setFilters({ search: value, page: 1 });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [setFilters]);

  const handlePageChange = (page: number) => {
    setFilters({ page });
  };

  const handleLimitChange = (limit: number) => {
    setFilters({ limit, page: 1 });
  };

  const handleRefresh = async () => {
    await refetch();
  };

  const handleExport = () => {
    console.log('Exporting users data...');
    // Create CSV data
    const csvData = users.map(user => ({
      Username: user.username,
      'Full Name': user.fullName,
      Email: user.email,
      'Phone No': user.phoneNo,
      'User Type': user.userType,
      Status: user.status
    }));
    
    // Convert to CSV string
    const csvString = [
      Object.keys(csvData[0] || {}).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');
    
    // Download CSV
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // User action handlers
  const handleViewUser = (user: User) => {
    console.log('View user:', user);
    // Implement view user modal/page
  };

  const handleEditUser = (user: User) => {
    console.log('Edit user:', user);
    // Implement edit user modal/page
  };

  const handleDeleteUser = (user: User) => {
    console.log('Delete user:', user);
    // Implement delete confirmation modal
    if (window.confirm(`Are you sure you want to delete user ${user.fullName}?`)) {
      // Call delete API
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <UserTableHeader
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onRefresh={handleRefresh}
        onExport={handleExport}
        loading={loading}
        error={error}
        totalUsers={pagination.totalUsers}
      />

      {/* Loading State */}
      {loading && (
        <div className="p-12 text-center">
          <div className="flex items-center justify-center space-x-3">
            <Loader2 size={24} className="animate-spin text-cyan-500" />
            <span className="text-gray-600">Loading users...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="p-8">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle size={20} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-red-800 font-semibold">Error Loading Users</h3>
                <p className="text-red-600 text-sm">{error}</p>
                <button 
                  onClick={handleRefresh}
                  className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium underline"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="overflow-x-auto">
          {users.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <UsersIcon size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Users Found</h3>
              <p className="text-gray-600">
                {filters.search 
                  ? `No users found matching "${filters.search}".` 
                  : 'No users available at the moment.'
                }
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-8 py-4 text-left">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500" 
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Full Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Phone No
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    User Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {users.map((user, index) => (
                  <UserTableRow
                    key={user.id}
                    user={user}
                    index={index}
                    onView={handleViewUser}
                    onEdit={handleEditUser}
                    onDelete={handleDeleteUser}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && users.length > 0 && (
        <UserTablePagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalUsers={pagination.totalUsers}
          limit={pagination.limit}
          hasNext={pagination.hasNext}
          hasPrev={pagination.hasPrev}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          loading={loading}
        />
      )}
    </div>
  );
};

export default UsersTable;