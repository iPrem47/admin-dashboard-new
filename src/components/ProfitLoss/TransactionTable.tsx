import React from 'react';
import { Eye, Filter, ChevronDown, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';

interface ProfitLossEntry {
  id: string;
  amount: number;
  tag: string;
  date: string;
  status: 'Completed' | 'Pending';
  category: 'Profit' | 'Loss';
}

interface TransactionTableProps {
  entries: ProfitLossEntry[];
  totalEntries: number;
  filterTag: string;
  isFilterOpen: boolean;
  filterOptions: string[];
  onFilterChange: (filter: string) => void;
  onFilterToggle: () => void;
  formatAmount: (amount: number) => string;
  formatDate: (date: string) => string;
  getAmountColor: (amount: number) => string;
  getTagColor: (tag: string) => string;
  loading?: boolean;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  entries,
  totalEntries,
  filterTag,
  isFilterOpen,
  filterOptions,
  onFilterChange,
  onFilterToggle,
  formatAmount,
  formatDate,
  getAmountColor,
  getTagColor,
  loading = false
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Table Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
            <p className="text-sm text-gray-600 mt-1">
              {loading ? (
                <span className="flex items-center space-x-2">
                  <Loader2 size={14} className="animate-spin" />
                  <span>Loading transactions...</span>
                </span>
              ) : (
                `Showing ${entries.length} of ${totalEntries} transactions`
              )}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Filter Dropdown */}
            <div className="relative">
              <button
                onClick={onFilterToggle}
                disabled={loading}
                className={`flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Filter size={16} />
                <span className="text-sm font-medium">{filterTag}</span>
                <ChevronDown size={16} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isFilterOpen && !loading && (
                <div className="absolute right-0 z-10 w-48 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg">
                  {filterOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => onFilterChange(option)}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                        filterTag === option ? 'bg-cyan-50 text-cyan-700' : ''
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center">
            <div className="flex items-center justify-center space-x-3">
              <Loader2 size={24} className="animate-spin text-cyan-500" />
              <span className="text-gray-600">Loading transaction data...</span>
            </div>
          </div>
        ) : entries.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Filter size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Transactions Found</h3>
            <p className="text-gray-600">
              {filterTag === 'All' 
                ? 'No transactions available at the moment.' 
                : `No transactions found for "${filterTag}" filter.`
              }
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tag</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {entries.map((entry, index) => (
                <tr key={entry.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                  <td className="px-8 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {entry.amount >= 0 ? (
                        <ArrowUpRight size={16} className="text-emerald-500 mr-2" />
                      ) : (
                        <ArrowDownRight size={16} className="text-red-500 mr-2" />
                      )}
                      <span className={`text-sm font-bold ${getAmountColor(entry.amount)}`}>
                        {entry.amount >= 0 ? '+' : ''}{formatAmount(entry.amount)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getTagColor(entry.tag)}`}>
                      {entry.tag}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600 font-medium">{formatDate(entry.date)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      entry.category === 'Profit' 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      {entry.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      entry.status === 'Completed'
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                    }`}>
                      <div className={`w-2 h-2 rounded-full mr-2 mt-0.5 ${
                        entry.status === 'Completed' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></div>
                      {entry.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Table Footer */}
      {!loading && entries.length > 0 && (
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{entries.length}</span> transactions
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-white transition-colors text-gray-600 hover:text-gray-900">
                Previous
              </button>
              <button className="px-4 py-2 text-sm bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all">
                1
              </button>
              <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-white transition-colors text-gray-600 hover:text-gray-900">
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;