// TeacherAction.jsx - Complete Implementation
import React, { useState } from 'react';
import './TeacherAction.css';
import { FiFileText, FiUsers, FiCheckCircle, FiMessageCircle, FiBarChart, FiFilter } from 'react-icons/fi';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TeacherAction = () => {
  const [filters, setFilters] = useState({
    school: '',
    block: '',
    class: '',
    section: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [teacherData, setTeacherData] = useState(null);

  // School configuration data
  const schoolConfig = {
    'A School': {
      blocks: ['Pragna'],
      classes: {
        'Pragna': ['8', '9']
      },
      sections: {
        'Pragna': {
          '8': ['Akash'],
          '9': ['Agni']
        }
      }
    },
    'Montessori': {
      blocks: ['Minds', 'Indus', 'Montee'],
      classes: {
        'Minds': ['9'],
        'Indus': ['8'],
        'Montee': ['8', '9']
      },
      sections: {
        'Minds': {
          '9': ['M2']
        },
        'Indus': {
          '8': ['LB2']
        },
        'Montee': {
          '8': ['8-MEL3'],
          '9': ['9-MEL3']
        }
      }
    }
  };

  // Teacher data mapping
  const teachersData = {
    'A School': {
      'Pragna': {
        '8': {
          'Akash': {
            name: 'Ms. Sarah Thompson',
            subject: 'Mathematics Teacher',
            school: 'Delhi Public School - Middle Block',
            classes: '7th A, B, C'
          }
        },
        '9': {
          'Agni': {
            name: 'Mr. Rajesh Kumar',
            subject: 'Science Teacher',
            school: 'Delhi Public School - Senior Block',
            classes: '9th A, B'
          }
        }
      }
    },
    'Montessori': {
      'Minds': {
        '9': {
          'M2': {
            name: 'Ms. Priya Sharma',
            subject: 'English Teacher',
            school: 'Montessori - Minds',
            classes: '9th M2'
          }
        }
      },
      'Indus': {
        '8': {
          'LB2': {
            name: 'Mr. John David',
            subject: 'History Teacher',
            school: 'Montessori - Indus',
            classes: '8th LB2'
          }
        }
      },
      'Montee': {
        '8': {
          '8-MEL3': {
            name: 'Ms. Anita Desai',
            subject: 'Biology Teacher',
            school: 'Montessori - Montee',
            classes: '8th MEL3'
          }
        },
        '9': {
          '9-MEL3': {
            name: 'Mr. Amit Singh',
            subject: 'Physics Teacher',
            school: 'Montessori - Montee',
            classes: '9th MEL3'
          }
        }
      }
    }
  };

  // Get available options based on selections
  const getAvailableBlocks = () => {
    if (!filters.school) return [];
    return schoolConfig[filters.school]?.blocks || [];
  };

  const getAvailableClasses = () => {
    if (!filters.school || !filters.block) return [];
    return schoolConfig[filters.school]?.classes[filters.block] || [];
  };

  const getAvailableSections = () => {
    if (!filters.school || !filters.block || !filters.class) return [];
    return schoolConfig[filters.school]?.sections[filters.block]?.[filters.class] || [];
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    
    // Reset dependent filters
    if (filterType === 'school') {
      newFilters.block = '';
      newFilters.class = '';
      newFilters.section = '';
    } else if (filterType === 'block') {
      newFilters.class = '';
      newFilters.section = '';
    } else if (filterType === 'class') {
      newFilters.section = '';
    }
    
    setFilters(newFilters);
  };

  // Apply filters and get teacher data
  const handleApplyFilters = () => {
    if (filters.school && filters.block && filters.class && filters.section) {
      const teacher = teachersData[filters.school]?.[filters.block]?.[filters.class]?.[filters.section];
      if (teacher) {
        setTeacherData({
          ...teacher,
          metrics: {
            assignmentsCreated: 23,
            classworksGiven: 18,
            studentAnalyticsChecked: 156,
            chatbotInteractions: 47,
            responseRate: 89,
            feedbackGiven: 92
          }
        });
      }
    }
  };

  // Assignment data
  const assignmentData = [
    {
      type: 'Homework Created',
      title: 'Mathematics - Chapter 4: Quadratic Equations',
      class: '7th A, B, C',
      dueDate: 'Tomorrow 16:00',
      questions: '5 questions selected from question bank',
      submitted: 32,
      pending: 13,
      total: 45,
      time: 'Today, 14:25'
    },
    {
      type: 'Classwork Upload',
      title: 'Mathematics - Class Exercise',
      class: '7th B',
      time: '10:30 AM',
      questions: '8 questions',
      submitted: 28,
      total: 28,
      completionTime: '15 mins'
    },
    {
      type: 'Quiz Published',
      title: 'Mathematics - Weekly Test',
      class: '7th B',
      dueDate: 'Today 15:00',
      questions: '10 MCQ questions',
      submitted: 28,
      pending: 2,
      total: 30,
      time: 'Today, 11:30'
    },
    {
      type: 'Worksheet Shared',
      title: 'Mathematics - Practice Problems',
      class: '7th C',
      dueDate: 'Next Week',
      questions: '15 practice problems',
      submitted: 20,
      pending: 15,
      total: 35,
      time: 'Yesterday, 16:45'
    }
  ];

  // Teacher Features Chart Data
  const teacherFeaturesData = {
    labels: [
      'Chatbot Data Fetch',
      'View Classwork Submissions',
      'View Homework Submissions',
      'Create Homework',
      'Auto Submit Homework',
      'Create/Submit Classwork'
    ],
    datasets: [{
      label: 'Usage Count',
      data: [16, 9, 7, 3, 3, 2],
      backgroundColor: 'rgba(255, 99, 132, 0.7)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
      borderRadius: 4
    }]
  };

  // Top Active Students Data
  const activeStudentsData = {
    labels: ['9MMB55', '9MMB46', '9MMB49', '9MMB42', '9MMB48', '9MMB66', '9MMB41', '9MMB61', '9MMB52', '9MMB56'],
    datasets: [{
      label: 'Total Calls',
      data: [58, 40, 38, 32, 30, 26, 22, 20, 18, 15],
      backgroundColor: (context) => {
        const value = context.parsed.x;
        if (value >= 50) return 'rgba(239, 68, 68, 0.8)'; // High - Red
        if (value >= 25) return 'rgba(251, 146, 60, 0.8)'; // Medium - Orange
        return 'rgba(250, 204, 21, 0.8)'; // Low - Yellow
      },
      borderRadius: 4
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Usage Count'
        }
      }
    }
  };

  const studentChartOptions = {
    ...chartOptions,
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Total Calls'
        }
      }
    }
  };

  return (
    <div className="teacher-action-container">
      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-grid">
          <div className="filter-group">
            <label>School</label>
            <select 
              value={filters.school}
              onChange={(e) => handleFilterChange('school', e.target.value)}
              className="filter-select"
            >
              <option value="">All Schools</option>
              <option value="A School">A School</option>
              <option value="Montessori">Montessori</option>
            </select>
          </div>

          <div className="filter-group">
            <label>School Block</label>
            <select 
              value={filters.block}
              onChange={(e) => handleFilterChange('block', e.target.value)}
              className="filter-select"
              disabled={!filters.school}
            >
              <option value="">All Blocks</option>
              {getAvailableBlocks().map(block => (
                <option key={block} value={block}>{block}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Class</label>
            <select 
              value={filters.class}
              onChange={(e) => handleFilterChange('class', e.target.value)}
              className="filter-select"
              disabled={!filters.block}
            >
              <option value="">All Classes</option>
              {getAvailableClasses().map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Section</label>
            <select 
              value={filters.section}
              onChange={(e) => handleFilterChange('section', e.target.value)}
              className="filter-select"
              disabled={!filters.class}
            >
              <option value="">All Sections</option>
              {getAvailableSections().map(section => (
                <option key={section} value={section}>{section}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Date</label>
            <input 
              type="date" 
              value={filters.date}
              onChange={(e) => handleFilterChange('date', e.target.value)}
              className="filter-select"
            />
          </div>

          <button 
            className="apply-filters-btn"
            onClick={handleApplyFilters}
            disabled={!filters.school || !filters.block || !filters.class || !filters.section}
          >
            <FiFilter />
            Apply Filters
          </button>
        </div>
      </div>

      {/* Teacher Details Section */}
      {teacherData && (
        <>
          {/* Teacher Profile Card */}
          <div className="teacher-profile-card">
            <div className="profile-avatar">ST</div>
            <div className="profile-details">
              <h2 className="teacher-name">{teacherData.name}</h2>
              <p className="teacher-info">
                {teacherData.subject} | {teacherData.school} | Classes: {teacherData.classes}
              </p>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="teacher-metrics-grid">
            <div className="metric-card purple">
              <div className="metric-icon">📝</div>
              <div className="metric-value">{teacherData.metrics.assignmentsCreated}</div>
              <div className="metric-label">Assignments Created</div>
            </div>

            <div className="metric-card blue">
              <div className="metric-icon">👥</div>
              <div className="metric-value">{teacherData.metrics.classworksGiven}</div>
              <div className="metric-label">Classworks Given</div>
            </div>

            <div className="metric-card green">
              <div className="metric-icon">📊</div>
              <div className="metric-value">{teacherData.metrics.studentAnalyticsChecked}</div>
              <div className="metric-label">Student Analytics Checked</div>
            </div>

            <div className="metric-card orange">
              <div className="metric-icon">💬</div>
              <div className="metric-value">{teacherData.metrics.chatbotInteractions}</div>
              <div className="metric-label">Chatbot Interactions</div>
            </div>

            <div className="metric-card indigo">
              <div className="metric-icon">📈</div>
              <div className="metric-value">{teacherData.metrics.responseRate}%</div>
              <div className="metric-label">Response Rate</div>
            </div>

            <div className="metric-card pink">
              <div className="metric-icon">💭</div>
              <div className="metric-value">{teacherData.metrics.feedbackGiven}</div>
              <div className="metric-label">Feedback Given</div>
            </div>
          </div>

          {/* Assignment Creation Activity */}
          <div className="assignment-section">
            <h3 className="section-title">📝 Assignment Creation Activity</h3>
            <div className="assignment-list">
              {assignmentData.map((assignment, index) => (
                <div key={index} className="assignment-card">
                  <div className="assignment-header">
                    <div>
                      <h4 className="assignment-type">{assignment.type}</h4>
                      <p className="assignment-title">{assignment.title}</p>
                    </div>
                    <span className="assignment-time">{assignment.time || assignment.completionTime}</span>
                  </div>
                  
                  <div className="assignment-details">
                    <div className="detail-item">
                      <span className="detail-label">CLASS</span>
                      <span className="detail-value">{assignment.class}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">DUE</span>
                      <span className="detail-value">{assignment.dueDate || assignment.time || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">QUESTIONS</span>
                      <span className="detail-value">{assignment.questions}</span>
                    </div>
                  </div>

                  {assignment.type !== 'Classwork Upload' ? (
                    <div className="assignment-progress">
                      <div className="progress-stats">
                        <span className="submitted">✅ {assignment.submitted} Submitted</span>
                        <span className="pending">⏳ {assignment.pending} Pending</span>
                        <span className="total">Total: {assignment.total}</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${(assignment.submitted / assignment.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <div className="assignment-progress">
                      <div className="progress-stats">
                        <span className="submitted">✅ {assignment.submitted} Submitted</span>
                        <span className="total">All students completed</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: '100%' }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Charts Section */}
          <div className="charts-grid">
            {/* Teacher Features */}
            <div className="chart-section">
              <h3 className="section-title">🔥 Most Used Features</h3>
              <p className="chart-subtitle">📚 Teacher Features</p>
              <div className="chart-container">
                <Bar data={teacherFeaturesData} options={chartOptions} />
              </div>
            </div>

            {/* Top Active Students */}
            <div className="chart-section">
              <h3 className="section-title">Top 10 Most Active Students</h3>
              <div className="legend">
                <span className="legend-item high">■ High</span>
                <span className="legend-item medium">■ Medium</span>
                <span className="legend-item low">■ Low</span>
              </div>
              <div className="chart-container">
                <Bar data={activeStudentsData} options={studentChartOptions} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TeacherAction;