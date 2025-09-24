// src/components/StudentActivity/AppUsageTimeline.jsx
import React from 'react';
import { 
  FiClock, 
  FiMessageSquare, 
  FiEdit3, 
  FiCheckCircle, 
  FiBookOpen, 
  FiFileText,
  FiEye,
  FiTrendingUp,
  FiBarChart2
} from 'react-icons/fi';
import './EnhancedTimeline.css';

const AppUsageTimeline = ({ activities = [] }) => {
  // Sample data if no activities provided
  const timelineData = activities.length > 0 ? activities : [
    {
      time: '12 min',
      timestamp: 'Today',
      type: 'homework',
      title: 'Homework Submission',
      subtitle: 'Math - Quadratic Equations | Score: 94%',
      icon: <FiBookOpen />,
      color: '#10b981',
      badge: 'Homework'
    },
    {
      time: '8 min',
      timestamp: 'Today',
      type: 'autocorrect',
      title: 'Auto Correct',
      subtitle: 'Uploaded solution image for Q3',
      icon: <FiCheckCircle />,
      color: '#f59e0b',
      badge: 'Autocorrect'
    },
    {
      time: '15 min',
      timestamp: 'Today',
      type: 'solve',
      title: 'Solve',
      subtitle: 'Viewed step-by-step solution for Question 2',
      icon: <FiEdit3 />,
      color: '#3b82f6',
      badge: 'Solve'
    },
    {
      time: '5 min',
      timestamp: 'Today',
      type: 'chatbot',
      title: 'Chatbot',
      subtitle: 'Asked: "How to solve quadratic equations?"',
      icon: <FiMessageSquare />,
      color: '#8b5cf6',
      badge: 'Chatbot'
    },
    {
      time: '10 min',
      timestamp: 'Today',
      type: 'homework-view',
      title: 'Homework View',
      subtitle: 'Math Chapter 4 - Quadratic Equations',
      icon: <FiEye />,
      color: '#ec4899',
      badge: 'Homework View'
    },
    {
      time: '7 min',
      timestamp: 'Today',
      type: 'classwork',
      title: 'Classwork View',
      subtitle: 'Science Chapter 3 - Force and Motion',
      icon: <FiFileText />,
      color: '#a855f7',
      badge: 'Classwork View'
    }
  ];

  return (
    <div className="timeline-container">
      <div className="timeline-header">
        <h3 className="timeline-title">
          <FiClock className="title-icon" />
          App Usage Timeline
        </h3>
      </div>

      <div className="timeline-wrapper">
        <div className="timeline-line"></div>
        
        {timelineData.map((item, index) => (
          <div key={index} className="timeline-event">
            {/* Timeline dot on the left */}
            <div 
              className="timeline-dot"
              style={{ backgroundColor: item.color }}
            ></div>

            {/* Event card */}
            <div className="event-card">
              <div className="event-header">
                <div className="event-icon" style={{ backgroundColor: `${item.color}20`, color: item.color }}>
                  {item.icon}
                </div>
                
                <div className="event-content">
                  <h4 className="event-title">{item.title}</h4>
                  <p className="event-subtitle">{item.subtitle}</p>
                </div>

                <div className="event-meta">
                  <span className="event-time">{item.time}</span>
                  <span 
                    className="event-badge"
                    style={{ backgroundColor: `${item.color}15`, color: item.color }}
                  >
                    {item.badge}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Activity Breakdown Component
export const ActivityBreakdown = ({ data = {} }) => {
  const activities = [
    { 
      id: 'solve',
      name: 'Solve', 
      value: data.solve || 35, 
      percentage: '28%',
      icon: <FiEdit3 />, 
      color: '#3b82f6',
      trend: '+5%'
    },
    { 
      id: 'concepts',
      name: 'Concepts', 
      value: data.concepts || 28, 
      percentage: '22%',
      icon: <FiBookOpen />, 
      color: '#0ea5e9',
      trend: '+3%'
    },
    { 
      id: 'autocorrect',
      name: 'Auto Correct', 
      value: data.autocorrect || 22, 
      percentage: '17%',
      icon: <FiCheckCircle />, 
      color: '#10b981',
      trend: '+8%'
    },
    { 
      id: 'chatbot',
      name: 'Chatbot', 
      value: data.chatbot || 18, 
      percentage: '14%',
      icon: <FiMessageSquare />, 
      color: '#f59e0b',
      trend: '-2%'
    },
    { 
      id: 'homework-submit',
      name: 'Homework Submit', 
      value: data.homeworkSubmit || 15, 
      percentage: '11%',
      icon: <FiBookOpen />, 
      color: '#ef4444',
      trend: '+4%'
    },
    { 
      id: 'homework-view',
      name: 'Homework View', 
      value: data.homeworkView || 12, 
      percentage: '9%',
      icon: <FiEye />, 
      color: '#f59e0b',
      trend: '0%'
    },
    { 
      id: 'classwork',
      name: 'Classwork View', 
      value: data.classworkView || 10, 
      percentage: '8%',
      icon: <FiFileText />, 
      color: '#8b5cf6',
      trend: '+1%'
    }
  ];

  // Calculate max value for chart scaling
  const maxValue = Math.max(...activities.map(a => a.value));

  return (
    <div className="breakdown-container">
      <div className="breakdown-header">
        <h3 className="breakdown-title">
          <FiTrendingUp className="title-icon" />
          Activity Breakdown (API Requests)
        </h3>
        <button className="visual-toggle">
          Visual Representation
        </button>
      </div>

      <div className="breakdown-content">
        {/* Activity Cards Grid */}
        <div className="activity-cards-grid">
          {activities.slice(0, 4).map((activity) => (
            <div key={activity.id} className="activity-metric-card">
              <div className="metric-icon" style={{ backgroundColor: `${activity.color}20` }}>
                <div className="icon-wrapper" style={{ color: activity.color }}>
                  {activity.icon}
                </div>
                <span className="metric-percentage">{activity.percentage}</span>
              </div>
              
              <div className="metric-value">{activity.value}</div>
              <div className="metric-name">{activity.name}</div>
              
              <div className="metric-bar">
                <div 
                  className="bar-fill"
                  style={{ 
                    width: `${(activity.value / maxValue) * 100}%`,
                    backgroundColor: activity.color
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Secondary Activities */}
        <div className="secondary-activities">
          {activities.slice(4).map((activity) => (
            <div key={activity.id} className="secondary-card">
              <div className="secondary-icon" style={{ backgroundColor: `${activity.color}20`, color: activity.color }}>
                {activity.icon}
              </div>
              <div className="secondary-content">
                <span className="secondary-value">{activity.value}</span>
                <span className="secondary-name">{activity.name}</span>
              </div>
              <div className="secondary-percentage" style={{ color: activity.color }}>
                {activity.percentage}
              </div>
            </div>
          ))}
        </div>

        {/* Visual Chart */}
        <div className="visual-chart">
          <h4 className="chart-title">Visual Representation</h4>
          <div className="bar-chart">
            {activities.map((activity, index) => (
              <div key={activity.id} className="chart-bar-wrapper">
                <div className="chart-bar-container">
                  <div 
                    className="chart-bar"
                    style={{ 
                      height: `${(activity.value / maxValue) * 200}px`,
                      backgroundColor: activity.color,
                      animationDelay: `${index * 0.1}s`
                    }}
                  >
                    <span className="bar-value">{activity.value}</span>
                  </div>
                </div>
                <span className="bar-label">{activity.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppUsageTimeline;