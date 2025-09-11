// activitiesData.js
export const activitiesData = {
  recentActivities: [
    {
      id: 1,
      timestamp: '2024-01-06T14:32:00',
      type: 'submission',
      user: 'Student 10HPS21',
      activity: 'Homework Submission',
      details: 'Math - Chapter 4',
      status: 'completed'
    },
    {
      id: 2,
      timestamp: '2024-01-06T14:31:00',
      type: 'creation',
      user: 'Ms. Sarah',
      activity: 'Assignment Created',
      details: 'Science - Light and Reflection',
      status: 'active'
    },
    {
      id: 3,
      timestamp: '2024-01-06T14:30:00',
      type: 'query',
      user: 'Student 10HPS17',
      activity: 'AI Chatbot Query',
      details: 'Help with calculus',
      status: 'resolved'
    }
  ],
  statistics: {
    daily: {
      submissions: 2456,
      logins: 3245,
      queries: 567,
      assignments: 89
    },
    weekly: {
      submissions: 15678,
      logins: 21345,
      queries: 3456,
      assignments: 456
    }
  }
};