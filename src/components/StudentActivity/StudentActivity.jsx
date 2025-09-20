// src/components/StudentActivity/StudentActivity.jsx
import React, { useState, useEffect } from 'react';
import './StudentActivity.css';
import { 
  FiActivity, 
  FiUser, 
  FiUsers,
  FiClock, 
  FiCheckCircle,
  FiBook,
  FiMessageSquare,
  FiEdit3,
  FiEye,
  FiCalendar,
  FiFilter,
  FiChevronLeft,
  FiTrendingUp,
  FiTarget,
  FiAward,
  FiBarChart2
} from 'react-icons/fi';
import ApiService from '../../services/apiService';
import LoadingSpinner from '../common/LoadingSpinner';

const StudentActivity = ({ apiHealthy }) => {
  // State for filters
  const [filters, setFilters] = useState({
    school: '',
    block: '',
    class: '',
    section: ''
  });

  // State for data
  const [dailyRollups, setDailyRollups] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState('today');
  const [customDateRange, setCustomDateRange] = useState({
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });
  const [listDateFilter, setListDateFilter] = useState('today');
  const [listDateRange, setListDateRange] = useState({
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  // Mapping between API keys and display structure
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

  // Filter Configuration based on API structure
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

  // Activity type mapping with colors
  const ACTIVITY_TYPES = {
    'solve': { 
      display: 'Solve', 
      color: '#8b5cf6', 
      bgColor: '#f3e7fc',
      icon: <FiEdit3 />
    },
    'concepts_required': { 
      display: 'Concepts', 
      color: '#3b82f6', 
      bgColor: '#dbeafe',
      icon: <FiBook />
    },
    'auto_correct': { 
      display: 'Auto Correct', 
      color: '#10b981', 
      bgColor: '#d1fae5',
      icon: <FiCheckCircle />
    },
    'chatbot_query': { 
      display: 'Chatbot', 
      color: '#f59e0b', 
      bgColor: '#fef3c7',
      icon: <FiMessageSquare />
    },
    'fetch_homework_submissions': { 
      display: 'Homework View', 
      color: '#06b6d4', 
      bgColor: '#cffafe',
      icon: <FiEye />
    },
    'submit_homework': { 
      display: 'Homework Submission', 
      color: '#ef4444', 
      bgColor: '#fee2e2',
      icon: <FiCheckCircle />
    },
    'view_classwork': { 
      display: 'Classwork View', 
      color: '#84cc16', 
      bgColor: '#ecfccb',
      icon: <FiEye />
    }
  };

  // Action to category mapping for metrics
  const ACTION_CATEGORY_MAPPING = {
    'fetch_homework_submissions': 'homework_view',
    'auto_homework_submission': 'homework_submit',
    'submit_homework': 'homework_submit',
    'view_classwork_submissions': 'classwork_view',
    'submit_classwork': 'classwork_submit',
    'chatbot_query': 'chatbot',
    'dummy': 'chatbot',
    'concepts_required': 'concepts',
    'solve': 'solve',
    'auto_correct': 'auto_score'
  };

  // Load daily rollups data on component mount
  useEffect(() => {
    if (apiHealthy) {
      loadDailyRollups();
    }
  }, [apiHealthy]);

  const loadDailyRollups = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getDailyRollups();
      setDailyRollups(data);
    } catch (error) {
      console.error('Failed to load daily rollups:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get the API key for current filter selection
  const getApiKeyForFilters = () => {
    const { block, class: className, section } = filters;
    
    // Find matching API key based on current filters
    for (const [apiKey, mapping] of Object.entries(API_TO_DISPLAY_MAPPING)) {
      if (mapping.block === block && 
          mapping.class === className && 
          mapping.section === section) {
        return apiKey;
      }
    }
    return null;
  };

  // Get dynamic options based on selection
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

  // Load students based on filters
  useEffect(() => {
    if (filters.section && dailyRollups) {
      loadStudents();
    }
  }, [filters.section, dailyRollups, listDateFilter, listDateRange]);

  const loadStudents = () => {
    try {
      setLoading(true);
      
      // Get the API key for current selection
      const apiKey = getApiKeyForFilters();
      if (!apiKey) {
        setStudents([]);
        return;
      }

      // Get the target date(s) based on filter
      let targetDates = [];
      if (listDateFilter === 'today') {
        targetDates = [new Date().toISOString().split('T')[0]];
      } else if (listDateFilter === 'range') {
        // Get all dates in the range
        const start = new Date(listDateRange.from);
        const end = new Date(listDateRange.to);
        while (start <= end) {
          targetDates.push(start.toISOString().split('T')[0]);
          start.setDate(start.getDate() + 1);
        }
      }

      // Aggregate students from all target dates
      const aggregatedStudents = {};
      
      for (const date of targetDates) {
        const classData = dailyRollups[date]?.[apiKey];
        if (classData && classData.students) {
          Object.entries(classData.students).forEach(([studentId, studentData]) => {
            if (!aggregatedStudents[studentId]) {
              aggregatedStudents[studentId] = {
                id: studentId,
                name: `Student ${studentId}`,
                actions: {},
                firstActive: studentData.first_event_ist,
                lastActive: studentData.last_event_ist,
                dates: []
              };
            }
            
            // Aggregate actions
            Object.entries(studentData.actions || {}).forEach(([action, count]) => {
              aggregatedStudents[studentId].actions[action] = 
                (aggregatedStudents[studentId].actions[action] || 0) + count;
            });
            
            // Update first and last active times
            if (studentData.first_event_ist < aggregatedStudents[studentId].firstActive) {
              aggregatedStudents[studentId].firstActive = studentData.first_event_ist;
            }
            if (studentData.last_event_ist > aggregatedStudents[studentId].lastActive) {
              aggregatedStudents[studentId].lastActive = studentData.last_event_ist;
            }
            
            aggregatedStudents[studentId].dates.push(date);
          });
        }
      }

      // Transform to array and calculate totals
      const studentList = Object.values(aggregatedStudents).map(student => {
        const totalActions = Object.values(student.actions)
          .reduce((sum, count) => sum + count, 0);
        
        return {
          ...student,
          status: totalActions > 0 ? 'active' : 'inactive',
          activityCount: totalActions
        };
      });
      
      // Sort by activity count
      studentList.sort((a, b) => b.activityCount - a.activityCount);
      setStudents(studentList);
    } catch (error) {
      console.error('Failed to load students:', error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStudentDetails = async (studentId) => {
    try {
      setLoading(true);
      
      // Get the API key for current selection
      const apiKey = getApiKeyForFilters();
      if (!apiKey || !dailyRollups) {
        return;
      }

      // Get the latest date or selected date
      const targetDate = dateFilter === 'today' 
        ? new Date().toISOString().split('T')[0]
        : customDateRange.from;

      // Try to get data for the target date, or fall back to latest
      const dates = Object.keys(dailyRollups).sort().reverse();
      const dataDate = dailyRollups[targetDate] ? targetDate : dates[0];
      
      const classData = dailyRollups[dataDate]?.[apiKey];
      const studentData = classData?.students?.[studentId];
      
      if (!studentData) {
        setStudentDetails(null);
        return;
      }

      // Calculate total active time from first to last event in MINUTES
      let totalActiveTime = 0;
      if (studentData.first_event_ist && studentData.last_event_ist) {
        // Parse the timestamps correctly
        const firstTime = new Date(studentData.first_event_ist);
        const lastTime = new Date(studentData.last_event_ist);
        
        // Calculate difference in milliseconds and convert to minutes
        const diffMs = lastTime.getTime() - firstTime.getTime();
        totalActiveTime = Math.floor(diffMs / (1000 * 60)); // Convert to minutes
        
        // Ensure it's not negative
        if (totalActiveTime < 0) totalActiveTime = 0;
      }

      // Build activity timeline from actions
      const activities = [];
      const activityCounts = studentData.actions || {};
      
      // Calculate question breakdown based on action types
      const questionsBreakdown = {
        homework: 0,
        classwork: 0,
        autoScore: 0,
        chatbot: 0,
        concepts: 0
      };

      // Map actions to categories
      Object.entries(activityCounts).forEach(([actionType, count]) => {
        // Map to question categories
        if (actionType === 'fetch_homework_submissions' || 
            actionType === 'auto_homework_submission' ||
            actionType === 'submit_homework') {
          questionsBreakdown.homework += count;
        }
        if (actionType === 'view_classwork_submissions' || 
            actionType === 'submit_classwork') {
          questionsBreakdown.classwork += count;
        }
        if (actionType === 'auto_correct') {
          questionsBreakdown.autoScore += count;
        }
        if (actionType === 'chatbot_query' || actionType === 'dummy') {
          questionsBreakdown.chatbot += count;
        }
        if (actionType === 'concepts_required') {
          questionsBreakdown.concepts += count;
        }

        // Generate timeline entries
        for (let i = 0; i < Math.min(count, 3); i++) { // Limit to 3 per type for display
          const baseTime = new Date(studentData.first_event_ist || Date.now());
          
          // Distribute activities across the active time period
          let activityTime;
          if (totalActiveTime > 0 && studentData.first_event_ist && studentData.last_event_ist) {
            const randomOffset = Math.random() * totalActiveTime * 60000; // Random time within active period
            activityTime = new Date(baseTime.getTime() + randomOffset);
          } else {
            activityTime = baseTime;
          }
          
          activities.push({
            id: `${actionType}_${i}`,
            type: actionType,
            time: activityTime.toISOString(),
            details: `${ACTIVITY_TYPES[actionType]?.display || actionType} activity`,
            duration: Math.floor(Math.random() * 15) + 5 // Random duration 5-20 min
          });
        }
      });
      
      // Sort activities by time
      activities.sort((a, b) => new Date(a.time) - new Date(b.time));
      
      const details = {
        studentId,
        studentName: `Student ${studentId}`,
        school: filters.school,
        block: filters.block,
        class: filters.class,
        section: filters.section,
        totalActiveTime, // Now in minutes
        questionsSolved: Object.values(questionsBreakdown).reduce((a, b) => a + b, 0),
        questionsBreakdown,
        activities: activities.slice(0, 20), // Limit to 20 most recent
        activityCounts,
        performanceScore: Math.min(95, 70 + (Object.keys(activityCounts).length * 5)), // Basic scoring
        firstEventTime: studentData.first_event_ist,
        lastEventTime: studentData.last_event_ist
      };
      
      setStudentDetails(details);
      setSelectedStudent(studentId);
    } catch (error) {
      console.error('Failed to load student details:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
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
    setSelectedStudent(null);
    setStudentDetails(null);
  };

  const handleDateFilterChange = (filterType) => {
    setDateFilter(filterType);
    if (selectedStudent) {
      loadStudentDetails(selectedStudent);
    }
  };

  // Render student list view
  const renderStudentList = () => (
    <div className="student-list-container">
      <div className="list-header">
        <div className="list-title-section">
          <h3>Students in {filters.block} - {filters.class} {filters.section}</h3>
          <div className="list-summary">
            <span className="summary-item">
              <FiUsers /> Total: {students.length}
            </span>
            <span className="summary-item active">
              <FiActivity /> Active: {students.filter(s => s.status === 'active').length}
            </span>
          </div>
        </div>
        
        {/* Date Filter for List */}
        <div className="list-date-filter">
          <button 
            className={`date-filter-btn ${listDateFilter === 'today' ? 'active' : ''}`}
            onClick={() => {
              setListDateFilter('today');
              setListDateRange({
                from: new Date().toISOString().split('T')[0],
                to: new Date().toISOString().split('T')[0]
              });
            }}
          >
            Today
          </button>
          <button 
            className={`date-filter-btn ${listDateFilter === 'range' ? 'active' : ''}`}
            onClick={() => setListDateFilter('range')}
          >
            Date Range
          </button>
          
          {listDateFilter === 'range' && (
            <div className="date-range-inputs">
              <input 
                type="date" 
                value={listDateRange.from}
                onChange={(e) => {
                  setListDateRange({...listDateRange, from: e.target.value});
                }}
              />
              <span>to</span>
              <input 
                type="date" 
                value={listDateRange.to}
                onChange={(e) => {
                  setListDateRange({...listDateRange, to: e.target.value});
                }}
              />
            </div>
          )}
        </div>
      </div>

      {students.length === 0 ? (
        <div className="no-students-message">
          <FiUsers />
          <p>No students found for the selected date range</p>
        </div>
      ) : (
        <div className="students-grid">
          {students.map(student => (
            <div key={student.id} className={`student-card ${student.status}`}>
              <div className="student-card-header">
                <div className="student-avatar">
                  <FiUser />
                </div>
                <div className="student-info">
                  <h4>{student.id}</h4>
                  <p className="student-name">{student.name}</p>
                </div>
                <span className={`status-badge ${student.status}`}>
                  {student.status}
                </span>
              </div>
              
              <div className="student-card-stats">
                <div className="stat-item">
                  <FiActivity />
                  <span>{student.activityCount} activities</span>
                </div>
                <div className="stat-item">
                  <FiClock />
                  <span>{formatDate(student.lastActive)}</span>
                </div>
              </div>

              {/* Show action breakdown */}
              <div className="student-card-actions">
                {Object.entries(student.actions).slice(0, 3).map(([action, count]) => (
                  <span 
                    key={action}
                    className="action-chip"
                    style={{ 
                      backgroundColor: ACTIVITY_TYPES[action]?.bgColor || '#f1f5f9',
                      color: ACTIVITY_TYPES[action]?.color || '#64748b'
                    }}
                  >
                    {ACTIVITY_TYPES[action]?.display || action}: {count}
                  </span>
                ))}
              </div>

              <button 
                className="view-details-btn"
                onClick={() => loadStudentDetails(student.id)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Render student details view
  const renderStudentDetails = () => {
    if (!studentDetails) return null;

    return (
      <div className="student-details-container">
        {/* Header */}
        <div className="details-header">
          <button className="back-button" onClick={handleBackToList}>
            <FiChevronLeft /> Back to List
          </button>
          
          <div className="student-profile">
            <div className="profile-avatar">
              <FiUser />
            </div>
            <div className="profile-info">
              <h2>{studentDetails.studentId}</h2>
              <p>{studentDetails.school} • {studentDetails.block} • {studentDetails.class} {studentDetails.section}</p>
            </div>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="activity-section">
          <h3>
            <FiActivity /> App Usage Timeline
          </h3>
          
          <div className="timeline-container">
            {studentDetails.activities.length > 0 ? (
              studentDetails.activities.map(activity => (
                <div key={activity.id} className="timeline-item">
                  <div className="timeline-time">
                    {formatDateTime(activity.time)}
                  </div>
                  <div className="timeline-marker">
                    <div className="marker-dot"></div>
                    <div className="marker-line"></div>
                  </div>
                  <div className="timeline-content">
                    <span 
                      className="activity-badge"
                      style={{
                        backgroundColor: ACTIVITY_TYPES[activity.type]?.bgColor || '#f1f5f9',
                        color: ACTIVITY_TYPES[activity.type]?.color || '#64748b'
                      }}
                    >
                      {ACTIVITY_TYPES[activity.type]?.icon}
                      {ACTIVITY_TYPES[activity.type]?.display || activity.type}
                    </span>
                    <span className="activity-duration">{activity.duration} min</span>
                    <p className="activity-details">{activity.details}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-activities">
                <p>No activities recorded for this student</p>
              </div>
            )}
          </div>
        </div>

        {/* Activity Breakdown Chart */}
        <div className="chart-section">
          <h3>
            <FiBarChart2 /> Activity Breakdown (API Requests)
          </h3>
          
          <div className="bar-chart">
            {Object.entries(ACTIVITY_TYPES).map(([key, config]) => {
              const count = studentDetails.activityCounts[key] || 0;
              const maxCount = Math.max(...Object.values(studentDetails.activityCounts), 1);
              const percentage = (count / maxCount) * 100;
              
              return (
                <div key={key} className="chart-bar-container">
                  <div className="chart-bar-wrapper">
                    <div 
                      className="chart-bar"
                      style={{
                        height: `${percentage}%`,
                        backgroundColor: config.color
                      }}
                    >
                      <span className="bar-value">{count}</span>
                    </div>
                  </div>
                  <div className="chart-label">{config.display}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="student-activity-container">
      <div className="activity-header">
        <h2>
          <FiActivity /> Student Activity Details
        </h2>
      </div>

      {!selectedStudent && (
        <div className="filter-section">
          <div className="filter-row">
            {/* School Filter */}
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

            {/* Block Filter */}
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

            {/* Class Filter */}
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

            {/* Section Filter */}
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

          {filters.section && (
            <div className="filter-summary">
              <FiFilter />
              <span>
                Showing students from: {filters.school} → {filters.block} → {filters.class} {filters.section}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="activity-content">
        {loading ? (
          <LoadingSpinner text="Loading student data..." />
        ) : selectedStudent ? (
          renderStudentDetails()
        ) : filters.section ? (
          renderStudentList()
        ) : (
          <div className="empty-state">
            <FiFilter />
            <h3>Select Filters to View Students</h3>
            <p>Choose School, Block, Class, and Section to see student activity data</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentActivity;