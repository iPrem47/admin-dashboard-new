import React from 'react';
import { Calendar, ChevronDown, Save, Calculator, IndianRupee } from 'lucide-react';

interface TransactionFormProps {
  amount: string;
  date: string;
  selectedTag: string;
  isTagDropdownOpen: boolean;
  tagOptions: string[];
  onAmountChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onTagSelect: (tag: string) => void;
  onTagDropdownToggle: () => void;
  onSave: () => void;
  onFinalAmount: () => void;
  getTagColor: (tag: string) => string;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  amount,
  date,
  selectedTag,
  isTagDropdownOpen,
  tagOptions,
  onAmountChange,
  onDateChange,
  onTagSelect,
  onTagDropdownToggle,
  onSave,
  onFinalAmount,
  getTagColor
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Add New Transaction</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Amount Field */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <span className="text-red-500">*</span> Amount
          </label>
          <div className="relative">
            <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="number"
              placeholder="Enter amount..."
              value={amount}
              onChange={(e) => onAmountChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all bg-white text-gray-900 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Date Field */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <span className="text-red-500">*</span> Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={date}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all bg-white text-gray-900"
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
          </div>
        </div>

        {/* Tag Dropdown */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <span className="text-red-500">*</span> Tag
          </label>
          <div className="relative">
            <button
              onClick={onTagDropdownToggle}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all bg-white text-left flex items-center justify-between"
            >
              <span className={selectedTag ? 'text-gray-900' : 'text-gray-400'}>
                {selectedTag || 'Select tag'}
              </span>
              <ChevronDown 
                size={18} 
                className={`text-gray-400 transition-transform ${isTagDropdownOpen ? 'rotate-180' : ''}`} 
              />
            </button>
            
            {isTagDropdownOpen && (
              <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                {tagOptions.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => onTagSelect(tag)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl flex items-center justify-between"
                  >
                    <span>{tag}</span>
                    <div className={`w-3 h-3 rounded-full ${getTagColor(tag).split(' ')[0].replace('bg-', 'bg-')}`}></div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onSave}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all shadow-md"
        >
          <Save size={18} />
          <span className="font-medium">Save Transaction</span>
        </button>
        <button
          onClick={onFinalAmount}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all shadow-md"
        >
          <Calculator size={18} />
          <span className="font-medium">Calculate Final Amount</span>
        </button>
      </div>
    </div>
  );
};

export default TransactionForm;