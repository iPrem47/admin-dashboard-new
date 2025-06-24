import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, User, Check } from 'lucide-react';
import { Investor } from './types';

interface InvestorDropdownProps {
  investors: Investor[];
  selectedInvestor: Investor | null;
  onSelect: (investor: Investor) => void;
  onSearch: (searchTerm: string) => void;
  loading: boolean;
  error?: string;
  placeholder?: string;
  required?: boolean;
}

const InvestorDropdown: React.FC<InvestorDropdownProps> = ({
  investors,
  selectedInvestor,
  onSelect,
  onSearch,
  loading,
  error,
  placeholder = "Select Investor",
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const handleInvestorSelect = (investor: Investor) => {
    onSelect(investor);
    setIsOpen(false);
    setSearchTerm('');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2);
  };

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

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        {required && <span className="text-red-500 mr-1">*</span>}
        Select Investor
      </label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-4 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white text-left flex items-center justify-between ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <div className="flex items-center space-x-3 flex-1">
          {selectedInvestor ? (
            <>
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-400 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-semibold">
                  {getInitials(selectedInvestor.name)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-900 truncate">
                  {selectedInvestor.name}
                </div>
                <div className="text-xs text-gray-500">
                  @{selectedInvestor.userName} • {formatAmount(selectedInvestor.amount)}
                </div>
              </div>
            </>
          ) : (
            <>
              <User size={20} className="text-gray-400" />
              <span className="text-gray-400">{placeholder}</span>
            </>
          )}
        </div>
        <ChevronDown 
          size={20} 
          className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-hidden">
          {/* Search Input */}
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search investors..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="p-4 text-center">
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-500"></div>
                <span className="text-sm text-gray-600">Searching...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="p-4 text-center">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Investors List */}
          {!loading && !error && (
            <div className="max-h-60 overflow-y-auto">
              {investors.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-sm text-gray-500">
                    {searchTerm ? `No investors found for "${searchTerm}"` : 'No investors available'}
                  </p>
                </div>
              ) : (
                investors.map((investor) => (
                  <button
                    key={investor._id}
                    type="button"
                    onClick={() => handleInvestorSelect(investor)}
                    className="w-full px-4 py-3 hover:bg-gray-50 transition-colors flex items-center space-x-3 text-left"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">
                        {getInitials(investor.name)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-900 truncate">
                        {investor.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        @{investor.userName} • {investor.investorTypeName} • {formatAmount(investor.amount)}
                      </div>
                    </div>
                    {selectedInvestor?._id === investor._id && (
                      <Check size={16} className="text-emerald-500" />
                    )}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default InvestorDropdown;