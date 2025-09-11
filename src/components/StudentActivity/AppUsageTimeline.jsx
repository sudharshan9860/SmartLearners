// AppUsageTimeline.jsx
import React from 'react';

const AppUsageTimeline = ({ timeline }) => {
  return (
    <div className="timeline-section">
      <div className="section-header">
        <h3 className="section-title">
          <span className="section-icon">⏱️</span>
          App Usage Timeline
        </h3>
      </div>
      
      <div className="timeline">
        {timeline.map((event, index) => (
          <div 
            key={index} 
            className="timeline-item"
            style={{ '--delay': `${index * 0.1}s` }}
          >
            <div className="timeline-time">{event.time}</div>
            <div className="timeline-marker" style={{ backgroundColor: event.color }}></div>
            <div className="timeline-content">
              <h4 className="timeline-title">{event.activity}</h4>
              <p className="timeline-details">{event.details}</p>
              <span 
                className="timeline-tag"
                style={{ backgroundColor: `${event.color}20`, color: event.color }}
              >
                {event.tag}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppUsageTimeline;

