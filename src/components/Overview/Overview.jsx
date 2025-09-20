// src/components/Overview/Overview.jsx
import React, { useState, useEffect } from 'react';
import './Overview.css';
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiMinus,
  FiActivity,
  FiBook,
  FiCpu,
  FiClock,
  FiUsers
} from 'react-icons/fi';
import ApiService from '../../services/apiService';
import DataTransformer from '../../utils/dataTransformer';
import LoadingSpinner from '../common/LoadingSpinner';

const Overview = ({ filters, apiHealthy }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (apiHealthy) {
      loadDashboardData();
      const interval = setInterval(loadDashboardData, 30 * 60 * 1000);
      return () => clearInterval(interval);
    } else {
      setError('Backend not healthy. Skipping API calls.');
      setLoading(false);
    }
  }, [filters, apiHealthy]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [dailyRollups, schoolLogs] = await Promise.all([
        ApiService.getDailyRollups(),
        ApiService.getSchoolLogs()
      ]);
      
      const transformedData = DataTransformer.transformForOverview(dailyRollups, schoolLogs);
      setData(transformedData);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime12Hour = (hour) => {
    const hourNum = parseInt(hour.split(':')[0]);
    const period = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum;
    return `${displayHour} ${period}`;
  };

  const getParticipationColor = (rate) => {
    if (rate >= 80) return '#10b981';
    if (rate >= 60) return '#f59e0b';
    if (rate >= 40) return '#3b82f6';
    return '#ef4444';
  };

  const getRowStatus = (rate) => {
    if (rate >= 80) return 'excellent';
    if (rate >= 60) return 'good';
    if (rate >= 40) return 'average';
    return 'low';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <LoadingSpinner text="Loading dashboard data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">⚠️ Error: {error}</p>
        <button onClick={loadDashboardData} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  if (!data) {
    return <div className="no-data">📊 No data available</div>;
  }

  const { insights, schoolStatistics, totalActiveStudents, totalActiveTeachers } = data;

  return (
    <div className="overview-container">
      {/* Quick Insights Dashboard */}
      <div className="insights-dashboard">
        <h2>✨ Quick Insights</h2>
        <div className="insights-grid">
          <div className="insight-card insight-purple animate-in">
            <div className="insight-icon-wrapper">
              <FiClock />
            </div>
            <div className="insight-content">
              <p className="insight-label">PEAK ACTIVITY HOUR</p>
              <p className="insight-value">
                {formatTime12Hour(insights.peakActivityHour.time)}
              </p>
              <p className="insight-subtitle">{insights.peakActivityHour.students} active students</p>
            </div>
          </div>

          <div className="insight-card insight-yellow animate-in">
            <div className="insight-icon-wrapper">
              <FiActivity />
            </div>
            <div className="insight-content">
              <p className="insight-label">TOP PERFORMING SCHOOL</p>
              <p className="insight-value">{insights.topPerformingSchool.schoolName}</p>
            </div>
          </div>

          <div className="insight-card insight-blue animate-in">
            <div className="insight-icon-wrapper">
              <FiBook />
            </div>
            <div className="insight-content">
              <p className="insight-label">MOST ACTIVE SUBJECT</p>
              <p className="insight-value">{insights.mostActiveSubject.subject}</p>
              <p className="insight-subtitle">{insights.mostActiveSubject.submissions} submissions today</p>
            </div>
          </div>

          <div className="insight-card insight-green animate-in">
            <div className="insight-icon-wrapper">
              <FiCpu />
            </div>
            <div className="insight-content">
              <p className="insight-label">AI ASSISTANT USAGE</p>
              <p className="insight-value">{insights.aiAssistantUsage.queries}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed School Statistics Table - NEW CARD-BASED LAYOUT */}
      <div className="statistics-section">
        <div className="section-header">
          <h2>📊 Detailed School Statistics</h2>
          <div className="summary-badges">
            <span className="badge badge-students">
              <FiUsers /> {totalActiveStudents} Total Students
            </span>
            <span className="badge badge-teachers">
              <FiUsers /> {totalActiveTeachers} Active Teachers
            </span>
          </div>
        </div>
        
        {/* Card-based Layout for Statistics */}
        <div className="statistics-cards-container">
          {schoolStatistics.map((stat, index) => (
            <div key={index} className={`stat-card ${getRowStatus(stat.participationRate)}`}>
              <div className="stat-card-header">
                <div className="school-info">
                  <h3 className="school-name">{stat.school}</h3>
                  {stat.section && (
                    <span className="school-section">{stat.section}</span>
                  )}
                </div>
                <span className="grade-badge">{stat.grade}</span>
              </div>
              
              <div className="stat-card-body">
                <div className="stat-item">
                  <span className="stat-label">Active Students</span>
                  <span className="stat-value active-students">{stat.activeStudents}</span>
                </div>
                
                <div className="stat-item">
                  <span className="stat-label">Expected Students</span>
                  <span className="stat-value expected-students">{stat.expectedStudents}</span>
                </div>
                
                <div className="stat-item">
                  <span className="stat-label">Participation Rate</span>
                  <div className="participation-display">
                    <span 
                      className="stat-value participation-value"
                      style={{ color: getParticipationColor(stat.participationRate) }}
                    >
                      {stat.participationRate.toFixed(1)}%
                    </span>
                    <div className="participation-bar">
                      <div 
                        className={`participation-fill ${getRowStatus(stat.participationRate)}`}
                        style={{ width: `${stat.participationRate}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="stat-item">
                  <span className="stat-label">Active Teachers</span>
                  <span className={`teacher-badge ${stat.activeTeachers > 0 ? 'active' : 'inactive'}`}>
                    {stat.activeTeachers}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="table-legend">
          <div className="legend-item">
            <span className="legend-color excellent"></span>
            <span>Excellent (≥80%)</span>
          </div>
          <div className="legend-item">
            <span className="legend-color good"></span>
            <span>Good (60-79%)</span>
          </div>
          <div className="legend-item">
            <span className="legend-color average"></span>
            <span>Average (40-59%)</span>
          </div>
          <div className="legend-item">
            <span className="legend-color low"></span>
            <span>Low (&lt;40%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;