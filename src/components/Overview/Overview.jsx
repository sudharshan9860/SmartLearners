// ===== UPDATED OVERVIEW COMPONENT =====
// src/components/Overview/Overview.jsx

import React, { useState, useEffect } from 'react';
import './Overview.css';
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiMinus,
  FiActivity,
  FiAward,
  FiCpu,
  FiTool
} from 'react-icons/fi';
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
import ApiService from '../../services/apiService';
import DataTransformer from '../../utils/dataTransformer';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Overview = ({ filters }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 5 * 60 * 1000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, [filters]);

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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">Error loading data: {error}</p>
        <button onClick={loadDashboardData} className="retry-btn">Retry</button>
      </div>
    );
  }

  if (!data) {
    return <div className="no-data">No data available</div>;
  }

  const { insights, schoolStatistics, topPerformingSchools, participationChartData } = data;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.y.toFixed(1)}%`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value) => `${value}%`
        }
      }
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <FiTrendingUp className="trend-up" />;
      case 'down': return <FiTrendingDown className="trend-down" />;
      default: return <FiMinus className="trend-stable" />;
    }
  };

  return (
    <div className="overview-container">
      {/* Insights Dashboard */}
      <h2 className="section-heading">
        <span className="emoji-icon">💡</span>
        Insights Dashboard
      </h2>
      
      <div className="insights-section">
        <div className="insights-grid">
          {/* Peak Activity Hour */}
          <div className="insight-card insight-purple animate-in">
            <div className="insight-icon-wrapper">
              <FiActivity />
            </div>
            <div className="insight-content">
              <p className="insight-label">PEAK ACTIVITY HOUR</p>
              <p className="insight-value">{insights.peakActivityHour.time}</p>
              <p className="insight-subtitle">{insights.peakActivityHour.activeUsers} active users</p>
            </div>
          </div>

          {/* Top Performing School */}
          <div className="insight-card insight-yellow animate-in">
            <div className="insight-icon-wrapper">
              <FiAward />
            </div>
            <div className="insight-content">
              <p className="insight-label">TOP PERFORMING SCHOOL</p>
              <p className="insight-value">{insights.topPerformingSchool.schoolName}</p>
              <p className="insight-subtitle">{insights.topPerformingSchool.engagementRate}% engagement rate</p>
            </div>
          </div>

          {/* Most Active Feature */}
          <div className="insight-card insight-blue animate-in">
            <div className="insight-icon-wrapper">
              <FiTool />
            </div>
            <div className="insight-content">
              <p className="insight-label">MOST ACTIVE FEATURE</p>
              <p className="insight-value">{insights.mostActiveFeature.feature}</p>
              <p className="insight-subtitle">{insights.mostActiveFeature.count} uses today</p>
            </div>
          </div>

          {/* AI Assistant Usage */}
          <div className="insight-card insight-green animate-in">
            <div className="insight-icon-wrapper">
              <FiCpu />
            </div>
            <div className="insight-content">
              <p className="insight-label">AI ASSISTANT USAGE</p>
              <p className="insight-value">{insights.aiAssistantUsage.queriesResolved} queries</p>
              <p className="insight-subtitle">resolved today</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Schools */}
      <h2 className="section-heading">
        <span className="emoji-icon">🏆</span>
        Top Performing Schools
      </h2>
      
      <div className="top-schools-section">
        <div className="schools-table-container">
          <table className="schools-table">
            <thead>
              <tr className="table-header">
                <th>RANK</th>
                <th>SCHOOL</th>
                <th>STUDENT ACTIVITY</th>
                <th>TEACHER ENGAGEMENT</th>
                <th>ASSIGNMENT COMPLETION</th>
                <th>AVERAGE SCORE</th>
                <th>TREND</th>
              </tr>
            </thead>
            <tbody>
              {topPerformingSchools.map((school, index) => (
                <tr key={index} className={`school-row rank-${index + 1}`}>
                  <td className="rank-badge">#{index + 1}</td>
                  <td className="school-name">{school.schoolName}</td>
                  <td>
                    <div className="progress-cell">
                      <span className="progress-value">{school.studentActivity}</span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill blue"
                          style={{ width: `${Math.min(100, school.studentActivity / 2)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="progress-cell">
                      <span className="progress-value">{school.teacherEngagement.toFixed(0)}%</span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill purple"
                          style={{ width: `${school.teacherEngagement}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="progress-cell">
                      <span className="progress-value">{school.assignmentCompletion.toFixed(0)}%</span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill green"
                          style={{ width: `${school.assignmentCompletion}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="progress-cell">
                      <span className="progress-value">{school.averageScore.toFixed(0)}%</span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill blue"
                          style={{ width: `${school.averageScore}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="trend-cell">
                    {getTrendIcon(school.trend)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed School Statistics */}
      <h2 className="section-heading">
        <span className="emoji-icon">📊</span>
        Detailed School Statistics
      </h2>
      
      <div className="statistics-section">
        <table className="statistics-table">
          <thead>
            <tr>
              <th>SCHOOL</th>
              <th>GRADE</th>
              <th>ACTIVE STUDENTS</th>
              <th>EXPECTED STUDENTS</th>
              <th>PARTICIPATION RATE (%)</th>
              <th>ACTIVE TEACHERS</th>
            </tr>
          </thead>
          <tbody>
            {schoolStatistics.map((stat, index) => (
              <tr key={index} className={`stat-row stat-${stat.status}`}>
                <td>{stat.schoolName}</td>
                <td>
                  <span className={`grade-badge grade-${stat.grade}`}>{stat.grade}</span>
                </td>
                <td className="number-cell active">{stat.activeStudents}</td>
                <td className="number-cell expected">{stat.expectedStudents}</td>
                <td>
                  <div className="participation-cell">
                    <span className={`participation-value ${stat.status}`}>
                      {stat.participationRate}%
                    </span>
                    <div className="participation-bar">
                      <div 
                        className={`participation-fill ${stat.status}`}
                        style={{ width: `${stat.participationRate}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`teacher-badge ${stat.activeTeachers > 0 ? 'active' : 'inactive'}`}>
                    {stat.activeTeachers}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Student Participation Chart */}
      <h2 className="section-heading">
        <span className="emoji-icon">📈</span>
        Student Participation Rate by School
      </h2>
      
      <div className="chart-section">
        <div className="chart-container" style={{ height: '400px' }}>
          <Bar data={participationChartData} options={chartOptions} />
        </div>
        <div className="chart-legend">
          <div className="legend-item">
            <span className="legend-color high"></span>
            <span>High (80%+)</span>
          </div>
          <div className="legend-item">
            <span className="legend-color medium"></span>
            <span>Medium (60-79%)</span>
          </div>
          <div className="legend-item">
            <span className="legend-color low"></span>
            <span>Low (&lt;60%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;