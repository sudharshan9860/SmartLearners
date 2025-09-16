// ===== UPDATED TEACHER ACTION COMPONENT =====
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
  FiEdit3
} from 'react-icons/fi';
import ApiService from '../../services/apiService';
import DataTransformer from '../../utils/dataTransformer';
import FilterBar from '../common/FilterBar';

const TeacherAction = ({ filters, apiHealthy }) => {
  const [loading, setLoading] = useState(false);
  const [teacherData, setTeacherData] = useState(null);
  const [selectedClass, setSelectedClass] = useState('Minds_9th');
  const [error, setError] = useState(null);
  
useEffect(() => {
    if (apiHealthy) {
      loadTeacherData();
    } else {
      setTeacherData(null);
      setError('Backend not healthy (check /health). Skipping heavy calls.');
    }
  }, [selectedClass, filters, apiHealthy]);

  useEffect(() => {
    loadTeacherData();
  }, [selectedClass, filters]);

  const loadTeacherData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const schoolLogs = await ApiService.getSchoolLogs();
      const transformedData = DataTransformer.transformTeacherData(schoolLogs, selectedClass);
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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading teacher data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">Error: {error}</p>
        <button onClick={loadTeacherData} className="retry-btn">Retry</button>
      </div>
    );
  }

  if (!teacherData) {
    return (
      <div className="teacher-action-container">
        <div className="selection-prompt">
          <div className="prompt-icon">
            <FiUsers className="icon-large" />
          </div>
          <h2>Select a Class to View Teacher Details</h2>
          <p>Please select a class from the filter above</p>
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-action-container">
      {/* Header Section */}
      <div className="teacher-header">
        <h2>Teacher Action Details</h2>
        <div className="class-selector">
          <select 
            value={selectedClass} 
            onChange={(e) => handleClassChange(e.target.value)}
            className="filter-select"
          >
            {Object.entries(DataTransformer.CLASS_MAPPING).map(([key, value]) => (
              <option key={key} value={key}>{value.display}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Teacher Info Card */}
      <div className="teacher-info-card">
        <div className="teacher-avatar">
          <FiUsers />
        </div>
        <div className="teacher-details">
          <h3>{teacherData.teachers.length > 0 ? teacherData.teachers[0] : 'No Teacher Assigned'}</h3>
          <p className="teacher-class">{teacherData.className}</p>
          <div className="teacher-stats">
            <span className="stat">
              <FiUsers /> {teacherData.totalStudents} Active / {teacherData.expectedStudents} Expected Students
            </span>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="metrics-grid">
        {/* Homework Statistics */}
        <div className="metric-card homework-card">
          <div className="metric-header">
            <h3>
              <FiFileText /> Homework Assignments
            </h3>
          </div>
          <div className="metric-content">
            <div className="metric-row">
              <span className="metric-label">Created</span>
              <span className="metric-value">{teacherData.homeworkStats.created}</span>
            </div>
            <div className="metric-row">
              <span className="metric-label">Submitted</span>
              <span className="metric-value success">{teacherData.homeworkStats.submitted}</span>
            </div>
            <div className="metric-row">
              <span className="metric-label">Pending</span>
              <span className="metric-value warning">{teacherData.homeworkStats.pending}</span>
            </div>
            
            {/* Submission Progress Bar */}
            <div className="submission-progress">
              <div className="progress-header">
                <span>Completion Rate</span>
                <span className="progress-percentage">{teacherData.homeworkStats.completionRate}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${teacherData.homeworkStats.completionRate}%`,
                    background: parseFloat(teacherData.homeworkStats.completionRate) > 80 ? '#10b981' : 
                              parseFloat(teacherData.homeworkStats.completionRate) > 50 ? '#f59e0b' : '#ef4444'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Worksheet Statistics */}
        <div className="metric-card worksheet-card">
          <div className="metric-header">
            <h3>
              <FiEdit3 /> Worksheets Created
            </h3>
          </div>
          <div className="metric-content centered">
            <div className="big-number">
              {teacherData.worksheetStats.total}
            </div>
            <p className="metric-subtitle">Total Worksheets</p>
            <div className="metric-row">
              <span className="metric-label">This Week</span>
              <span className="metric-value">{teacherData.worksheetStats.thisWeek}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities Timeline */}
      <div className="activities-section">
        <h3 className="section-title">
          <FiClock /> Recent Teacher Activities
        </h3>
        <div className="activities-timeline">
          {teacherData.activities.length === 0 ? (
            <div className="no-activities">
              <p>No recent activities</p>
            </div>
          ) : (
            teacherData.activities.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">{activity.icon}</div>
                <div className="activity-content">
                  <div className="activity-header">
                    <h4>{activity.action}</h4>
                    <span className={`activity-status ${activity.status}`}>
                      {activity.status === 'success' ? <FiCheckCircle /> : null}
                    </span>
                  </div>
                  <div className="activity-meta">
                    <span className="activity-teacher">{activity.teacher}</span>
                    <span className="activity-time">
                      {new Date(activity.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Feature Usage Analysis */}
      <div className="features-section">
        <h3 className="section-title">
          <FiTrendingUp /> Most Used Features
        </h3>
        <div className="features-list">
          {teacherData.mostUsedFeatures.length === 0 ? (
            <div className="no-features">
              <p>No feature usage data available</p>
            </div>
          ) : (
            teacherData.mostUsedFeatures.map((feature, index) => (
              <div key={index} className="feature-item">
                <div className="feature-info">
                  <span className="feature-rank">#{index + 1}</span>
                  <span className="feature-name">{feature.name}</span>
                  <span className="feature-count">{feature.count} uses</span>
                </div>
                <div className="feature-bar">
                  <div 
                    className="feature-fill"
                    style={{ 
                      width: `${feature.percentage}%`,
                      background: index < 3 ? 
                        'linear-gradient(90deg, #8b5cf6 0%, #a78bfa 100%)' : 
                        'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)'
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Student Activity Summary */}
      <div className="students-summary">
        <h3 className="section-title">
          <FiActivity /> Class Activity Overview
        </h3>
        <div className="summary-cards">
          <div className="summary-card">
            <span className="summary-label">Active Students</span>
            <span className="summary-value">{teacherData.totalStudents}</span>
          </div>
          <div className="summary-card">
            <span className="summary-label">Expected Students</span>
            <span className="summary-value">{teacherData.expectedStudents}</span>
          </div>
          <div className="summary-card">
            <span className="summary-label">Participation Rate</span>
            <span className="summary-value">
              {((teacherData.totalStudents / teacherData.expectedStudents) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherAction;