// StudentActivity.jsx - Enhanced Version with Date Range and Improved UI
import React, { useState, useEffect } from 'react';
import './StudentActivity.css';
import { 
  FiArrowLeft, 
  FiClock, 
  FiTarget, 
  FiMessageCircle, 
  FiEye,
  FiTrendingUp,
  FiActivity,
  FiBook,
  FiCheckCircle,
  FiEdit3,
  FiHome,
  FiBookOpen,
  FiCalendar
} from 'react-icons/fi';

const StudentActivity = ({ filters }) => {
  const [showStudentList, setShowStudentList] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [dateRange, setDateRange] = useState('today');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Filter states
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');

  // Data structure for hierarchical dropdowns
  const schoolData = {
    'A School': {
      blocks: ['Pragna'],
      blockData: {
        'Pragna': {
          classes: ['8', '9'],
          sections: {
            '8': ['Akash'],
            '9': ['Agni']
          }
        }
      }
    },
    'Montessori': {
      blocks: ['Minds', 'Indus', 'Montee'],
      blockData: {
        'Minds': {
          classes: ['9'],
          sections: {
            '9': ['M2']
          }
        },
        'Indus': {
          classes: ['8'],
          sections: {
            '8': ['LB2']
          }
        },
        'Montee': {
          classes: ['8', '9'],
          sections: {
            '8': ['8-MEL3'],
            '9': ['9-MEL3']
          }
        }
      }
    }
  };

  // Get available options based on selections
  const getBlockOptions = () => {
    if (!selectedSchool) return [];
    return schoolData[selectedSchool]?.blocks || [];
  };

  const getClassOptions = () => {
    if (!selectedSchool || !selectedBlock) return [];
    return schoolData[selectedSchool]?.blockData[selectedBlock]?.classes || [];
  };

  const getSectionOptions = () => {
    if (!selectedSchool || !selectedBlock || !selectedClass) return [];
    return schoolData[selectedSchool]?.blockData[selectedBlock]?.sections[selectedClass] || [];
  };

  // Handle school change
  const handleSchoolChange = (e) => {
    const school = e.target.value;
    setSelectedSchool(school);
    setSelectedBlock('');
    setSelectedClass('');
    setSelectedSection('');
  };

  // Handle block change
  const handleBlockChange = (e) => {
    const block = e.target.value;
    setSelectedBlock(block);
    setSelectedClass('');
    setSelectedSection('');
  };

  // Handle class change
  const handleClassChange = (e) => {
    const cls = e.target.value;
    setSelectedClass(cls);
    setSelectedSection('');
  };

  // Generate mock students based on filters
  const generateStudents = () => {
    const students = [];
    
    if (selectedSection === 'LB2') {
      students.push(
        { id: '8IME1', status: 'Active', class: '8th Grade', section: 'LB2', school: 'Montessori', block: 'Indus' },
        { id: '8IME2', status: 'Active', class: '8th Grade', section: 'LB2', school: 'Montessori', block: 'Indus' }
      );
    } else if (selectedSection === 'Akash') {
      students.push(
        { id: '8AKS1', status: 'Active', class: '8th Grade', section: 'Akash', school: 'A School', block: 'Pragna' },
        { id: '8AKS2', status: 'Active', class: '8th Grade', section: 'Akash', school: 'A School', block: 'Pragna' }
      );
    } else if (selectedSection === 'Agni') {
      students.push(
        { id: '9AGN1', status: 'Active', class: '9th Grade', section: 'Agni', school: 'A School', block: 'Pragna' },
        { id: '9AGN2', status: 'Active', class: '9th Grade', section: 'Agni', school: 'A School', block: 'Pragna' }
      );
    } else if (selectedSection === 'M2') {
      students.push(
        { id: '9MND1', status: 'Active', class: '9th Grade', section: 'M2', school: 'Montessori', block: 'Minds' },
        { id: '9MND2', status: 'Active', class: '9th Grade', section: 'M2', school: 'Montessori', block: 'Minds' }
      );
    } else if (selectedSection === '8-MEL3') {
      students.push(
        { id: '8MEL1', status: 'Active', class: '8th Grade', section: '8-MEL3', school: 'Montessori', block: 'Montee' },
        { id: '8MEL2', status: 'Active', class: '8th Grade', section: '8-MEL3', school: 'Montessori', block: 'Montee' }
      );
    } else if (selectedSection === '9-MEL3') {
      students.push(
        { id: '9MEL1', status: 'Active', class: '9th Grade', section: '9-MEL3', school: 'Montessori', block: 'Montee' },
        { id: '9MEL2', status: 'Active', class: '9th Grade', section: '9-MEL3', school: 'Montessori', block: 'Montee' }
      );
    }
    
    return students;
  };

  const students = generateStudents();

  // Extract number from student ID for display
  const extractNumber = (studentId) => {
    return studentId.match(/\d+$/)?.[0] || '';
  };

  // Timeline data with duration
  const timelineData = [
    {
      duration: '12 min',
      title: 'Homework Submission',
      description: 'Math - Quadratic Equations | Score: 94%',
      type: 'Homework',
      color: '#48bb78',
      icon: '📝'
    },
    {
      duration: '8 min',
      title: 'Auto Correct',
      description: 'Uploaded solution image for Q3',
      type: 'Autocorrect',
      color: '#f6ad55',
      icon: '✅'
    },
    {
      duration: '15 min',
      title: 'Solve',
      description: 'Viewed step-by-step solution for Question 2',
      type: 'Solve',
      color: '#667eea',
      icon: '🔍'
    },
    {
      duration: '5 min',
      title: 'Chatbot',
      description: 'Asked: "How to solve quadratic equations?"',
      type: 'Chatbot',
      color: '#4299e1',
      icon: '💬'
    },
    {
      duration: '10 min',
      title: 'Homework View',
      description: 'Math Chapter 4 - Quadratic Equations',
      type: 'Homework View',
      color: '#9f7aea',
      icon: '📚'
    },
    {
      duration: '7 min',
      title: 'Concepts',
      description: 'Viewed concept: Quadratic Formula',
      type: 'Concepts',
      color: '#f687b3',
      icon: '💡'
    },
    {
      duration: '5 min',
      title: 'Classwork View',
      description: 'Science Chapter 3 - Force and Motion',
      type: 'Classwork View',
      color: '#a78bfa',
      icon: '📖'
    }
  ];

  // Activity breakdown data
  const activityData = [
    { name: 'Solve', count: 35, percentage: 28, icon: '🔍', color: '#667eea' },
    { name: 'Concepts', count: 28, percentage: 22, icon: '💡', color: '#4299e1' },
    { name: 'Auto Correct', count: 22, percentage: 17, icon: '✅', color: '#48bb78' },
    { name: 'Chatbot', count: 18, percentage: 14, icon: '💬', color: '#f6ad55' },
    { name: 'Homework Submit', count: 15, percentage: 11, icon: '📝', color: '#fc8181' },
    { name: 'Homework View', count: 12, percentage: 6, icon: '📚', color: '#f6e05e' },
    { name: 'Classwork View', count: 10, percentage: 2, icon: '📖', color: '#a0aec0' }
  ];

  const handleApplyFilters = () => {
    if (selectedSchool && selectedBlock && selectedClass && selectedSection) {
      setShowStudentList(true);
    } else {
      alert('Please select all filter options');
    }
  };

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setSelectedStudent(null);
  };

  const handleDateRangeSelect = () => {
    setDateRange('range');
    setShowDatePicker(true);
  };

  const applyDateRange = () => {
    if (startDate && endDate) {
      setShowDatePicker(false);
      // Apply date range logic here
    }
  };

  // If a student is selected, show their details
  if (selectedStudent) {
    const studentNumber = extractNumber(selectedStudent.id);
    
    return (
      <div className="student-activity-container">
        <button className="back-button" onClick={handleBackToList}>
          <FiArrowLeft /> Back to Students List
        </button>

        {/* Student Profile Card */}
        <div className="student-profile-card">
          <div className="profile-background-pattern"></div>
          <div className="profile-info">
            <h2 className="student-id-display">Student ID: {selectedStudent.id}</h2>
            <p className="student-details">
              {selectedStudent.class} - {selectedStudent.school} | {selectedStudent.block} - {selectedStudent.section}
            </p>
          </div>
          {studentNumber && <div className="profile-number">{studentNumber}</div>}
        </div>

        {/* Date Range Selector */}
        <div className="date-range-container">
          <div className="date-range-selector">
            <button 
              className={`range-btn ${dateRange === 'today' ? 'active' : ''}`}
              onClick={() => {
                setDateRange('today');
                setShowDatePicker(false);
              }}
            >
              Today
            </button>
            <button 
              className={`range-btn ${dateRange === 'range' ? 'active' : ''}`}
              onClick={handleDateRangeSelect}
            >
              Date Range
            </button>
          </div>

          {showDatePicker && (
            <div className="date-picker-container">
              <div className="date-input-group">
                <label>From:</label>
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="date-input"
                />
              </div>
              <div className="date-input-group">
                <label>To:</label>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="date-input"
                />
              </div>
              <button className="apply-date-btn" onClick={applyDateRange}>
                Apply
              </button>
            </div>
          )}
        </div>

        {/* Enhanced Metrics Grid with Colors */}
        <div className="metrics-grid">
          <div className="metric-card time-card">
            <div className="metric-icon-wrapper">
              <FiClock className="metric-icon" />
            </div>
            <div className="metric-content">
              <div className="metric-value">4h 32m</div>
              <div className="metric-label">Total Active Time</div>
            </div>
          </div>

          <div className="metric-card questions-card">
            <div className="metric-icon-wrapper success">
              <FiTarget className="metric-icon" />
            </div>
            <div className="metric-content">
              <div className="metric-value">60</div>
              <div className="metric-label">Questions Solved</div>
              <div className="questions-breakdown">
                <div className="breakdown-item">
                  <span className="breakdown-label">HW</span>
                  <span className="breakdown-value">20/25</span>
                </div>
                <div className="breakdown-item">
                  <span className="breakdown-label">CW</span>
                  <span className="breakdown-value">22/25</span>
                </div>
                <div className="breakdown-item">
                  <span className="breakdown-label">Auto</span>
                  <span className="breakdown-value">18</span>
                </div>
              </div>
            </div>
          </div>

          <div className="metric-card chatbot-card">
            <div className="metric-icon-wrapper info">
              <FiMessageCircle className="metric-icon" />
            </div>
            <div className="metric-content">
              <div className="metric-value">7</div>
              <div className="metric-label">Chatbot Queries</div>
              <div className="metric-trend success">
                <FiTrendingUp /> +23% from yesterday
              </div>
            </div>
          </div>

          <div className="metric-card concepts-card">
            <div className="metric-icon-wrapper warning">
              <FiEye className="metric-icon" />
            </div>
            <div className="metric-content">
              <div className="metric-value">12</div>
              <div className="metric-label">Concept Views</div>
              <div className="metric-badge">Active Learner</div>
            </div>
          </div>
        </div>

        {/* Enhanced App Usage Timeline */}
        <div className="timeline-section">
          <div className="timeline-header">
            <FiActivity /> App Usage Timeline
          </div>
          <div className="timeline-new">
            {timelineData.map((item, index) => (
              <div 
                key={index}
                className="timeline-item-new"
                style={{'--activity-color': item.color}}
              >
                <div className="timeline-connector"></div>
                <div className="timeline-content-new">
                  <div className="timeline-icon-new">{item.icon}</div>
                  <div className="timeline-body">
                    <div className="timeline-title">{item.title}</div>
                    <div className="timeline-description">{item.description}</div>
                    <span className="timeline-tag" style={{backgroundColor: item.color}}>
                      {item.type}
                    </span>
                  </div>
                  <div className="timeline-duration-badge">{item.duration}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Combined Activity Breakdown */}
        <div className="activity-breakdown-combined">
          <div className="breakdown-header">
            <FiActivity /> Activity Breakdown (API Requests)
          </div>
          
          <div className="activity-visual-container">
            {/* Cards Section */}
            <div className="activity-cards-section">
              {activityData.map((activity, index) => (
                <div 
                  key={index}
                  className="activity-card-new"
                  style={{'--activity-color': activity.color}}
                >
                  <div className="activity-percentage-badge">{activity.percentage}%</div>
                  <div className="activity-icon-new">{activity.icon}</div>
                  <div className="activity-count">{activity.count}</div>
                  <div className="activity-name">{activity.name}</div>
                  <div className="activity-progress-bar">
                    <div 
                      className="progress-fill"
                      style={{width: `${activity.percentage * 3}%`, background: activity.color}}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bar Chart Section */}
            <div className="chart-section">
              <h3 className="chart-title">Visual Representation</h3>
              <div className="bar-chart-new">
                {activityData.map((activity, index) => (
                  <div key={index} className="bar-container">
                    <div 
                      className="bar-new"
                      style={{
                        height: `${(activity.count / 35) * 100}%`,
                        background: `linear-gradient(180deg, ${activity.color}, ${activity.color}aa)`
                      }}
                    >
                      <span className="bar-value">{activity.count}</span>
                    </div>
                    <span className="bar-label">{activity.name.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show filters and student list
  return (
    <div className="student-activity-container">
      {/* Enhanced Filter Section */}
      <div className="filters-section">
        <div className="filters-header">
          <h2 className="filters-title">Filter Students</h2>
          <div className="filters-badge">Dynamic Filters</div>
        </div>
        
        <div className="filter-grid">
          <div className="filter-group">
            <label className="filter-label">
              <FiHome className="filter-icon" /> School
            </label>
            <select 
              className="filter-select"
              value={selectedSchool}
              onChange={handleSchoolChange}
            >
              <option value="">Select School</option>
              <option value="A School">A School</option>
              <option value="Montessori">Montessori</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label className="filter-label">
              <FiBookOpen className="filter-icon" /> School Block
            </label>
            <select 
              className="filter-select"
              value={selectedBlock}
              onChange={handleBlockChange}
              disabled={!selectedSchool}
            >
              <option value="">Select Block</option>
              {getBlockOptions().map(block => (
                <option key={block} value={block}>{block}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label className="filter-label">
              <FiBook className="filter-icon" /> Class
            </label>
            <select 
              className="filter-select"
              value={selectedClass}
              onChange={handleClassChange}
              disabled={!selectedBlock}
            >
              <option value="">Select Class</option>
              {getClassOptions().map(cls => (
                <option key={cls} value={cls}>{cls}th Grade</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label className="filter-label">
              <FiEdit3 className="filter-icon" /> Section
            </label>
            <select 
              className="filter-select"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              disabled={!selectedClass}
            >
              <option value="">Select Section</option>
              {getSectionOptions().map(section => (
                <option key={section} value={section}>{section}</option>
              ))}
            </select>
          </div>
        </div>
        
        <button 
          className="apply-filters-btn" 
          onClick={handleApplyFilters}
          disabled={!selectedSchool || !selectedBlock || !selectedClass || !selectedSection}
        >
          <span className="btn-icon">✨</span>
          Apply Filters
          <span className="btn-gradient"></span>
        </button>
      </div>

      {/* Students List */}
      {showStudentList && students.length > 0 && (
        <div className="students-list-section">
          <div className="section-header">
            <h2 className="section-title">Students List</h2>
            <div className="section-count">{students.length} Students Found</div>
          </div>
          
          <div className="students-grid">
            {students.map((student, index) => (
              <div 
                key={student.id}
                className="student-card"
                style={{'--index': index}}
              >
                <div className="student-card-gradient"></div>
                <div className="student-avatar">
                  <span className="avatar-icon">👤</span>
                  <div className="avatar-ring"></div>
                </div>
                <h3 className="student-id">{student.id}</h3>
                <div className="student-info">
                  <span className="info-label">Status:</span>
                  <span className="info-value status-active">{student.status}</span>
                </div>
                <div className="student-info">
                  <span className="info-label">Class:</span>
                  <span className="info-value">{student.class}</span>
                </div>
                <div className="student-info">
                  <span className="info-label">Section:</span>
                  <span className="info-value">{student.section}</span>
                </div>
                <button 
                  className="view-details-btn"
                  onClick={() => handleViewDetails(student)}
                >
                  <span className="btn-dot">•</span> View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentActivity;