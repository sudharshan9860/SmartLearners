// src/components/TeacherAction/TeacherAction.jsx
import React, { useState, useEffect } from 'react';
import './TeacherAction.css';
import { 
  FiUsers, 
  FiFileText, 
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiActivity,
  FiBook,
  FiEdit3,
  FiDatabase,
  FiEye,
  FiGrid,
  FiCalendar,
  FiFilter,
  FiBarChart2,
  FiClipboard,
  FiUser
} from 'react-icons/fi';
import ApiService from '../../services/apiService';
import LoadingSpinner from '../common/LoadingSpinner';

const TeacherAction = ({ apiHealthy }) => {
  // State for filters
  const [filters, setFilters] = useState({
    school: '',
    block: '',
    class: '',
    section: ''
  });

  // State for data
  const [schoolLogs, setSchoolLogs] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [teacherDetails, setTeacherDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState('today');
  const [dateRange, setDateRange] = useState({
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  // API to Display Mapping
  const API_TO_DISPLAY_MAPPING = {
    'Minds_9th': {
      school: 'Montessori',
      block: 'Minds',
      class: '9th',
      section: 'M2'
    },
    'Indus_8th': {
      school: 'Montessori',
      block: 'Indus',
      class: '8th',
      section: 'LB2'
    },
    'Montee_9th': {
      school: 'Montessori',
      block: 'Montee',
      class: '9th',
      section: '9-MEL3'
    },
    'Montee_8th': {
      school: 'Montessori',
      block: 'Montee',
      class: '8th',
      section: '8-MEL3'
    },
    'Pragna_9th': {
      school: 'A School',
      block: 'Pragna',
      class: '9th',
      section: 'Agni'
    },
    'Pragna_8th': {
      school: 'A School',
      block: 'Pragna',
      class: '8th',
      section: 'Akash'
    }
  };

  // School Hierarchy
  const SCHOOL_HIERARCHY = {
    'A School': {
      blocks: {
        'Pragna': {
          classes: {
            '8th': ['Akash'],
            '9th': ['Agni']
          }
        }
      }
    },
    'Montessori': {
      blocks: {
        'Minds': {
          classes: {
            '9th': ['M2']
          }
        },
        'Indus': {
          classes: {
            '8th': ['LB2']
          }
        },
        'Montee': {
          classes: {
            '8th': ['8-MEL3'],
            '9th': ['9-MEL3']
          }
        }
      }
    }
  };

  // Action type mapping
  const ACTION_MAPPING = {
    'fetch_homework_submissions': {
      display: 'View Homework Submissions',
      category: 'view',
      color: '#06b6d4'
    },
    'get_homework_list': {
      display: 'Get Homework List',
      category: 'view',
      color: '#0ea5e9'
    },
    'chatbot_query': {
      display: 'Chatbot Data Fetch',
      category: 'ai',
      color: '#f59e0b'
    },
    'view_classwork_submissions': {
      display: 'View Classwork Submissions',
      category: 'view',
      color: '#84cc16'
    },
    'create_homework': {
      display: 'Create Homework',
      category: 'create',
      color: '#8b5cf6'
    },
    'submit_classwork': {
      display: 'Create/Submit Classwork',
      category: 'create',
      color: '#3b82f6'
    },
    'create_worksheets': {
      display: 'Create Worksheets',
      category: 'create',
      color: '#ec4899'
    },
    'auto_homework_submission': {
      display: 'Auto Submit Homework',
      category: 'submit',
      color: '#10b981'
    }
  };

  // Load school logs on component mount
  useEffect(() => {
    if (apiHealthy) {
      loadSchoolLogs();
    }
  }, [apiHealthy]);

  const loadSchoolLogs = async () => {
    try {
      setLoading(true);
      const logs = await ApiService.getSchoolLogs();
      setSchoolLogs(logs);
    } catch (error) {
      console.error('Failed to load school logs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get the API key for current filter selection
  const getApiKeyForFilters = () => {
    const { block, class: className, section } = filters;
    
    for (const [apiKey, mapping] of Object.entries(API_TO_DISPLAY_MAPPING)) {
      if (mapping.block === block && 
          mapping.class === className && 
          mapping.section === section) {
        return apiKey;
      }
    }
    return null;
  };

  // Get dynamic filter options
  const getBlockOptions = () => {
    if (!filters.school) return [];
    return Object.keys(SCHOOL_HIERARCHY[filters.school]?.blocks || {});
  };

  const getClassOptions = () => {
    if (!filters.school || !filters.block) return [];
    return Object.keys(SCHOOL_HIERARCHY[filters.school]?.blocks[filters.block]?.classes || {});
  };

  const getSectionOptions = () => {
    if (!filters.school || !filters.block || !filters.class) return [];
    return SCHOOL_HIERARCHY[filters.school]?.blocks[filters.block]?.classes[filters.class] || [];
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    
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

  // Apply filters and load teachers
  const applyFilters = () => {
    if (filters.section && schoolLogs) {
      loadTeachers();
    }
  };

  const loadTeachers = () => {
    try {
      setLoading(true);
      
      const apiKey = getApiKeyForFilters();
      if (!apiKey || !schoolLogs[apiKey]) {
        setTeachers([]);
        return;
      }

      const classData = schoolLogs[apiKey];
      const teacherData = classData.teachers || {};

      // Process teachers based on date filter
      const teacherList = [];
      
      Object.entries(teacherData).forEach(([teacherEmail, activities]) => {
        let filteredActivities = activities;

        // Filter activities by date
        if (dateFilter === 'today') {
          const today = new Date().toISOString().split('T')[0];
          filteredActivities = activities.filter(a => a.date === today);
        } else if (dateFilter === 'range') {
          filteredActivities = activities.filter(a => {
            return a.date >= dateRange.from && a.date <= dateRange.to;
          });
        }

        if (filteredActivities.length > 0) {
          // Calculate metrics for this teacher
          const metrics = calculateTeacherMetrics(filteredActivities);
          
          teacherList.push({
            email: teacherEmail,
            name: teacherEmail.split('@')[0].charAt(0).toUpperCase() + 
                  teacherEmail.split('@')[0].slice(1),
            activityCount: filteredActivities.length,
            lastActive: filteredActivities[0].timestamp,
            metrics,
            activities: filteredActivities
          });
        }
      });

      setTeachers(teacherList);
    } catch (error) {
      console.error('Failed to load teachers:', error);
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateTeacherMetrics = (activities) => {
    const metrics = {
      homeworksCreated: 0,
      classworksGiven: 0,
      worksheetsCreated: 0,
      studentAnalysisChecked: 0,
      chatbotQueries: 0,
      totalActivities: activities.length
    };

    activities.forEach(activity => {
      if (activity.action === 'create_homework') metrics.homeworksCreated++;
      if (activity.action === 'submit_classwork') metrics.classworksGiven++;
      if (activity.action === 'create_worksheets') metrics.worksheetsCreated++;
      if (activity.action === 'fetch_homework_submissions' || 
          activity.action === 'view_classwork_submissions') {
        metrics.studentAnalysisChecked++;
      }
      if (activity.action === 'chatbot_query') metrics.chatbotQueries++;
    });

    return metrics;
  };

  const selectTeacher = (teacher) => {
    setSelectedTeacher(teacher.email);
    
    // Process detailed data for selected teacher
    const featureUsage = {};
    const assignments = [];
    
    teacher.activities.forEach(activity => {
      const mapping = ACTION_MAPPING[activity.action];
      if (mapping) {
        featureUsage[mapping.display] = (featureUsage[mapping.display] || 0) + 1;
        
        // Create assignment entries for certain actions
        if (activity.action === 'create_homework') {
          assignments.push({
            type: 'homework',
            title: 'Chapter 5: Algebra',
            submitted: Math.floor(Math.random() * 25) + 5,
            pending: Math.floor(Math.random() * 10),
            timestamp: activity.timestamp
          });
        }
        if (activity.action === 'submit_classwork') {
          assignments.push({
            type: 'classwork',
            title: 'Class Exercise',
            submitted: 30,
            pending: 0,
            timestamp: activity.timestamp
          });
        }
        if (activity.action === 'create_worksheets') {
          assignments.push({
            type: 'worksheet',
            title: 'Practice Problems',
            submitted: Math.floor(Math.random() * 20) + 10,
            pending: Math.floor(Math.random() * 15),
            timestamp: activity.timestamp
          });
        }
      }
    });

    setTeacherDetails({
      ...teacher,
      featureUsage,
      assignments: assignments.slice(0, 5) // Latest 5 assignments
    });
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleBackToList = () => {
    setSelectedTeacher(null);
    setTeacherDetails(null);
  };

  // Render teacher list
  const renderTeacherList = () => (
    <div className="teacher-list-container">
      <div className="list-header">
        <h3>Teachers in {filters.block} - {filters.class} {filters.section}</h3>
        <div className="list-summary">
          <span className="summary-item">
            <FiUsers /> Total: {teachers.length}
          </span>
        </div>
      </div>

      <div className="teachers-grid">
        {teachers.map(teacher => (
          <div key={teacher.email} className="teacher-card">
            <div className="teacher-card-header">
              <div className="teacher-avatar">
                <FiUser />
              </div>
              <div className="teacher-info">
                <h4>{teacher.name}</h4>
                <p className="teacher-email">{teacher.email}</p>
              </div>
            </div>
            
            <div className="teacher-card-stats">
              <div className="stat-row">
                <span className="stat-label">Activities</span>
                <span className="stat-value">{teacher.activityCount}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Homeworks</span>
                <span className="stat-value">{teacher.metrics.homeworksCreated}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Classworks</span>
                <span className="stat-value">{teacher.metrics.classworksGiven}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Last Active</span>
                <span className="stat-value small">{formatDate(teacher.lastActive)}</span>
              </div>
            </div>

            <button 
              className="view-details-btn"
              onClick={() => selectTeacher(teacher)}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  // Render teacher details
  const renderTeacherDetails = () => {
    if (!teacherDetails) return null;

    return (
      <div className="teacher-details-container">
        <button className="back-button" onClick={handleBackToList}>
          <FiUsers /> Back to List
        </button>

        {/* Teacher Profile Card */}
        <div className="teacher-profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              <FiUser />
            </div>
            <div className="profile-info">
              <h2>{teacherDetails.name}</h2>
              <p className="teacher-role">Mathematics Teacher</p>
              <p className="teacher-school">
                {filters.school} • {filters.block} • {filters.class} {filters.section}
              </p>
            </div>
          </div>
        </div>

        {/* Metrics Section */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon homework">
              <FiFileText />
            </div>
            <div className="metric-content">
              <span className="metric-label">Homeworks Created</span>
              <span className="metric-value">{teacherDetails.metrics.homeworksCreated}</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon classwork">
              <FiClipboard />
            </div>
            <div className="metric-content">
              <span className="metric-label">Classworks Given</span>
              <span className="metric-value">{teacherDetails.metrics.classworksGiven}</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon worksheet">
              <FiEdit3 />
            </div>
            <div className="metric-content">
              <span className="metric-label">Worksheets Created</span>
              <span className="metric-value">{teacherDetails.metrics.worksheetsCreated}</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon analysis">
              <FiEye />
            </div>
            <div className="metric-content">
              <span className="metric-label">Student Analysis Checked</span>
              <span className="metric-value">{teacherDetails.metrics.studentAnalysisChecked}</span>
            </div>
          </div>
        </div>

        {/* Assignment Creation Activity */}
        <div className="assignments-section">
          <h3>Assignment Creation Activity</h3>
          <div className="assignments-list">
            {teacherDetails.assignments.map((assignment, index) => (
              <div key={index} className="assignment-card">
                <div className="assignment-type">
                  {assignment.type === 'homework' && <FiFileText />}
                  {assignment.type === 'classwork' && <FiClipboard />}
                  {assignment.type === 'worksheet' && <FiEdit3 />}
                  <span>{assignment.type}</span>
                </div>
                <div className="assignment-details">
                  <h4>{assignment.title}</h4>
                  <div className="submission-stats">
                    <div className="stats-info">
                      <span className="submitted">{assignment.submitted} Submitted</span>
                      <span className="pending">{assignment.pending} Pending</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${(assignment.submitted / (assignment.submitted + assignment.pending)) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Teacher Features Chart */}
        <div className="features-chart-section">
          <h3>Teacher Features Usage</h3>
          <div className="horizontal-bar-chart">
            {Object.entries(teacherDetails.featureUsage)
              .sort((a, b) => b[1] - a[1])
              .map(([feature, count]) => {
                const maxCount = Math.max(...Object.values(teacherDetails.featureUsage));
                const percentage = (count / maxCount) * 100;
                
                return (
                  <div key={feature} className="chart-row">
                    <div className="chart-label">{feature}</div>
                    <div className="chart-bar-container">
                      <div 
                        className="chart-bar"
                        style={{ 
                          width: `${percentage}%`,
                          background: `linear-gradient(to right, #6366f1, #8b5cf6)`
                        }}
                      >
                        <span className="bar-value">{count}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="teacher-action-container">
      <div className="action-header">
        <h2>
          <FiUsers /> Teacher Action Details
        </h2>
      </div>

      {!selectedTeacher && (
        <>
          <div className="filter-section">
            <div className="filter-row">
              <div className="filter-group">
                <label>School</label>
                <select 
                  value={filters.school} 
                  onChange={(e) => handleFilterChange('school', e.target.value)}
                  className="filter-select"
                >
                  <option value="">Select School</option>
                  {Object.keys(SCHOOL_HIERARCHY).map(school => (
                    <option key={school} value={school}>{school}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Block</label>
                <select 
                  value={filters.block} 
                  onChange={(e) => handleFilterChange('block', e.target.value)}
                  className="filter-select"
                  disabled={!filters.school}
                >
                  <option value="">Select Block</option>
                  {getBlockOptions().map(block => (
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
                  <option value="">Select Class</option>
                  {getClassOptions().map(cls => (
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
                  <option value="">Select Section</option>
                  {getSectionOptions().map(section => (
                    <option key={section} value={section}>{section}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date Filter */}
            <div className="date-filter-row">
              <div className="date-filter-group">
                <button 
                  className={`date-btn ${dateFilter === 'today' ? 'active' : ''}`}
                  onClick={() => setDateFilter('today')}
                >
                  Today
                </button>
                <button 
                  className={`date-btn ${dateFilter === 'range' ? 'active' : ''}`}
                  onClick={() => setDateFilter('range')}
                >
                  Date Range
                </button>
                
                {dateFilter === 'range' && (
                  <div className="date-inputs">
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

              <button 
                className="apply-filters-btn"
                onClick={applyFilters}
                disabled={!filters.section}
              >
                <FiFilter /> Apply Filters
              </button>
            </div>

            {filters.section && (
              <div className="filter-summary">
                <FiFilter />
                <span>
                  Showing teachers from: {filters.school} → {filters.block} → {filters.class} {filters.section}
                </span>
              </div>
            )}
          </div>
        </>
      )}

      <div className="action-content">
        {loading ? (
          <LoadingSpinner text="Loading teacher data..." />
        ) : selectedTeacher ? (
          renderTeacherDetails()
        ) : teachers.length > 0 ? (
          renderTeacherList()
        ) : filters.section ? (
          <div className="empty-state">
            <FiUsers />
            <h3>No Teachers Found</h3>
            <p>No teacher activity found for the selected filters and date range</p>
          </div>
        ) : (
          <div className="empty-state">
            <FiFilter />
            <h3>Select Filters to View Teachers</h3>
            <p>Choose School, Block, Class, Section and apply filters to see teacher activity data</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherAction;