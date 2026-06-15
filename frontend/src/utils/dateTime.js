import { format as dateFnsFormat, parseISO } from 'date-fns';

export const formatDateTime = (date, preferences) => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const { timeFormat, dateFormat } = preferences;
    
    // Format date
    let datePattern = 'dd/MM/yyyy';
    if (dateFormat === 'MM/DD/YYYY') datePattern = 'MM/dd/yyyy';
    if (dateFormat === 'YYYY-MM-DD') datePattern = 'yyyy-MM-dd';
    
    // Format time
    const timePattern = timeFormat === '24' ? 'HH:mm:ss' : 'hh:mm:ss a';
    
    return dateFnsFormat(dateObj, `${datePattern} ${timePattern}`);
  } catch (error) {
    console.error('Date formatting error:', error);
    return date.toString();
  }
};

export const formatDate = (date, preferences) => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const { dateFormat } = preferences;
    
    let pattern = 'dd/MM/yyyy';
    if (dateFormat === 'MM/DD/YYYY') pattern = 'MM/dd/yyyy';
    if (dateFormat === 'YYYY-MM-DD') pattern = 'yyyy-MM-dd';
    
    return dateFnsFormat(dateObj, pattern);
  } catch (error) {
    console.error('Date formatting error:', error);
    return date.toString();
  }
};

export const formatTime = (date, preferences) => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const { timeFormat } = preferences;
    
    const pattern = timeFormat === '24' ? 'HH:mm:ss' : 'hh:mm:ss a';
    
    return dateFnsFormat(dateObj, pattern);
  } catch (error) {
    console.error('Time formatting error:', error);
    return date.toString();
  }
};

export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now - dateObj) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return dateFnsFormat(dateObj, 'MMM dd, yyyy');
  } catch (error) {
    console.error('Relative time formatting error:', error);
    return '';
  }
};

export const timezones = [
  { value: 'Asia/Kolkata', label: 'India Standard Time (IST)' },
  { value: 'UTC', label: 'Coordinated Universal Time (UTC)' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'British Time (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Central European Time (CET)' },
  { value: 'Asia/Dubai', label: 'Gulf Standard Time (GST)' },
  { value: 'Asia/Singapore', label: 'Singapore Time (SGT)' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)' },
];
