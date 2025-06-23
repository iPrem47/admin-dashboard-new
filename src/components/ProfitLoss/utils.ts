export const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

export const getAmountColor = (amount: number): string => {
  return amount >= 0 ? 'text-emerald-600' : 'text-red-500';
};

export const getTagColor = (tag: string): string => {
  const colors: { [key: string]: string } = {
    'New': 'bg-blue-100 text-blue-700 border-blue-200',
    'Old': 'bg-purple-100 text-purple-700 border-purple-200',
    'Investment': 'bg-green-100 text-green-700 border-green-200',
    'Dividend': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'Loss': 'bg-red-100 text-red-700 border-red-200',
    'Profit': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Trading': 'bg-orange-100 text-orange-700 border-orange-200',
    'Bonus': 'bg-pink-100 text-pink-700 border-pink-200',
  };
  return colors[tag] || 'bg-gray-100 text-gray-700 border-gray-200';
};