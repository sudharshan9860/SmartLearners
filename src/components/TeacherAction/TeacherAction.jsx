// TeacherAction.jsx
import React from 'react';
import './TeacherAction.css';
import FilterBar from '../common/FilterBar';
import { teacherActivityData } from '../../data/mockData';
import { FiFileText, FiUsers, FiBarChart, FiMessageSquare, FiTrendingUp, FiAward } from 'react-icons/fi';

const TeacherAction = ({ filters }) => {
  const { teacherInfo, metrics, assignmentCreation, studentMonitoring } = teacherActivityData;

  const metricsCards = [
    {
      icon: <FiFileText />,
      value: metrics.assignmentsCreated,
      label: 'Assignments Created',
      color: '#8b5cf6'
    },
    {
      icon: <FiUsers />,
      value: metrics.classworksGiven,
      label: 'Classworks Given',
      color: '#3b82f6'
    },
    {
      icon: <FiBarChart />,
      value: metrics.studentAnalyticsChecked,
      label: 'Student Analytics Checked',
      color: '#10b981'
    },
    {
      icon: <FiMessageSquare />,
      value: metrics.chatbotInteractions,
      label: 'Chatbot Interactions',
      color: '#f59e0b'
    },
    {
      icon: <FiTrendingUp />,
      value: `${metrics.responseRate}%`,
      label: 'Response Rate',
      color: '#6366f1'
    },
    {
      icon: <FiAward />,
      value: metrics.feedbackGiven,
      label: 'Feedback Given',
      color: '#ec4899'
    }
  ];

  return (
    <div className="teacher-action-container">
      <FilterBar filters={filters} />
      
      <div className="teacher-profile-card">
        <div className="profile-avatar">{teacherInfo.initials}</div>
        <div className="profile-details">
          <h2 className="teacher-name">{teacherInfo.name}</h2>
          <p className="teacher-info">
            {teacherInfo.subject} | {teacherInfo.school} - {teacherInfo.block} | Classes: {teacherInfo.classes.join(', ')}
          </p>
        </div>
      </div>

      <div className="teacher-metrics-grid">
        {metricsCards.map((card, index) => (
          <div 
            key={index}
            className="teacher-metric-card"
            style={{ 
              '--card-color': card.color,
              '--delay': `${index * 0.1}s`
            }}
          >
            <div className="metric-header">
              <div className="metric-icon" style={{ color: card.color }}>
                {card.icon}
              </div>
              <h3 className="metric-value">{card.value}</h3>
            </div>
            <p className="metric-label">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="teacher-activities">
        <div className="assignment-section">
          <div className="section-header">
            <h3 className="section-title">
              <FiFileText className="section-icon" />
              Assignment Creation Activity
            </h3>
          </div>
          
          <div className="assignment-list">
            {assignmentCreation.map((assignment, index) => (
              <div 
                key={index}
                className="assignment-card"
                style={{ '--delay': `${index * 0.1}s` }}
              >
                <div className="assignment-header">
                  <div>
                    <h4 className="assignment-title">{assignment.activity}</h4>
                    <p className="assignment-subject">{assignment.subject}</p>
                  </div>
                  <span className="assignment-time">{assignment.time}</span>
                </div>
                
                <div className="assignment-details">
                  <div className="detail-item">
                    <span className="detail-label">Class:</span>
                    <span className="detail-value">{assignment.class}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Due:</span>
                    <span className="detail-value">{assignment.due}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Questions:</span>
                    <span className="detail-value">{assignment.questions}</span>
                  </div>
                </div>
                
                <div className="assignment-progress">
                  <div className="progress-stats">
                    <span className="submitted">✅ {assignment.students.submitted} Submitted</span>
                    <span className="pending">⏳ {assignment.students.pending} Pending</span>
                    <span className="total">Total: {assignment.students.total}</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${(assignment.students.submitted / assignment.students.total) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="monitoring-section">
          <div className="section-header">
            <h3 className="section-title">
              <FiUsers className="section-icon" />
              Student Monitoring Activity
            </h3>
          </div>
          
          <div className="monitoring-list">
            {studentMonitoring.map((activity, index) => (
              <div 
                key={index}
                className="monitoring-card"
                style={{ '--delay': `${index * 0.15}s` }}
              >
                <div className="monitoring-header">
                  <div className="student-info">
                    <h4>Chatbot Query Response</h4>
                    <p className="student-details">Student: {activity.student}</p>
                  </div>
                  <span className="activity-time">{activity.time}</span>
                </div>
                
                <div className="query-content">
                  <p className="query-text">Query: "{activity.query}"</p>
                  <p className="teacher-action">Teacher Action: {activity.action}</p>
                </div>
                
                <span className={`status-badge ${activity.status.toLowerCase()}`}>
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherAction;