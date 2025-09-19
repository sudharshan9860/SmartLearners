// src/config/apiConfig.js
// Configuration file for API endpoints and settings

const config = {
  // Main Dashboard API
  dashboard: {
    baseUrl: process.env.REACT_APP_API_BASE_URL || 'http://139.59.30.88',
    endpoints: {
      health: '/health',
      dailyRollups: '/daily-rollups',
      schoolLogs: '/school-logs',
      classSummary: '/class-summary',
      studentActivity: '/student-activity',
      classes: '/classes'
    }
  },
  
  // Chatbot API
  chatbot: {
    // Update this to your actual chatbot API URL in production
    baseUrl: process.env.REACT_APP_CHATBOT_API_URL || 'http://127.0.0.1:8000',
    // Admin API key for data sync - should be stored securely in production
    adminApiKey: process.env.REACT_APP_ADMIN_API_KEY || 'admin-secret-key-123',
    endpoints: {
      createSession: '/create-session',
      chat: '/chat',
      getSession: '/session',
      stats: '/stats',
      clearSession: '/clear',
      sync: '/admin/sync'
    },
    // Chat configuration
    settings: {
      maxMessageLength: 1000,
      sessionTimeout: 30 * 60 * 1000, // 30 minutes
      retryAttempts: 3,
      typingDelay: 1000,
      autoScrollToBottom: true,
      showSqlQueries: true,
      showDataResponses: true
    }
  },
  
  // Data freshness thresholds (in hours)
  dataFreshness: {
    fresh: 1,      // < 1 hour = fresh (green)
    stale: 4,      // < 4 hours = stale (orange)  
    outdated: 8    // >= 8 hours = outdated (red)
  },
  
  // Sample questions for the AI Assistant
  sampleQuestions: [
    "How many active students are there today?",
    "What's the earliest date in our data?",
    "Show me teacher activity statistics",
    "How many total students do we have?",
    "What's the data range available?",
    "Show activity trends for this week",
    "Which class has the most active students?",
    "What are the peak activity hours?",
    "Show me student attendance patterns",
    "How many teachers used the platform today?"
  ],
  
  // Quick prompts for different user types
  quickPrompts: {
    admin: [
      "Generate a weekly activity report",
      "Show system-wide usage statistics",
      "Compare activity across all schools"
    ],
    teacher: [
      "Show my class activity today",
      "Which students need attention?",
      "Display homework submission rates"
    ],
    student: [
      "Show my activity summary",
      "What assignments are pending?",
      "Display my progress this week"
    ]
  }
};

// Export configuration
export default config;

// Helper function to get API URL
export const getApiUrl = (api, endpoint) => {
  if (api === 'dashboard') {
    return config.dashboard.baseUrl + config.dashboard.endpoints[endpoint];
  } else if (api === 'chatbot') {
    return config.chatbot.baseUrl + config.chatbot.endpoints[endpoint];
  }
  return null;
};

// Helper function to check data freshness
export const getDataFreshnessStatus = (hoursAgo) => {
  if (hoursAgo < config.dataFreshness.fresh) {
    return { status: 'fresh', color: '#48bb78', label: 'Fresh' };
  } else if (hoursAgo < config.dataFreshness.stale) {
    return { status: 'stale', color: '#f6ad55', label: 'Stale' };
  } else {
    return { status: 'outdated', color: '#f56565', label: 'Outdated' };
  }
};