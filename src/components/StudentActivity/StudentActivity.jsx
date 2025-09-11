// StudentActivity.jsx
import React, { useState } from 'react';
import './StudentActivity.css';
import FilterBar from '../common/FilterBar';
import { studentActivityData } from '../../data/mockData';
import { FiClock, FiTarget, FiMessageCircle, FiEye, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StudentActivity = ({ filters }) => {
  const { studentInfo, metrics, appUsageTimeline, todayActivityBreakdown } = studentActivityData;
  const [selectedStudent, setSelectedStudent] = useState('10HPS21');

  const metricsData = [
    {
      icon: <FiClock />,
      label: 'Total Active Time',
      value: metrics.totalActiveTime,
      color: '#667eea',
      bgColor: '#f3e8ff'
    },
    {
      icon: <FiTarget />,
      label: 'Questions Solved',
      value: metrics.questionsSolved,
      color: '#10b981',
      bgColor: '#d1fae5'
    },
    {
      icon: <FiMessageCircle />,
      label: 'Chatbot Queries',
      value: metrics.chatbotQueries,
      color: '#3b82f6',
      bgColor: '#dbeafe'
    },
    {
      icon: <FiEye />,
      label: 'Concept Views',
      value: metrics.conceptViews,
      color: '#f59e0b',
      bgColor: '#fef3c7'
    },
    {
      icon: <FiTrendingUp />,
      label: 'Average Score',
      value: `${metrics.averageScore}%`,
      color: '#8b5cf6',
      bgColor: '#ede9fe'
    },
    {
      icon: <FiCheckCircle />,
      label: 'Assignments Done',
      value: metrics.assignmentsDone,
      color: '#ef4444',
      bgColor: '#fee2e2'
    }
  ];

  const chartData = {
    labels: todayActivityBreakdown.map(item => item.activity),
    datasets: [{
      label: 'Time Spent (minutes)',
      data: todayActivityBreakdown.map(item => item.value),
      backgroundColor: [
        'rgba(102, 126, 234, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)'
      ],
      borderRadius: 8
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        borderRadius: 8
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div className="student-activity-container">
      <FilterBar filters={filters} />
      
      <div className="student-profile-card">
        <div className="profile-number">21</div>
        <div className="profile-info">
          <h2 className="student-id">Student ID: {studentInfo.id}</h2>
          <p className="student-details">
            {studentInfo.class} - {studentInfo.section} | {studentInfo.school} - {studentInfo.block}
          </p>
        </div>
      </div>

      <div className="metrics-grid">
        {metricsData.map((metric, index) => (
          <div 
            key={index} 
            className="metric-card"
            style={{ 
              '--metric-color': metric.color,
              '--metric-bg': metric.bgColor,
              '--delay': `${index * 0.1}s`
            }}
          >
            <div className="metric-icon" style={{ color: metric.color, backgroundColor: metric.bgColor }}>
              {metric.icon}
            </div>
            <div className="metric-info">
              <h3 className="metric-value">{metric.value}</h3>
              <p className="metric-label">{metric.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="activity-sections">
        <div className="timeline-section">
          <div className="section-header">
            <h3 className="section-title">
              <FiClock className="section-icon" />
              App Usage Timeline
            </h3>
          </div>
          
          <div className="timeline">
            {appUsageTimeline.map((event, index) => (
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

        <div className="breakdown-section">
          <div className="section-header">
            <h3 className="section-title">
              <FiTrendingUp className="section-icon" />
              Today's Activity Breakdown
            </h3>
          </div>
          
          <div className="chart-container">
            <Bar data={chartData} options={chartOptions} />
          </div>
          
          <div className="activity-stats">
            {todayActivityBreakdown.map((item, index) => (
              <div key={index} className="activity-stat">
                <div className="stat-bar">
                  <div 
                    className="stat-fill"
                    style={{ 
                      width: `${(item.value / 35) * 100}%`,
                      backgroundColor: chartData.datasets[0].backgroundColor[index]
                    }}
                  ></div>
                </div>
                <div className="stat-info">
                  <span className="stat-label">{item.activity}</span>
                  <span className="stat-time">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="recommendations-section">
        <h3 className="recommendations-title">
          💡 AI-Powered Recommendations
        </h3>
        <div className="recommendations-grid">
          <div className="recommendation-card">
            <div className="recommendation-icon">📚</div>
            <h4>Focus on Algebra</h4>
            <p>Student shows 15% lower performance in algebraic concepts</p>
          </div>
          <div className="recommendation-card">
            <div className="recommendation-icon">⏰</div>
            <h4>Optimal Study Time</h4>
            <p>Best performance observed between 2:00 PM - 4:00 PM</p>
          </div>
          <div className="recommendation-card">
            <div className="recommendation-icon">🎯</div>
            <h4>Practice More MCQs</h4>
            <p>MCQ accuracy is 78%. Target: 90%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentActivity;