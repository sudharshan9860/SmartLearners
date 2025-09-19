import React, { useState, useEffect } from 'react';
import './StudentActivity.css';
import { 
  FiArrowLeft, 
  FiClock, 
  FiActivity,
  FiUser,
  FiCalendar,
  FiChevronRight,
  FiLayers,
  FiTrendingUp
} from 'react-icons/fi';
import ApiService from '../../services/apiService';
import DataTransformer from '../../utils/dataTransformer';

const StudentActivity = ({ filters, apiHealthy }) => {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [selectedClass, setSelectedClass] = useState('Minds_9th');
  const [dateRange, setDateRange] = useState('today');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  useEffect(() => {
    if (apiHealthy) {
      loadClassStudents();
    } else {
      setStudents([]);
    }
  }, [selectedClass, dateRange, customStartDate, customEndDate, apiHealthy]);

  const getDateForQuery = () => {
    const today = new Date();
    
    switch(dateRange) {
      case 'today':
        return today.toISOString().split('T')[0];
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toISOString().split('T')[0];
      case 'lastWeek':
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);
        return lastWeek.toISOString().split('T')[0];
      case 'custom':
        return customStartDate; // For custom range, use start date
      default:
        return today.toISOString().split('T')[0];
    }
  };

  const loadClassStudents = async () => {
    try {
      setLoading(true);
      const queryDate = getDateForQuery();
      const rollups = await ApiService.getDailyRollups();
      const classData = rollups[queryDate]?.[selectedClass];
      
      if (classData?.students) {
        const studentList = Object.keys(classData.students).map(username => {
          const studentData = classData.students[username];
          const actionCount = Object.values(studentData.actions || {})
            .reduce((sum, count) => sum + count, 0);
          
          return {
            username,
            displayName: `Student ${username}`,
            actionCount,
            lastActive: studentData.last_event_ist,
            firstActive: studentData.first_event_ist,
            actions: studentData.actions || {}
          };
        });
        
        setStudents(studentList.sort((a, b) => b.actionCount - a.actionCount));
      } else {
        setStudents([]);
      }
    } catch (error) {
      console.error('Failed to load students:', error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStudentDetails = async (username) => {
    try {
      setLoading(true);
      const queryDate = getDateForQuery();
      const activityData = await ApiService.getStudentActivity(username, queryDate);
      const transformedData = DataTransformer.transformStudentActivity(
        activityData,
        DataTransformer.CLASS_MAPPING[selectedClass]?.display || selectedClass
      );
      
      setSelectedStudent(username);
      setStudentDetails(transformedData);
    } catch (error) {
      console.error('Failed to load student details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToList = () => {
    setSelectedStudent(null);
    setStudentDetails(null);
  };

  return (
    <div className="student-activity-container">
      {/* Enhanced Header */}
      <div className="activity-header-enhanced">
        <h2 className="activity-title">
          <FiActivity className="title-icon" />
          Student Activity Details
        </h2>
        <div className="header-controls">
          {/* Class Selector */}
          <div className="control-group">
            <label className="control-label">Class</label>
            <select 
              value={selectedClass} 
              onChange={(e) => setSelectedClass(e.target.value)}
              className="styled-select"
            >
              {Object.entries(DataTransformer.CLASS_MAPPING).map(([key, value]) => (
                <option key={key} value={key}>{value.display}</option>
              ))}
            </select>
          </div>
          
          {/* Date Range Selector */}
          <div className="control-group">
            <label className="control-label">Date Range</label>
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="styled-select"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="lastWeek">Last 7 Days</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {/* Custom Date Range Inputs */}
          {dateRange === 'custom' && (
            <div className="date-range-inputs">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="date-input"
                max={new Date().toISOString().split('T')[0]}
              />
              <span className="date-separator">to</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="date-input"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="loading-card">
            <div className="loading-spinner"></div>
            <p className="loading-message">Loading student data...</p>
          </div>
        </div>
      )}

      {!loading && !selectedStudent && (
        <div className="students-grid-enhanced">
          {students.length === 0 ? (
            <div className="no-data-card">
              <FiUser className="no-data-icon" />
              <h3>No Student Activity Found</h3>
              <p>No students have been active for the selected date range</p>
            </div>
          ) : (
            students.map((student) => (
              <div 
                key={student.username}
                className="student-card-enhanced"
                onClick={() => loadStudentDetails(student.username)}
              >
                <div className="student-avatar">
                  <FiUser />
                </div>
                <div className="student-info">
                  <h3 className="student-name">{student.displayName}</h3>
                  <p className="student-username">{student.username}</p>
                </div>
                <div className="student-stats">
                  <div className="stat-item">
                    <FiActivity className="stat-icon" />
                    <span className="stat-value">{student.actionCount}</span>
                    <span className="stat-label">actions</span>
                  </div>
                  <div className="stat-item">
                    <FiClock className="stat-icon" />
                    <span className="stat-value">{student.lastActive || 'N/A'}</span>
                    <span className="stat-label">last active</span>
                  </div>
                </div>
                <button className="view-details-btn">
                  View Details
                  <FiChevronRight />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {!loading && selectedStudent && studentDetails && (
        <div className="student-details-view">
          {/* Back Button */}
          <button onClick={handleBackToList} className="back-button">
            <FiArrowLeft /> Back to Students
          </button>

          {/* Student Header */}
          <div className="student-details-header">
            <div className="student-avatar-large">
              <FiUser />
            </div>
            <div className="student-header-info">
              <h2>{studentDetails.displayName}</h2>
              <p className="student-meta">{studentDetails.username} • {studentDetails.className}</p>
            </div>
          </div>

          {/* Activity Breakdown Section */}
          <div className="activity-breakdown-section">
            <h3 className="section-title">
              <FiLayers className="section-icon" />
              Activity Breakdown
            </h3>
            <div className="activity-cards-grid">
              {Object.entries(studentDetails.actions).map(([action, count]) => (
                <div key={action} className="activity-card">
                  <div className="activity-card-header">
                    <span className="activity-name">{action}</span>
                    <span className="activity-count">{count}</span>
                  </div>
                  <div className="activity-progress">
                    <div 
                      className="activity-progress-fill"
                      style={{ 
                        width: `${(count / studentDetails.totalActions) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Timeline Section */}
          <div className="timeline-section">
            <h3 className="section-title">
              <FiClock className="section-icon" />
              Activity Timeline
            </h3>
            <div className="timeline-container">
              {studentDetails.timeline.map((event, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-time">
                    {new Date(event.timestamp).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </div>
                  <div className="timeline-marker">
                    <span className="timeline-icon">{event.icon}</span>
                  </div>
                  <div className="timeline-content">
                    <h4 className="timeline-action">{event.action}</h4>
                    {event.details && Object.keys(event.details).length > 0 && (
                      <p className="timeline-details">
                        {JSON.stringify(event.details).substring(0, 100)}...
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentActivity;