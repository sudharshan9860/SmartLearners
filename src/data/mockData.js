// mockData.js - Comprehensive mock data for all sections

export const overviewData = {
  schools: {
    total: 127,
    active: 118,
    inactive: 9,
    newThisMonth: 5
  },
  studentEngagement: {
    total: 24567,
    online: 8924,
    totalTime: '156,324 hours',
    averageScore: 94
  },
  teacherActivity: {
    total: 1247,
    active: 892,
    assignmentsCreated: 3456,
    feedbackGiven: 2890
  },
  dailyActivity: {
    assignments: 2456,
    submissions: 1892,
    chatbotQueries: 567,
    platformLogins: 3245
  }
};

export const realtimeActivityData = [
  {
    id: 1,
    time: '14:32',
    school: 'DPS Delhi',
    user: 'Student 10HPS21',
    activity: 'Homework Submission',
    details: 'Math - Chapter 4, Score: 94%',
    status: 'Completed',
    icon: '✅'
  },
  {
    id: 2,
    time: '14:31',
    school: 'Ryan International',
    user: 'Ms. Sarah',
    activity: 'Created Assignment',
    details: 'Science - Light and Reflection',
    status: 'Active',
    icon: '📝'
  },
  {
    id: 3,
    time: '14:30',
    school: 'KV School',
    user: 'Student 10HPS17',
    activity: 'AI Chatbot Query',
    details: 'Asked for help with calculus integration',
    status: 'Resolved',
    icon: '🤖'
  },
  {
    id: 4,
    time: '14:28',
    school: 'St. Mary\'s School',
    user: 'Mr. Rajesh',
    activity: 'Feedback Provided',
    details: 'English Essay - Grade A',
    status: 'Completed',
    icon: '💬'
  },
  {
    id: 5,
    time: '14:25',
    school: 'Delhi Public School',
    user: 'Student 9HPS34',
    activity: 'Video Lecture',
    details: 'Biology - Photosynthesis',
    status: 'In Progress',
    icon: '▶️'
  }
];

export const schoolsList = [
  'All Schools',
  'Delhi Public School',
  'Ryan International',
  'Kendriya Vidyalaya',
  'DAV Public School',
  'St. Mary\'s School'
];

export const blocksList = [
  'All Blocks',
  'Primary Block (1-5)',
  'Middle Block (6-8)',
  'Senior Block (9-12)',
  'IB Block',
  'CBSE Block',
  'ICSE Block'
];

export const classList = [
  'All Classes',
  'Class 6th',
  'Class 7th',
  'Class 8th',
  'Class 9th',
  'Class 10th',
  'Class 11th',
  'Class 12th'
];

export const sectionList = [
  'All Sections',
  'Section A',
  'Section B',
  'Section C',
  'Section D'
];

export const studentActivityData = {
  studentInfo: {
    id: '10HPS21',
    name: 'Arjun Sharma',
    class: '7th',
    section: 'A',
    school: 'Delhi Public School',
    block: 'Middle Block',
    avatar: '👨‍🎓'
  },
  metrics: {
    totalActiveTime: '4h 32m',
    questionsSolved: 18,
    chatbotQueries: 7,
    conceptViews: 12,
    averageScore: 94,
    assignmentsDone: 5
  },
  appUsageTimeline: [
    {
      time: '14:32',
      activity: 'Submitted Homework',
      details: 'Math - Quadratic Equations | Score: 94%',
      tag: 'Homework',
      color: '#48bb78'
    },
    {
      time: '14:28',
      activity: 'Used Auto-Score Feature',
      details: 'Uploaded solution image for Q3',
      tag: 'Auto-Score',
      color: '#f6ad55'
    },
    {
      time: '14:25',
      activity: 'Clicked "Solve" Button',
      details: 'Viewed step-by-step solution for Question 2',
      tag: 'Solve',
      color: '#f56565'
    },
    {
      time: '14:20',
      activity: 'AI Chatbot Query',
      details: 'Asked: "How to solve quadratic equations?"',
      tag: 'Chatbot',
      color: '#4299e1'
    },
    {
      time: '14:15',
      activity: 'Started Assignment',
      details: 'Math Chapter 4 - Quadratic Equations',
      tag: 'Started',
      color: '#667eea'
    }
  ],
  todayActivityBreakdown: [
    { time: '15m', activity: 'Homework', value: 35 },
    { time: '12m', activity: 'Solve', value: 28 },
    { time: '10m', activity: 'Chatbot', value: 22 },
    { time: '8m', activity: 'Videos', value: 15 }
  ]
};

export const teacherActivityData = {
  teacherInfo: {
    id: 'T001',
    name: 'Ms. Sarah Thompson',
    initials: 'ST',
    subject: 'Mathematics Teacher',
    school: 'Delhi Public School',
    block: 'Middle Block',
    classes: ['7th A', 'B', 'C']
  },
  metrics: {
    assignmentsCreated: 23,
    classworksGiven: 18,
    studentAnalyticsChecked: 156,
    chatbotInteractions: 47,
    responseRate: 89,
    feedbackGiven: 92
  },
  assignmentCreation: [
    {
      time: 'Today, 14:25',
      activity: 'Homework Created',
      subject: 'Mathematics - Chapter 4: Quadratic Equations',
      class: '7th A, B, C',
      due: 'Tomorrow 16:00',
      questions: '5 questions selected from question bank',
      students: { total: 45, submitted: 32, pending: 13 }
    },
    {
      time: 'Today, 11:30',
      activity: 'Quiz Published',
      subject: 'Mathematics - Weekly Test',
      class: '7th B',
      due: 'Today 15:00',
      questions: '10 MCQ questions',
      students: { total: 30, submitted: 28, pending: 2 }
    },
    {
      time: 'Yesterday, 16:45',
      activity: 'Worksheet Shared',
      subject: 'Mathematics - Practice Problems',
      class: '7th C',
      due: 'Next Week',
      questions: '15 practice problems',
      students: { total: 35, submitted: 20, pending: 15 }
    }
  ],
  studentMonitoring: [
    {
      time: 'Today, 13:45',
      student: '10HPS19 (Class 7th B)',
      query: 'How to solve quadratic equations with complex roots?',
      action: 'Provided additional explanation and practice problems',
      status: 'Resolved'
    },
    {
      time: 'Today, 12:30',
      student: '10HPS22 (Class 7th A)',
      query: 'Struggling with factorization method',
      action: 'Scheduled one-on-one doubt session',
      status: 'Scheduled'
    },
    {
      time: 'Today, 10:15',
      student: '10HPS15 (Class 7th C)',
      query: 'Request for assignment extension',
      action: 'Extension granted till tomorrow',
      status: 'Approved'
    }
  ]
};

export const aiAssistantData = {
  quickQuestions: [
    {
      id: 1,
      question: 'Which students are struggling the most?',
      icon: '🎯'
    },
    {
      id: 2,
      question: 'How are teachers performing overall?',
      icon: '👨‍🏫'
    },
    {
      id: 3,
      question: 'What are the platform usage trends?',
      icon: '📈'
    },
    {
      id: 4,
      question: 'Which subjects need more attention?',
      icon: '📚'
    },
    {
      id: 5,
      question: 'Show me chatbot analytics',
      icon: '🤖'
    },
    {
      id: 6,
      question: 'Generate performance report',
      icon: '📊'
    }
  ],
  recentQueries: [
    {
      query: 'Show top 5 performing students in Mathematics',
      response: 'Based on recent data, the top 5 performing students in Mathematics are...',
      time: '2 hours ago'
    },
    {
      query: 'What is the average assignment completion rate?',
      response: 'The average assignment completion rate across all schools is 87%...',
      time: '5 hours ago'
    }
  ],
  insights: [
    {
      title: 'Student Engagement Trend',
      description: 'Student engagement has increased by 15% this week',
      type: 'positive'
    },
    {
      title: 'Assignment Submissions',
      description: 'Late submissions decreased by 20% after reminder implementation',
      type: 'positive'
    },
    {
      title: 'Teacher Response Time',
      description: 'Average teacher response time improved to 2.5 hours',
      type: 'neutral'
    }
  ]
};

export const schoolAnalyticsData = {
  topPerformingSchools: [
    {
      rank: 1,
      school: 'Delhi Public School',
      engagement: 94,
      completion: 89,
      averageScore: 91,
      trend: 'up'
    },
    {
      rank: 2,
      school: 'Ryan International',
      engagement: 91,
      completion: 85,
      averageScore: 88,
      trend: 'up'
    },
    {
      rank: 3,
      school: 'Kendriya Vidyalaya',
      engagement: 88,
      completion: 82,
      averageScore: 85,
      trend: 'stable'
    },
    {
      rank: 4,
      school: 'DAV Public School',
      engagement: 85,
      completion: 80,
      averageScore: 83,
      trend: 'down'
    },
    {
      rank: 5,
      school: 'St. Mary\'s School',
      engagement: 83,
      completion: 78,
      averageScore: 81,
      trend: 'up'
    }
  ],
  comparisonMetrics: [
    'Student Engagement',
    'Assignment Completion',
    'Average Score',
    'Teacher Activity',
    'Platform Usage'
  ],
  trendData: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: {
      delhiPublic: [85, 87, 89, 91, 93, 94],
      ryanInternational: [82, 84, 86, 88, 90, 91],
      kendriyaVidyalaya: [80, 82, 84, 86, 87, 88]
    }
  }
};