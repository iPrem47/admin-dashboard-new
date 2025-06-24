import React from 'react';
import { FileText, Download, ChevronDown, Calendar, AlertCircle, Loader2 } from 'lucide-react';
import { TDSCertificate } from './types';

interface TDSCertificatesCardProps {
  certificates: TDSCertificate[];
  loading: boolean;
  error: string | null;
  selectedYear: string;
  onYearChange: (year: string) => void;
}

const TDSCertificatesCard: React.FC<TDSCertificatesCardProps> = ({ 
  certificates, 
  loading, 
  error, 
  selectedYear,
  onYearChange
}) => {
  const [isYearDropdownOpen, setIsYearDropdownOpen] = React.useState(false);
  
  // Generate year options (current year and 4 years back)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());

  const handleYearSelect = (year: string) => {
    onYearChange(year);
    setIsYearDropdownOpen(false);
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleDownload = (url: string) => {
    if (!url) {
      alert('No certificate available for download');
      return;
    }
    
    // Open the URL in a new tab
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">
          TDS Certificates
        </h3>
        
        <div className="flex items-center space-x-4">
          {/* Year Selector */}
          <div className="relative">
            <button
              onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Calendar size={16} />
              <span className="text-sm font-medium">FY {selectedYear}-{(parseInt(selectedYear) + 1).toString().slice(-2)}</span>
              <ChevronDown size={14} className={`transition-transform ${isYearDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isYearDropdownOpen && (
              <div className="absolute right-0 z-10 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg">
                {yearOptions.map((year) => (
                  <button
                    key={year}
                    onClick={() => handleYearSelect(year)}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                      selectedYear === year ? 'bg-cyan-50 text-cyan-700' : ''
                    }`}
                  >
                    FY {year}-{(parseInt(year) + 1).toString().slice(-2)}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <button className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-sm">
            <FileText size={16} />
            <span className="text-sm font-medium">Upload Certificate</span>
          </button>
        </div>
      </div>
      
      {/* Loading State */}
      {loading && (
        <div className="py-8 text-center">
          <div className="flex items-center justify-center space-x-3">
            <Loader2 size={24} className="animate-spin text-cyan-500" />
            <span className="text-gray-600">Loading TDS certificates...</span>
          </div>
        </div>
      )}
      
      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
          <div className="flex items-center space-x-3">
            <AlertCircle size={20} className="text-red-600" />
            <div>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Empty State */}
      {!loading && !error && certificates.length === 0 && (
        <div className="py-12 text-center">
          <FileText size={48} className="mx-auto text-gray-300 mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No TDS Certificates Found</h4>
          <p className="text-gray-500">
            There are no TDS certificates available for FY {selectedYear}-{(parseInt(selectedYear) + 1).toString().slice(-2)}
          </p>
        </div>
      )}
      
      {/* Certificates Table */}
      {!loading && !error && certificates.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Certificate ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  TDS Certificate
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Quarter
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  From Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  To Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Remarks
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {certificates.map((cert, index) => (
                <tr key={cert.certificateId} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{cert.certificateId}</span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    {cert.certificateFileUrl ? (
                      <button
                        onClick={() => handleDownload(cert.certificateFileUrl)}
                        className="flex items-center space-x-1 text-cyan-600 hover:text-cyan-800 font-medium text-sm"
                      >
                        <Download size={14} />
                        <span>Download</span>
                      </button>
                    ) : (
                      <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{cert.quarter}</span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{formatDate(cert.fromDate)}</span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{formatDate(cert.toDate)}</span>
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">{cert.remarks}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TDSCertificatesCard;