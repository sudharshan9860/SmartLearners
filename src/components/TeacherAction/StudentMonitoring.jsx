// StudentMonitoring.jsx
import React from 'react';

const StudentMonitoring = ({ monitoringData }) => {
  return (
    <div className="monitoring-section">
      <div className="section-header">
        <h3 className="section-title">
          <span className="section-icon">👥</span>
          Student Monitoring Activity
        </h3>
      </div>
      
      <div className="monitoring-list">
        {monitoringData.map((activity, index) => (
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
  );
};

export default StudentMonitoring;