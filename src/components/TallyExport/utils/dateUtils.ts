export function convertDateFormat(dateString: string, type: 'fromDate' | 'toDate'): string {
  if (!dateString) return '';
  
  // Convert from YYYY-MM-DD to the format expected by the API
  const date = new Date(dateString);
  
  // If it's toDate, set time to end of day
  if (type === 'toDate') {
    date.setHours(23, 59, 59, 999);
  } else {
    date.setHours(0, 0, 0, 0);
  }
  
  // Return ISO string format
  return date.toISOString();
}

export function formatDateForDisplay(dateString: string): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

export function getDateDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
}