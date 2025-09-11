// StudentActivity.jsx
import React, { useState, useEffect } from 'react';
import './StudentActivity.css';
import { FiClock, FiTarget, FiMessageCircle, FiEye, FiCheckCircle, FiCalendar, FiFilter } from 'react-icons/fi';
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

const StudentActivity = () => {
  const [filters, setFilters] = useState({
    school: '',
    block: '',
    class: '',
    section: ''
  });

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentsList, setStudentsList] = useState([]);
  const [timelineFilter, setTimelineFilter] = useState('today');
  const [dateRange, setDateRange] = useState({
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

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

  // Sample students data
  const studentsData = {
    'A School': {
      'Pragna': {
        '8': {
          'Akash': [
            { id: '8APS01', name: 'Student 1', status: 'Active' },
            { id: '8APS02', name: 'Student 2', status: 'Active' },
            { id: '8APS03', name: 'Student 3', status: 'Active' }
          ]
        },
        '9': {
          'Agni': [
            { id: '9APS01', name: 'Student 4', status: 'Active' },
            { id: '9APS02', name: 'Student 5', status: 'Active' }
          ]
        }
      }
    },
    'Montessori': {
      'Minds': {
        '9': {
          'M2': [
            { id: '9MME1', name: 'Student 6', status: 'Active' },
            { id: '9MME2', name: 'Student 7', status: 'Active' },
            { id: '9MME3', name: 'Student 8', status: 'Active' },
            { id: '9MME4', name: 'Student 9', status: 'Active' }
          ]
        }
      },
      'Indus': {
        '8': {
          'LB2': [
            { id: '8IME1', name: 'Student 10', status: 'Active' },
            { id: '8IME2', name: 'Student 11', status: 'Active' }
          ]
        }
      },
      'Montee': {
        '8': {
          '8-MEL3': [
            { id: '8MME1', name: 'Student 12', status: 'Active' },
            { id: '8MME2', name: 'Student 13', status: 'Active' }
          ]
        },
        '9': {
          '9-MEL3': [
            { id: '9MME1', name: 'Student 14', status: 'Active' },
            { id: '9MME2', name: 'Student 15', status: 'Active' }
          ]
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

  // Apply filters and get students list
  const handleApplyFilters = () => {
    if (filters.school && filters.block && filters.class && filters.section) {
      const filteredStudents = studentsData[filters.school]?.[filters.block]?.[filters.class]?.[filters.section] || [];
      setStudentsList(filteredStudents);
    }
  };

  // Student details view
  const renderStudentDetails = () => {
    if (!selectedStudent) return null;

    const studentInfo = {
      totalActiveTime: '4h 32m',
      homeworkSolved: 20,
      homeworkTotal: 25,
      classworkSolved: 22,
      classworkTotal: 25,
      autoScore: 18,
      chatbotQueries: 7,
      conceptViews: 12
    };

    const totalQuestionsSolved = studentInfo.homeworkSolved + studentInfo.classworkSolved + studentInfo.autoScore;

    const timelineData = [
      { time: '10:32', activity: 'Homework Submission', details: 'Math - Quadratic Equations | Score: 94%', type: 'homework' },
      { time: '10:28', activity: 'Auto Correct', details: 'Uploaded solution image for Q3', type: 'autocorrect' },
      { time: '10:25', activity: 'Solve', details: 'Viewed step-by-step solution for Question 2', type: 'solve' },
      { time: '10:20', activity: 'Chatbot', details: 'Asked: "How to solve quadratic equations?"', type: 'chatbot' },
      { time: '10:15', activity: 'Homework View', details: 'Math Chapter 4 - Quadratic Equations', type: 'homework-view' },
      { time: '10:10', activity: 'Concepts', details: 'Viewed concept: Quadratic Formula', type: 'concepts' },
      { time: '10:05', activity: 'Classwork View', details: 'Science Chapter 3 - Force and Motion', type: 'classwork-view' }
    ];

    const activityBreakdownData = {
      labels: ['Solve', 'Concepts', 'Auto Correct', 'Chatbot', 'Homework\nSubmission', 'Homework\nView', 'Classwork\nView'],
      datasets: [{
        label: 'API Requests',
        data: [35, 28, 22, 18, 15, 12, 10],
        backgroundColor: [
          'rgba(139, 92, 246, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(107, 114, 128, 0.8)'
        ],
        borderRadius: 8
      }]
    };

    const chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Number of API Requests'
          }
        }
      }
    };

    return (
      <div className="student-details-view">
        <button 
          className="back-button"
          onClick={() => setSelectedStudent(null)}
        >
          ← Back to Students List
        </button>

        <div className="student-profile-header">
          <h2>Student ID: {selectedStudent.id}</h2>
          <p>{filters.class}th - {filters.school} | {filters.block} - {filters.section}</p>
        </div>

        {/* Date Filter for Timeline and Activity */}
        <div className="timeline-filter-bar">
          <button 
            className={`filter-btn ${timelineFilter === 'today' ? 'active' : ''}`}
            onClick={() => setTimelineFilter('today')}
          >
            Today
          </button>
          <button 
            className={`filter-btn ${timelineFilter === 'dateRange' ? 'active' : ''}`}
            onClick={() => setTimelineFilter('dateRange')}
          >
            Date Range
          </button>
          {timelineFilter === 'dateRange' && (
            <div className="date-range-inputs">
              <input 
                type="date" 
                value={dateRange.from}
                onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
              />
              <span>to</span>
              <input 
                type="date" 
                value={dateRange.to}
                onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
              />
            </div>
          )}
        </div>

        {/* Metrics Cards */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon" style={{ backgroundColor: '#ede9fe' }}>
              <FiClock style={{ color: '#8b5cf6' }} />
            </div>
            <div className="metric-content">
              <h3>{studentInfo.totalActiveTime}</h3>
              <p>Total Active Time</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon" style={{ backgroundColor: '#dcfce7' }}>
              <FiTarget style={{ color: '#22c55e' }} />
            </div>
            <div className="metric-content">
              <h3>{totalQuestionsSolved}</h3>
              <p>Questions Solved</p>
              <div className="metric-breakdown">
                <span>HW: {studentInfo.homeworkSolved}/{studentInfo.homeworkTotal}</span>
                <span>CW: {studentInfo.classworkSolved}/{studentInfo.classworkTotal}</span>
                <span>Auto: {studentInfo.autoScore}</span>
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon" style={{ backgroundColor: '#dbeafe' }}>
              <FiMessageCircle style={{ color: '#3b82f6' }} />
            </div>
            <div className="metric-content">
              <h3>{studentInfo.chatbotQueries}</h3>
              <p>Chatbot Queries</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon" style={{ backgroundColor: '#fef3c7' }}>
              <FiEye style={{ color: '#f59e0b' }} />
            </div>
            <div className="metric-content">
              <h3>{studentInfo.conceptViews}</h3>
              <p>Concept Views</p>
            </div>
          </div>
        </div>

        {/* App Usage Timeline */}
        <div className="timeline-section">
          <h3>🕐 App Usage Timeline</h3>
          <div className="timeline-list">
            {timelineData.map((item, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-time">{item.time}</div>
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h4>{item.activity}</h4>
                  <p>{item.details}</p>
                  <span className={`activity-type ${item.type}`}>{item.type.replace('-', ' ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Breakdown Chart */}
        <div className="activity-breakdown-section">
          <h3>📊 Activity Breakdown (API Requests)</h3>
          <div className="chart-container">
            <Bar data={activityBreakdownData} options={chartOptions} />
          </div>
        </div>
      </div>
    );
  };

  // Main render
  return (
    <div className="student-activity-container">
      {!selectedStudent ? (
        <>
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

          {/* Students List */}
          {studentsList.length > 0 && (
            <div className="students-list-section">
              <h3>Students List</h3>
              <div className="students-grid">
                {studentsList.map(student => (
                  <div key={student.id} className="student-card">
                    <div className="student-avatar">👤</div>
                    <div className="student-info">
                      <h4>{student.id}</h4>
                      <p>Status: {student.status}</p>
                      <p>Class: {filters.class}th Grade</p>
                    </div>
                    <button 
                      className="view-details-btn"
                      onClick={() => setSelectedStudent(student)}
                    >
                      • View Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        renderStudentDetails()
      )}
    </div>
  );
};

export default StudentActivity;