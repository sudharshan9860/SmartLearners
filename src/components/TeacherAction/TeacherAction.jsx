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
  FiGrid
} from 'react-icons/fi';
import ApiService from '../../services/apiService';
import DataTransformer from '../../utils/dataTransformer';

const TeacherAction = ({ filters, apiHealthy }) => {
  const [loading, setLoading] = useState(false);
  const [teacherData, setTeacherData] = useState(null);
  const [selectedClass, setSelectedClass] = useState('Minds_9th');
  const [error, setError] = useState(null);
  const [activeActivityTab, setActiveActivityTab] = useState('chatbot');
  const [schoolLogs, setSchoolLogs] = useState(null);
  
  useEffect(() => {
    if (apiHealthy) {
      loadTeacherData();
    } else {
      setTeacherData(null);
      setError('Backend not healthy. Skipping API calls.');
    }
  }, [selectedClass, apiHealthy]);

  const loadTeacherData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const logs = await ApiService.getSchoolLogs();
      setSchoolLogs(logs);
      
      const transformedData = DataTransformer.transformTeacherData(logs, selectedClass);
      
      // Calculate actual active students for this specific class
      const classData = logs[selectedClass];
      const actualActiveStudents = classData?.students ? Object.keys(classData.students).length : 0;
      
      // Update the transformed data with correct active student count
      transformedData.totalStudents = actualActiveStudents;
      
      setTeacherData(transformedData);
    } catch (err) {
      console.error('Failed to load teacher data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClassChange = (newClass) => {
    setSelectedClass(newClass);
  };

  // Group activities by type
  const groupActivitiesByType = () => {
    if (!teacherData?.activities) return {};
    
    const grouped = {
      chatbot: [],
      homework: [],
      worksheets: [],
      submissions: []
    };
    
    teacherData.activities.forEach(activity => {
      if (activity.action.includes('Chatbot')) {
        grouped.chatbot.push(activity);
      } else if (activity.action.includes('Homework')) {
        grouped.homework.push(activity);
      } else if (activity.action.includes('Worksheet')) {
        grouped.worksheets.push(activity);
      } else if (activity.action.includes('Submission')) {
        grouped.submissions.push(activity);
      }
    });
    
    return grouped;
  };

  if (loading) {
    return (
      <div className="loading-container-enhanced">
        <div className="loading-card">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading teacher data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container-enhanced">
        <div className="error-card">
          <p className="error-message">Error: {error}</p>
          <button onClick={loadTeacherData} className="retry-btn">Retry</button>
        </div>
      </div>
    );
  }

  if (!teacherData) {
    return (
      <div className="teacher-action-container">
        <div className="selection-prompt">
          <FiUsers className="prompt-icon" />
          <h2>Select a Class to View Teacher Details</h2>
          <p>Please select a class to begin</p>
        </div>
      </div>
    );
  }

  const groupedActivities = groupActivitiesByType();

  return (
    <div className="teacher-action-container">
      {/* Enhanced Header */}
      <div className="teacher-header-enhanced">
        <div className="header-content">
          <h2 className="page-title">
            <FiUsers className="title-icon" />
            Teacher Action Details
          </h2>
          <div className="class-selector-wrapper">
            <label className="selector-label">Select Class</label>
            <select 
              value={selectedClass} 
              onChange={(e) => handleClassChange(e.target.value)}
              className="class-select-styled"
            >
              {Object.entries(DataTransformer.CLASS_MAPPING).map(([key, value]) => (
                <option key={key} value={key}>{value.display}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Teacher Info Card */}
      <div className="teacher-info-card-enhanced">
        <div className="teacher-profile">
          <div className="teacher-avatar-large">
            <FiUsers />
          </div>
          <div className="teacher-details">
            <h3 className="teacher-name">
              {teacherData.teachers.length > 0 ? teacherData.teachers[0] : 'No Teacher Assigned'}
            </h3>
            <p className="teacher-class">{teacherData.className}</p>
            <div className="teacher-stats">
              <div className="stat">
                <FiUsers className="stat-icon" />
                <span className="stat-value">{teacherData.totalStudents}</span>
                <span className="stat-label">Active Students</span>
              </div>
              <div className="stat">
                <FiBook className="stat-icon" />
                <span className="stat-value">{teacherData.expectedStudents}</span>
                <span className="stat-label">Expected Students</span>
              </div>
              <div className="stat">
                <FiActivity className="stat-icon" />
                <span className="stat-value">
                  {((teacherData.totalStudents / teacherData.expectedStudents) * 100).toFixed(0)}%
                </span>
                <span className="stat-label">Participation</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Homework & Worksheets Stats */}
      <div className="stats-grid">
        <div className="stat-card homework-card">
          <div className="stat-card-header">
            <FiFileText className="stat-card-icon" />
            <h3>Homework Assignments</h3>
          </div>
          <div className="stat-card-content">
            <div className="stat-row">
              <span className="stat-label">Created</span>
              <span className="stat-value-large">{teacherData.homeworkStats.created}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Submitted</span>
              <span className="stat-value-large">{teacherData.homeworkStats.submitted}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Pending</span>
              <span className="stat-value-large pending">{teacherData.homeworkStats.pending}</span>
            </div>
            <div className="completion-bar">
              <div className="completion-label">
                Completion Rate: {teacherData.homeworkStats.completionRate}%
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${teacherData.homeworkStats.completionRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="stat-card worksheets-card">
          <div className="stat-card-header">
            <FiEdit3 className="stat-card-icon" />
            <h3>Worksheets Created</h3>
          </div>
          <div className="stat-card-content">
            <div className="stat-row">
              <span className="stat-label">Total Worksheets</span>
              <span className="stat-value-large">{teacherData.worksheetStats.total}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">This Week</span>
              <span className="stat-value-large">{teacherData.worksheetStats.thisWeek}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Teacher Activities - Tabbed View */}
      <div className="activities-section">
        <h3 className="section-title">
          <FiClock className="section-icon" />
          Recent Teacher Activities
        </h3>
        
        <div className="activity-tabs">
          <button 
            className={`tab-btn ${activeActivityTab === 'chatbot' ? 'active' : ''}`}
            onClick={() => setActiveActivityTab('chatbot')}
          >
            <FiDatabase /> Chatbot Data ({groupedActivities.chatbot?.length || 0})
          </button>
          <button 
            className={`tab-btn ${activeActivityTab === 'homework' ? 'active' : ''}`}
            onClick={() => setActiveActivityTab('homework')}
          >
            <FiFileText /> Homework ({groupedActivities.homework?.length || 0})
          </button>
          <button 
            className={`tab-btn ${activeActivityTab === 'worksheets' ? 'active' : ''}`}
            onClick={() => setActiveActivityTab('worksheets')}
          >
            <FiEdit3 /> Worksheets ({groupedActivities.worksheets?.length || 0})
          </button>
          <button 
            className={`tab-btn ${activeActivityTab === 'submissions' ? 'active' : ''}`}
            onClick={() => setActiveActivityTab('submissions')}
          >
            <FiEye /> Submissions ({groupedActivities.submissions?.length || 0})
          </button>
        </div>
        
        <div className="activity-content">
          {groupedActivities[activeActivityTab]?.length > 0 ? (
            <div className="activity-list">
              {groupedActivities[activeActivityTab].map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">{activity.icon}</div>
                  <div className="activity-details">
                    <h4 className="activity-title">{activity.action}</h4>
                    <p className="activity-meta">
                      {activity.teacher} • {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className={`activity-status ${activity.status}`}>
                    {activity.status === 'success' ? <FiCheckCircle /> : '⚠️'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-activities">
              <p>No activities in this category</p>
            </div>
          )}
        </div>
      </div>

      {/* Most Used Features */}
      <div className="features-section">
        <h3 className="section-title">
          <FiTrendingUp className="section-icon" />
          Most Used Features
        </h3>
        <div className="features-grid">
          {teacherData.mostUsedFeatures.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-header">
                <span className="feature-rank">#{index + 1}</span>
                <span className="feature-count">{feature.count} uses</span>
              </div>
              <h4 className="feature-name">{feature.name}</h4>
              <div className="feature-progress">
                <div 
                  className="feature-progress-fill"
                  style={{ width: `${feature.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Class Activity Overview */}
      <div className="class-overview-section">
        <h3 className="section-title">
          <FiGrid className="section-icon" />
          Class Activity Overview
        </h3>
        <div className="overview-cards">
          <div className="overview-card">
            <h4>Active Students</h4>
            <p className="overview-value">{teacherData.totalStudents}</p>
          </div>
          <div className="overview-card">
            <h4>Expected Students</h4>
            <p className="overview-value">{teacherData.expectedStudents}</p>
          </div>
          <div className="overview-card">
            <h4>Participation Rate</h4>
            <p className="overview-value">
              {((teacherData.totalStudents / teacherData.expectedStudents) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherAction;