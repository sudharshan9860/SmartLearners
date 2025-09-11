// constants.js
export const CONSTANTS = {
  // API Endpoints (for future use)
  API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  
  // Chart Colors
  CHART_COLORS: {
    primary: '#667eea',
    secondary: '#764ba2',
    success: '#48bb78',
    warning: '#f6ad55',
    danger: '#f56565',
    info: '#4299e1'
  },
  
  // Status Types
  STATUS: {
    ACTIVE: 'active',
    COMPLETED: 'completed',
    PENDING: 'pending',
    RESOLVED: 'resolved',
    SCHEDULED: 'scheduled',
    APPROVED: 'approved'
  },
  
  // User Roles
  ROLES: {
    ADMIN: 'admin',
    TEACHER: 'teacher',
    STUDENT: 'student',
    PARENT: 'parent'
  },
  
  // Time Formats
  TIME_FORMAT: {
    SHORT: 'HH:mm',
    LONG: 'HH:mm:ss',
    DATE: 'DD/MM/YYYY',
    DATETIME: 'DD/MM/YYYY HH:mm'
  },
  
  // Pagination
  ITEMS_PER_PAGE: 10,
  MAX_ITEMS_DISPLAY: 100,
  
  // Animation Durations
  ANIMATION: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500
  }
};