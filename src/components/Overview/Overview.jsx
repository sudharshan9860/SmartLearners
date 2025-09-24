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
  FiUsers,
  FiCalendar
} from 'react-icons/fi';
import ApiService from '../../services/apiService';
import DataTransformer from '../../utils/dataTransformer';
import LoadingSpinner from '../common/LoadingSpinner';

const Overview = ({ filters, apiHealthy }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState('today');
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (apiHealthy) {
      loadDashboardData();
      const interval = setInterval(loadDashboardData, 30 * 60 * 1000);
      return () => clearInterval(interval);
    } else {
      setError('Backend not healthy. Skipping API calls.');
      setLoading(false);
    }
  }, [filters, apiHealthy, dateFilter, dateRange]);

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

  const formatTimeRange = (hour) => {
    const hourNum = parseInt(hour.split(':')[0]);
    const nextHour = (hourNum + 1) % 24;
    
    const formatHour = (h) => {
      const period = h >= 12 ? 'PM' : 'AM';
      const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
      return `${displayHour} ${period}`;
    };
    
    return `${formatHour(hourNum)} - ${formatHour(nextHour)}`;
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

  const handleDateFilterChange = (filterType) => {
    setDateFilter(filterType);
    if (filterType === 'today') {
      const today = new Date().toISOString().split('T')[0];
      setDateRange({ startDate: today, endDate: today });
    }
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
                {formatTimeRange(insights.peakActivityHour.time)}
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
              <p className="insight-subtitle">{insights.topPerformingSchool.engagementRate}% engagement</p>
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
              <p className="insight-subtitle">queries today</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed School Statistics with Date Filter */}
      <div className="statistics-section">
        <div className="section-header">
          <div className="header-left">
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
          
         
        </div>
        
        {/* Card-based Layout for Statistics */}
        <div className="statistics-cards-container">
          {schoolStatistics.map((stat, index) => (
            <div key={index} className={`stat-card ${getRowStatus(stat.participationRate)}`}>
              <div className="stat-card-header">
                <h3 className="school-name">{stat.school}</h3>
                <span className={`grade-badge grade-${stat.grade}`}>{stat.grade}</span>
              </div>
              
              <div className="stat-metrics">
                <div className="metric">
                  <span className="metric-label">ACTIVE STUDENTS</span>
                  <span className="metric-value">{stat.activeStudents}</span>
                </div>
                <div className="metric">
                  <span className="metric-label">EXPECTED STUDENTS</span>
                  <span className="metric-value">{stat.expectedStudents}</span>
                </div>
              </div>
              
              <div className="participation-section">
                <div className="participation-header">
                  <span className="participation-label">PARTICIPATION RATE</span>
                  <span className="participation-value" style={{ color: getParticipationColor(stat.participationRate) }}>
                    {stat.participationRate}%
                  </span>
                </div>
                <div className="participation-bar">
                  <div 
                    className="participation-fill"
                    style={{ 
                      width: `${stat.participationRate}%`,
                      background: getParticipationColor(stat.participationRate)
                    }}
                  />
                </div>
              </div>
              
              <div className="teacher-metric">
                <FiUsers className="teacher-icon" />
                <span className="teacher-label">Active Teachers</span>
                <span className="teacher-value">{stat.activeTeachers}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Overview;