import React, { useState, useEffect } from 'react';
import './StudentActivity.css';
import { 
  FiArrowLeft, 
  FiClock, 
  FiActivity,
  FiUser,
  FiCalendar,
  FiChevronRight
} from 'react-icons/fi';
import ApiService from '../../services/apiService';
import DataTransformer from '../../utils/dataTransformer';

const StudentActivity = ({ filters }) => {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [selectedClass, setSelectedClass] = useState('Minds_9th');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadClassStudents();
  }, [selectedClass, selectedDate]);

  const loadClassStudents = async () => {
    try {
      setLoading(true);
      const rollups = await ApiService.getDailyRollups();
      const classData = rollups[selectedDate]?.[selectedClass];
      
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
      const activityData = await ApiService.getStudentActivity(username, selectedDate);
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
      {/* Header */}
      <div className="activity-header">
        <h2>Student Activity Details</h2>
        <div className="header-filters">
          <select 
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
            className="filter-select"
          >
            {Object.entries(DataTransformer.CLASS_MAPPING).map(([key, value]) => (
              <option key={key} value={key}>{value.display}</option>
            ))}
          </select>
          
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-input"
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading data...</p>
        </div>
      )}

      {!loading && !selectedStudent && (
        <div className="students-grid">
          {students.length === 0 ? (
            <div className="no-data-message">
              <p>No student activity found for {selectedDate}</p>
            </div>
          ) : (
            students.map((student) => (
              <div 
                key={student.username}
                className="student-card"
                onClick={() => loadStudentDetails(student.username)}
              >
                <div className="student-avatar">
                  <FiUser />
                </div>
                <h3>{student.displayName}</h3>
                <p className="student-username">{student.username}</p>
                
                <div className="student-stats">
                  <div className="stat">
                    <FiActivity className="stat-icon" />
                    <span>{student.actionCount} actions</span>
                  </div>
                  {student.lastActive && (
                    <div className="stat">
                      <FiClock className="stat-icon" />
                      <span>{new Date(student.lastActive).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </div>
                  )}
                </div>
                
                <button className="view-details-btn">
                  View Details <FiChevronRight />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {!loading && selectedStudent && studentDetails && (
        <div className="student-details">
          <button onClick={handleBackToList} className="back-button">
            <FiArrowLeft /> Back to Students
          </button>

          <div className="details-header">
            <div className="student-info">
              <div className="student-avatar-large">
                <FiUser />
              </div>
              <div>
                <h2>{studentDetails.displayName}</h2>
                <p className="student-meta">
                  {studentDetails.username} • {studentDetails.className}
                </p>
              </div>
            </div>

            <div className="summary-stats">
              <div className="stat-card">
                <span className="stat-label">Total Actions</span>
                <span className="stat-value">{studentDetails.totalActions}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Time Active</span>
                <span className="stat-value">{studentDetails.timeSpent}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Status</span>
                <span className={`status-badge ${studentDetails.status}`}>
                  {studentDetails.status}
                </span>
              </div>
            </div>
          </div>

          {/* Actions Breakdown */}
          <div className="actions-section">
            <h3>Activity Breakdown</h3>
            <div className="actions-grid">
              {Object.entries(studentDetails.actions).map(([action, count]) => (
                <div key={action} className="action-card">
                  <span className="action-name">{action}</span>
                  <span className="action-count">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="timeline-section">
            <h3>Activity Timeline</h3>
            <div className="timeline">
              {studentDetails.timeline.length === 0 ? (
                <p className="no-timeline">No activities recorded</p>
              ) : (
                studentDetails.timeline.map((event, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-icon">{event.icon}</div>
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <span className="timeline-action">{event.action}</span>
                        <span className="timeline-time">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      {event.details && Object.keys(event.details).length > 0 && (
                        <div className="timeline-details">
                          {Object.entries(event.details).map(([key, value]) => (
                            <span key={key} className="detail-item">
                              {key}: {value}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentActivity;