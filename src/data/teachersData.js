// teachersData.js
export const teachersData = {
  teachers: [
    {
      id: 'T001',
      name: 'Ms. Sarah Thompson',
      subject: 'Mathematics',
      email: 'sarah.thompson@school.edu',
      phone: '+91-9876543220',
      experience: 8,
      qualification: 'M.Sc Mathematics, B.Ed'
    },
    {
      id: 'T002',
      name: 'Mr. Rajesh Kumar',
      subject: 'Science',
      email: 'rajesh.kumar@school.edu',
      phone: '+91-9876543221',
      experience: 12,
      qualification: 'M.Sc Physics, B.Ed'
    },
    {
      id: 'T003',
      name: 'Ms. Priya Singh',
      subject: 'English',
      email: 'priya.singh@school.edu',
      phone: '+91-9876543222',
      experience: 6,
      qualification: 'M.A English Literature, B.Ed'
    }
  ],
  schedule: {
    monday: [
      { time: '9:00-10:00', class: '7A', subject: 'Mathematics' },
      { time: '10:00-11:00', class: '7B', subject: 'Mathematics' },
      { time: '11:30-12:30', class: '8A', subject: 'Mathematics' }
    ]
  }
};