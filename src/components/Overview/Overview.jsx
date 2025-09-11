// Overview.jsx
import React, { useState, useEffect } from 'react';
import './Overview.css';
import FilterBar from '../common/FilterBar';
import { overviewData, realtimeActivityData } from '../../data/mockData';
import { FiUsers, FiActivity, FiUserCheck, FiTrendingUp, FiRefreshCw } from 'react-icons/fi';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Overview = ({ filters }) => {
  const [activityData, setActivityData] = useState(realtimeActivityData);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const statsCards = [
    {
      title: '🏫 Schools Overview',
      value: overviewData.schools.total,
      subtitle: `Total Schools | Active: ${overviewData.schools.active}`,
      color: 'purple',
      icon: <FiUsers />,
      trend: '+5.2%',
      chart: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        data: [120, 122, 125, 124, 127]
      }
    },
    {
      title: '👥 Student Engagement',
      value: overviewData.studentEngagement.total.toLocaleString(),
      subtitle: `Total Students | Online: ${overviewData.studentEngagement.online.toLocaleString()}`,
      color: 'blue',
      icon: <FiActivity />,
      trend: '+12.3%',
      chart: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        data: [22000, 22500, 23000, 24000, 24567]
      }
    },
    {
      title: '📚 Teacher Activity',
      value: overviewData.teacherActivity.total.toLocaleString(),
      subtitle: `Total Teachers | Active: ${overviewData.teacherActivity.active}`,
      color: 'orange',
      icon: <FiUserCheck />,
      trend: '+8.7%',
      chart: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        data: [1180, 1200, 1220, 1240, 1247]
      }
    },
    {
      title: '📊 Daily Activity',
      value: overviewData.dailyActivity.assignments.toLocaleString(),
      subtitle: 'Assignments submitted today',
      color: 'green',
      icon: <FiTrendingUp />,
      trend: '+15.4%',
      chart: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        data: [2100, 2200, 2300, 2400, 2456]
      }
    }
  ];

  const getMiniChartConfig = (card) => ({
    data: {
      labels: card.chart.labels,
      datasets: [{
        data: card.chart.data,
        borderColor: `var(--${card.color}-500)`,
        backgroundColor: `var(--${card.color}-100)`,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      },
      scales: {
        x: { display: false },
        y: { display: false }
      }
    }
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setActivityData([...realtimeActivityData].reverse());
      setIsRefreshing(false);
    }, 1000);
  };

  useEffect(() => {
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      setActivityData(prev => [...prev.slice(1), {
        ...realtimeActivityData[0],
        id: Date.now(),
        time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
      }]);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="overview-container">
      <FilterBar filters={filters} />
      
      <div className="stats-grid">
        {statsCards.map((card, index) => (
          <div 
            key={index} 
            className={`stat-card ${card.color}`}
            style={{ '--delay': `${index * 0.1}s` }}
          >
            <div className="stat-header">
              <div className="stat-info">
                <h3 className="stat-title">{card.title}</h3>
                <div className="stat-value-container">
                  <h2 className="stat-value">{card.value}</h2>
                  <span className={`stat-trend ${card.trend.startsWith('+') ? 'positive' : 'negative'}`}>
                    {card.trend}
                  </span>
                </div>
                <p className="stat-subtitle">{card.subtitle}</p>
              </div>
              <div className="stat-icon">
                {card.icon}
              </div>
            </div>
            <div className="mini-chart">
              <Line {...getMiniChartConfig(card)} />
            </div>
          </div>
        ))}
      </div>

      <div className="activity-section">
        <div className="section-header">
          <h2 className="section-title">
            <span className="title-icon">📊</span>
            Real-time Activity Monitor
          </h2>
          <button 
            className={`refresh-btn ${isRefreshing ? 'refreshing' : ''}`}
            onClick={handleRefresh}
          >
            <FiRefreshCw />
            Refresh
          </button>
        </div>

        <div className="activity-table">
          <div className="table-header">
            <div className="table-cell">Time</div>
            <div className="table-cell">School</div>
            <div className="table-cell">Student/Teacher</div>
            <div className="table-cell">Activity</div>
            <div className="table-cell">Details</div>
            <div className="table-cell">Status</div>
          </div>
          <div className="table-body">
            {activityData.map((activity, index) => (
              <div 
                key={activity.id} 
                className="table-row"
                style={{ '--delay': `${index * 0.05}s` }}
              >
                <div className="table-cell time-cell">
                  <span className="activity-time">{activity.time}</span>
                </div>
                <div className="table-cell">
                  <span className="school-name">{activity.school}</span>
                </div>
                <div className="table-cell">
                  <span className="user-name">{activity.user}</span>
                </div>
                <div className="table-cell">
                  <span className="activity-type">
                    <span className="activity-icon">{activity.icon}</span>
                    {activity.activity}
                  </span>
                </div>
                <div className="table-cell">
                  <span className="activity-details">{activity.details}</span>
                </div>
                <div className="table-cell">
                  <span className={`status-badge ${activity.status.toLowerCase()}`}>
                    {activity.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="insights-section">
        <h3 className="insights-title">
          <span className="title-icon">💡</span>
          Quick Insights
        </h3>
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-icon">📈</div>
            <h4>Peak Activity Hour</h4>
            <p>14:00 - 15:00 with 892 active users</p>
          </div>
          <div className="insight-card">
            <div className="insight-icon">🏆</div>
            <h4>Top Performing School</h4>
            <p>Delhi Public School - 94% engagement</p>
          </div>
          <div className="insight-card">
            <div className="insight-icon">📚</div>
            <h4>Most Active Subject</h4>
            <p>Mathematics - 3,245 submissions today</p>
          </div>
          <div className="insight-card">
            <div className="insight-icon">🤖</div>
            <h4>AI Assistant Usage</h4>
            <p>567 queries resolved today</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;