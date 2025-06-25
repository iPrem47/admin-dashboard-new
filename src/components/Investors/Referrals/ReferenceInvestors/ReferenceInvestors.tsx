import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Loader2, 
  AlertCircle, 
  ArrowLeft, 
  Search, 
  RefreshCw, 
  Download, 
  Eye, 
  Calendar, 
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { apiService } from '../../../../services/api';

interface ReferenceInvestor {
  publicIdentifier: string;
  investorStatusId: number;
  investorTypeId: number;
  paymentSystemId: number;
  transactionalBankId: number;
  amount: number;
  referenceId: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  userName: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
}

const ReferenceInvestors: React.FC = () => {
  const { referenceId } = useParams<{ referenceId: string }>();
  const navigate = useNavigate();
  
  const [investors, setInvestors] = useState<ReferenceInvestor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredInvestors, setFilteredInvestors] = useState<ReferenceInvestor[]>([]);
  const [referenceName, setReferenceName] = useState<string>('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchReferenceInvestors = async () => {
      if (!referenceId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch reference investors
        const response = await apiService.get(`/references/${referenceId}/investors`);
        
        if (Array.isArray(response)) {
          setInvestors(response);
          setFilteredInvestors(response);
          setTotalPages(Math.ceil(response.length / itemsPerPage));
          
          // Try to get reference name from the first investor
          if (response.length > 0) {
            // Fetch reference details to get the name
            try {
              const referencesResponse = await apiService.get('/references');
              if (referencesResponse && referencesResponse.results) {
                const reference = referencesResponse.results.find(
                  (ref: any) => ref.referenceId === referenceId
                );
                if (reference) {
                  setReferenceName(reference.name);
                }
              }
            } catch (err) {
              console.error('Error fetching reference details:', err);
            }
          }
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err: any) {
        console.error('Error fetching reference investors:', err);
        setError(err.message || 'Failed to load investors');
        
        // Fallback to mock data for development
        const mockInvestors: ReferenceInvestor[] = [
          {
            publicIdentifier: "7fe34ab6-1141-4781-be4d-3426d8abf266",
            investorStatusId: 1,
            investorTypeId: 0,
            paymentSystemId: 31,
            transactionalBankId: 1,
            amount: 350000,
            referenceId: "24f07be5-d27b-4ea7-9652-d979fd488268",
            createdAt: "2023-07-10T00:00:00.000Z",
            updatedAt: "2025-06-25T09:41:22.711Z",
            userId: "6859864bd70c541971c4ae00",
            userName: "RAI0063",
            email: "1.dharmainfosystem@gmail.com",
            phoneNumber: "+919624972228",
            firstName: "RASHILABEN",
            middleName: null,
            lastName: "PATEL"
          },
          {
            publicIdentifier: "c6312c20-cc47-4b5e-bb06-126cfa60f2ba",
            investorStatusId: 1,
            investorTypeId: 0,
            paymentSystemId: 0,
            transactionalBankId: 1,
            amount: 500000,
            referenceId: "24f07be5-d27b-4ea7-9652-d979fd488268",
            createdAt: "2023-05-25T00:00:00.000Z",
            updatedAt: "2025-06-25T09:36:23.761Z",
            userId: "6859864bd70c541971c4ae01",
            userName: "RAI1673",
            email: "1.dharmainfosystem@gmail.com",
            phoneNumber: "+919327294499",
            firstName: "VARSHA",
            middleName: null,
            lastName: "SHAH"
          },
          {
            publicIdentifier: "a4f12e30-dd47-4c5e-bb06-126cfa60f2ba",
            investorStatusId: 1,
            investorTypeId: 0,
            paymentSystemId: 31,
            transactionalBankId: 1,
            amount: 750000,
            referenceId: "24f07be5-d27b-4ea7-9652-d979fd488268",
            createdAt: "2023-08-15T00:00:00.000Z",
            updatedAt: "2025-06-24T10:22:15.432Z",
            userId: "6859864bd70c541971c4ae02",
            userName: "RAI0074",
            email: "1.dharmainfosystem@gmail.com",
            phoneNumber: "+919426067153",
            firstName: "ARUNABEN",
            middleName: null,
            lastName: "PATEL"
          }
        ];
        
        setInvestors(mockInvestors);
        setFilteredInvestors(mockInvestors);
        setTotalPages(Math.ceil(mockInvestors.length / itemsPerPage));
        setReferenceName('Dharma');
      } finally {
        setLoading(false);
      }
    };

    fetchReferenceInvestors();
  }, [referenceId, itemsPerPage]);

  // Handle search
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredInvestors(investors);
      setTotalPages(Math.ceil(investors.length / itemsPerPage));
    } else {
      const filtered = investors.filter(investor => 
        investor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        investor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        investor.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        investor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        investor.phoneNumber.includes(searchTerm)
      );
      setFilteredInvestors(filtered);
      setTotalPages(Math.ceil(filtered.length / itemsPerPage));
      setCurrentPage(1); // Reset to first page when searching
    }
  }, [searchTerm, investors, itemsPerPage]);

  // Get current investors for pagination
  const indexOfLastInvestor = currentPage * itemsPerPage;
  const indexOfFirstInvestor = indexOfLastInvestor - itemsPerPage;
  const currentInvestors = filteredInvestors.slice(indexOfFirstInvestor, indexOfLastInvestor);

  // Change page
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (limit: number) => {
    setItemsPerPage(limit);
    setCurrentPage(1); // Reset to first page when changing items per page
    setTotalPages(Math.ceil(filteredInvestors.length / limit));
  };

  // Handle back button
  const handleBack = () => {
    navigate('/investors/referrals');
  };

  // Format amount
  const formatAmount = (amount: number): string => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get payment system name
  const getPaymentSystemName = (paymentSystemId: number): string => {
    switch (paymentSystemId) {
      case 7:
        return 'Weekly';
      case 31:
        return 'Monthly';
      case 0:
        return 'None';
      default:
        return 'Unknown';
    }
  };

  // Get payment system color
  const getPaymentSystemColor = (paymentSystem: string) => {
    switch (paymentSystem) {
      case 'Monthly':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Weekly':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'None':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get initials for avatar
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Handle view investor
  const handleViewInvestor = (investorId: string) => {
    navigate(`/investors/${investorId}`);
  };

  // Handle export
  const handleExport = () => {
    if (filteredInvestors.length === 0) return;
    
    const csvData = filteredInvestors.map(investor => ({
      'Username': investor.userName,
      'Name': `${investor.firstName} ${investor.lastName}`,
      'Email': investor.email,
      'Phone': investor.phoneNumber,
      'Amount': investor.amount,
      'Payment System': getPaymentSystemName(investor.paymentSystemId),
      'Created Date': formatDate(investor.createdAt)
    }));
    
    const csvString = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reference-investors-${referenceId}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Get visible pages for pagination
  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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
              <h1 className="text-2xl font-bold text-gray-900">Reference Investors</h1>
              <p className="text-gray-600">
                {referenceName ? `Investors referred by ${referenceName}` : 'Viewing investors for this reference'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search investors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-64 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
              />
            </div>
            
            <button 
              onClick={() => window.location.reload()}
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
              disabled={loading || filteredInvestors.length === 0}
              className={`flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all shadow-md ${
                loading || filteredInvestors.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Download size={18} />
              <span className="text-sm font-medium">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Loading State */}
        {loading && (
          <div className="p-12 text-center">
            <div className="flex items-center justify-center space-x-3">
              <Loader2 size={24} className="animate-spin text-blue-500" />
              <span className="text-gray-600">Loading investors...</span>
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
                  <h3 className="text-red-800 font-semibold">Error Loading Investors</h3>
                  <p className="text-red-600 text-sm">{error}</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium underline"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredInvestors.length === 0 && (
          <div className="p-12 text-center">
            <div className="flex flex-col items-center justify-center">
              <User size={48} className="text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Investors Found</h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? `No investors found matching "${searchTerm}"` 
                  : 'This reference has no investors yet.'
                }
              </p>
            </div>
          </div>
        )}

        {/* Table */}
        {!loading && !error && filteredInvestors.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Investor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Payment System
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Joined Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {currentInvestors.map((investor, index) => {
                  const paymentSystem = getPaymentSystemName(investor.paymentSystemId);
                  const fullName = `${investor.firstName} ${investor.lastName}`;
                  
                  return (
                    <tr key={investor.publicIdentifier} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                      <td className="px-8 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-xs font-semibold">
                              {getInitials(investor.firstName, investor.lastName)}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{fullName}</div>
                            <div className="text-xs text-gray-500">@{investor.userName}</div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="text-gray-900">{investor.email}</div>
                          <div className="text-gray-500">{investor.phoneNumber}</div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-lg font-bold text-blue-600">
                          {formatAmount(investor.amount)}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getPaymentSystemColor(paymentSystem)}`}>
                          {paymentSystem}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar size={14} className="mr-2 text-gray-400" />
                          {formatDate(investor.createdAt)}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          onClick={() => handleViewInvestor(investor.userId)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Investor Details"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && filteredInvestors.length > 0 && (
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold text-gray-900">{indexOfFirstInvestor + 1}-{Math.min(indexOfLastInvestor, filteredInvestors.length)}</span> of{' '}
                  <span className="font-semibold text-gray-900">{filteredInvestors.length}</span> investors
                </p>
                
                {/* Items per page selector */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Show:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                    disabled={loading}
                    className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>
              
              {/* Pagination Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || loading}
                  className="flex items-center space-x-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 hover:text-gray-900"
                >
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>
                
                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {getVisiblePages().map((page, index) => (
                    <React.Fragment key={index}>
                      {page === '...' ? (
                        <span className="px-3 py-2 text-sm text-gray-400">...</span>
                      ) : (
                        <button
                          onClick={() => handlePageChange(page as number)}
                          disabled={loading}
                          className={`px-3 py-2 text-sm rounded-lg transition-all ${
                            currentPage === page
                              ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                              : 'border border-gray-300 hover:bg-white text-gray-600 hover:text-gray-900'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {page}
                        </button>
                      )}
                    </React.Fragment>
                  ))}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || loading}
                  className="flex items-center space-x-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 hover:text-gray-900"
                >
                  <span>Next</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Card */}
      {!loading && !error && filteredInvestors.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Reference Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
              <div className="text-sm text-gray-600 mb-1">Total Investors</div>
              <div className="text-2xl font-bold text-blue-700">{filteredInvestors.length}</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
              <div className="text-sm text-gray-600 mb-1">Total Investment</div>
              <div className="text-2xl font-bold text-green-700">
                {formatAmount(filteredInvestors.reduce((sum, investor) => sum + investor.amount, 0))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
              <div className="text-sm text-gray-600 mb-1">Average Investment</div>
              <div className="text-2xl font-bold text-purple-700">
                {formatAmount(
                  filteredInvestors.length > 0
                    ? filteredInvestors.reduce((sum, investor) => sum + investor.amount, 0) / filteredInvestors.length
                    : 0
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferenceInvestors;