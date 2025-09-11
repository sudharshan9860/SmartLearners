// helpers.js
import { format, parseISO, differenceInDays, addDays } from 'date-fns';

export const formatters = {
  // Number formatting
  formatNumber: (num) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  },
  
  // Percentage formatting
  formatPercentage: (value, decimals = 0) => {
    return `${value.toFixed(decimals)}%`;
  },
  
  // Date formatting
  formatDate: (date, formatStr = 'DD/MM/YYYY') => {
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      return format(dateObj, formatStr);
    } catch (error) {
      return date;
    }
  },
  
  // Time formatting
  formatTime: (time) => {
    const date = new Date();
    const [hours, minutes] = time.split(':');
    date.setHours(parseInt(hours), parseInt(minutes));
    return format(date, 'h:mm a');
  },
  
  // Duration formatting
  formatDuration: (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }
};

export const calculations = {
  // Calculate percentage
  calculatePercentage: (value, total) => {
    if (total === 0) return 0;
    return (value / total) * 100;
  },
  
  // Calculate average
  calculateAverage: (numbers) => {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return sum / numbers.length;
  },
  
  // Calculate trend
  calculateTrend: (current, previous) => {
    if (previous === 0) return 0;
    const change = ((current - previous) / previous) * 100;
    return change.toFixed(1);
  }
};

export const validators = {
  // Email validation
  isValidEmail: (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },
  
  // Phone validation
  isValidPhone: (phone) => {
    const re = /^[+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return re.test(phone);
  },
  
  // Date validation
  isValidDate: (date) => {
    return date instanceof Date && !isNaN(date);
  }
};

export const generateMockData = {
  // Generate random activity
  generateActivity: () => {
    const activities = [
      'Homework Submission',
      'Quiz Attempted',
      'Assignment Created',
      'Feedback Provided',
      'Video Watched',
      'AI Query'
    ];
    return activities[Math.floor(Math.random() * activities.length)];
  },
  
  // Generate random score
  generateScore: (min = 60, max = 100) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  
  // Generate random time
  generateTime: () => {
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
};