import React, { useState, useCallback } from 'react';
import { 
  Loader2, 
  AlertCircle, 
  Search, 
  RefreshCw, 
  Download, 
  UserPlus, 
  Link2,
  Users,
  Plus
} from 'lucide-react';
import { useReferences } from './hooks/useReferences';
import { Reference } from './types';
import ReferenceCard from './ReferenceCard';
import AddReferenceModal from './AddReferenceModal';
import ReferenceTable from './ReferenceTable';

const Referrals: React.FC = () => {
  const { references, loading, error, filters, setFilters, refetch } = useReferences();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  // Debounced search
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    
    const timeoutId = setTimeout(() => {
      setFilters({ search: value });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [setFilters]);

  const handleRefresh = async () => {
    await refetch();
  };

  const handleExport = () => {
    console.log('Exporting references data...');
    const csvData = references.map(reference => ({
      'Name': reference.name,
      'Reference ID': reference.referenceId,
      'Total Investors': reference.totalInvestors,
      'Updated At': new Date(reference.updatedAt).toLocaleString(),
      'Status': reference.deleted ? 'Deleted' : 'Active'
    }));
    
    const csvString = [
      Object.keys(csvData[0] || {}).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `references-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleAddReference = async (name: string) => {
    // In a real implementation, this would call an API to create a new reference
    console.log('Adding new reference:', name);
    
    // For now, just show a success message and refresh the list
    showNotification(`Reference "${name}" created successfully!`, 'success');
    await refetch();
  };

  const handleEditReference = (reference: Reference) => {
    console.log('Editing reference:', reference);
    // TODO: Implement edit functionality
    showNotification('Edit functionality is not implemented yet', 'info');
  };

  const handleDeleteReference = (reference: Reference) => {
    console.log('Deleting reference:', reference);
    // TODO: Implement delete functionality
    if (window.confirm(`Are you sure you want to delete the reference "${reference.name}"?`)) {
      showNotification('Delete functionality is not implemented yet', 'info');
    }
  };

  const handleViewReference = (reference: Reference) => {
    console.log('Viewing reference details:', reference);
    // TODO: Implement view details functionality
    showNotification(`Viewing details for ${reference.name}`, 'info');
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    // Create a simple toast notification
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg text-white font-medium transition-all duration-300 ${
      type === 'success' ? 'bg-green-500' : 
      type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    }`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
      toast.style.opacity = '1';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      toast.style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Referrals</h1>
            <p className="text-gray-600 mt-1">Manage reference persons for investor onboarding</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search references..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-64 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
              />
            </div>
            
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </button>
              <button 
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg ${viewMode === 'table' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            </div>
            
            <button 
              onClick={handleRefresh}
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
              disabled={loading}
              className={`flex items-center space-x-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Download size={18} />
              <span className="text-sm font-medium">Export</span>
            </button>
            
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all shadow-md"
            >
              <UserPlus size={18} />
              <span className="text-sm font-medium">Add Reference</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Users size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total References</p>
              <h3 className="text-2xl font-bold text-gray-900">{references.length}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <Users size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Investors</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {references.reduce((sum, ref) => sum + ref.totalInvestors, 0)}
              </h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Link2 size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active References</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {references.filter(ref => !ref.deleted).length}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="flex items-center justify-center space-x-3">
            <Loader2 size={24} className="animate-spin text-blue-500" />
            <span className="text-gray-600">Loading references...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle size={20} className="text-red-600" />
            </div>
            <div>
              <h3 className="text-red-800 font-semibold">Error Loading References</h3>
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
      )}

      {/* Empty State */}
      {!loading && !error && references.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Link2 size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No References Found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm 
                ? `No references found matching "${searchTerm}"`
                : "You haven't added any references yet. References help track who referred investors to your platform."
              }
            </p>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all shadow-md"
            >
              <UserPlus size={18} />
              <span className="text-sm font-medium">Add Your First Reference</span>
            </button>
          </div>
        </div>
      )}

      {/* References Display */}
      {!loading && !error && references.length > 0 && (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {references.map(reference => (
                <ReferenceCard 
                  key={reference.id} 
                  reference={reference} 
                  onEdit={handleEditReference}
                  onDelete={handleDeleteReference}
                  onView={handleViewReference}
                />
              ))}
            </div>
          ) : (
            <ReferenceTable 
              references={references}
              onEdit={handleEditReference}
              onDelete={handleDeleteReference}
              onView={handleViewReference}
            />
          )}
        </>
      )}

      {/* Add Reference Modal */}
      <AddReferenceModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddReference}
      />
    </div>
  );
};

export default Referrals;