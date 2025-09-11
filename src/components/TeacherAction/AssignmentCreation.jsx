// AssignmentCreation.jsx
import React from 'react';

const AssignmentCreation = ({ assignments }) => {
  return (
    <div className="assignment-section">
      <div className="section-header">
        <h3 className="section-title">
          <span className="section-icon">📝</span>
          Assignment Creation Activity
        </h3>
      </div>
      
      <div className="assignment-list">
        {assignments.map((assignment, index) => (
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
  );
};

export default AssignmentCreation;