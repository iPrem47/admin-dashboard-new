import React from 'react';
import { FileText, Download, AlertCircle } from 'lucide-react';
import { InvestorProfile } from './types';

interface DocumentsCardProps {
  profile: InvestorProfile | null;
  loading: boolean;
}

const DocumentsCard: React.FC<DocumentsCardProps> = ({ profile, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-24 bg-gray-200 rounded mb-4"></div>
            <div className="h-24 bg-gray-200 rounded mb-4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const documents = [
    { 
      name: 'PAN Card', 
      url: profile.panCardURL, 
      icon: <FileText size={20} className="text-orange-500" /> 
    },
    { 
      name: 'Aadhar Card', 
      url: profile.aadharCardURL, 
      icon: <FileText size={20} className="text-blue-500" /> 
    },
    { 
      name: 'Cheque/Passbook', 
      url: profile.chequeORPassbookURL, 
      icon: <FileText size={20} className="text-green-500" /> 
    },
    { 
      name: 'Bank Statement', 
      url: profile.bankStatementURL, 
      icon: <FileText size={20} className="text-purple-500" /> 
    },
    { 
      name: 'Signature', 
      url: profile.signatureURL, 
      icon: <FileText size={20} className="text-gray-500" /> 
    }
  ];

  const handleDownload = (url: string | null, name: string) => {
    if (!url) {
      alert(`No ${name} document available for download`);
      return;
    }
    
    // Open the URL in a new tab
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-100">
        Documents
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {documents.map((doc, index) => (
          <div 
            key={index}
            className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {doc.icon}
                <span className="text-sm font-medium text-gray-900">{doc.name}</span>
              </div>
              
              {doc.url ? (
                <button
                  onClick={() => handleDownload(doc.url, doc.name)}
                  className="p-2 text-gray-500 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                >
                  <Download size={18} />
                </button>
              ) : (
                <div className="flex items-center space-x-1 text-gray-400">
                  <AlertCircle size={14} />
                  <span className="text-xs">Not available</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentsCard;