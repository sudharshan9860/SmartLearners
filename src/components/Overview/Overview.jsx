// Overview.jsx - Responsive Final Version
import React, { useState, useEffect } from 'react';
import './Overview.css';
import { FiTrendingUp, FiTrendingDown, FiMinus, FiActivity, FiAward, FiBookOpen, FiCpu } from 'react-icons/fi';
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

const Overview = () => {
  const [animateCards, setAnimateCards] = useState(false);

  useEffect(() => {
    setAnimateCards(true);
  }, []);

  // Combined Insights Data
  const combinedInsights = [
    {
      icon: <FiActivity />,
      title: 'PEAK ACTIVITY HOUR',
      value: '14:00 - 15:00',
      subtitle: '892 active users',
      colorClass: 'insight-purple'
    },
    {
      icon: <FiAward />,
      title: 'TOP PERFORMING SCHOOL',
      value: 'Delhi Public School',
      subtitle: '94% engagement rate',
      colorClass: 'insight-yellow'
    },
    {
      icon: <FiBookOpen />,
      title: 'MOST ACTIVE SUBJECT',
      value: 'Mathematics',
      subtitle: '3,245 submissions today',
      colorClass: 'insight-blue'
    },
    {
      icon: <FiCpu />,
      title: 'AI ASSISTANT USAGE',
      value: '567 queries',
      subtitle: 'resolved today',
      colorClass: 'insight-green'
    }
  ];

  // Top performing schools data
  const topPerformingSchools = [
    {
      name: 'Delhi Public School',
      studentActivity: 892,
      teacherEngagement: 87,
      assignmentCompletion: 89,
      averageScore: 91
    },
    {
      name: 'Ryan International',
      studentActivity: 745,
      teacherEngagement: 82,
      assignmentCompletion: 85,
      averageScore: 88
    },
    {
      name: 'Kendriya Vidyalaya',
      studentActivity: 680,
      teacherEngagement: 78,
      assignmentCompletion: 82,
      averageScore: 85
    },
    {
      name: 'DAV Public School',
      studentActivity: 612,
      teacherEngagement: 75,
      assignmentCompletion: 80,
      averageScore: 83
    },
    {
      name: "St. Mary's School",
      studentActivity: 589,
      teacherEngagement: 73,
      assignmentCompletion: 78,
      averageScore: 81
    }
  ];

  // Detailed School Statistics with enhanced colors
  const schoolStatistics = [
    { 
      school: 'Minds (9MMB)', 
      grade: '9th', 
      activeStudents: 32, 
      expectedStudents: 34, 
      participationRate: 94.1, 
      activeTeachers: 1,
      colorClass: 'stat-excellent'
    },
    { 
      school: 'Indus (8th class LB2)', 
      grade: '8th', 
      activeStudents: 45, 
      expectedStudents: 49, 
      participationRate: 91.8, 
      activeTeachers: 1,
      colorClass: 'stat-excellent'
    },
    { 
      school: 'Montee 9th (9MEL3)', 
      grade: '9th', 
      activeStudents: 18, 
      expectedStudents: 36, 
      participationRate: 50, 
      activeTeachers: 1,
      colorClass: 'stat-poor'
    },
    { 
      school: 'Montee 8th (8MEL3)', 
      grade: '8th', 
      activeStudents: 18, 
      expectedStudents: 33, 
      participationRate: 54.5, 
      activeTeachers: 1,
      colorClass: 'stat-poor'
    },
    { 
      school: 'Pragna (9th Agni)', 
      grade: '9th', 
      activeStudents: 21, 
      expectedStudents: 48, 
      participationRate: 43.8, 
      activeTeachers: 0,
      colorClass: 'stat-critical'
    }
  ];

  // Student Participation Chart Data
  const participationChartData = {
    labels: ['Minds (9MMB)', 'Indus (8th class LB2)', 'Montee 9th (9MEL3)', 'Montee 8th (8MEL3)', 'Pragna (9th Agni)'],
    datasets: [{
      label: 'Participation Rate (%)',
      data: [94.1, 91.8, 50, 54.5, 43.8],
      backgroundColor: (context) => {
        const value = context.parsed.y;
        if (value >= 80) return 'rgba(16, 185, 129, 0.8)';
        if (value >= 60) return 'rgba(251, 146, 60, 0.8)';
        return 'rgba(239, 68, 68, 0.8)';
      },
      borderRadius: 8,
      barThickness: 'flex'
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
        callbacks: {
          label: (context) => `${context.parsed.y}% Participation`
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

  const getTrendIcon = (activity) => {
    if (activity > 700) return <FiTrendingUp className="trend-icon up" />;
    if (activity > 600) return <FiMinus className="trend-icon stable" />;
    return <FiTrendingDown className="trend-icon down" />;
  };

  return (
    <div className="overview-container">
      {/* Combined Insights Section */}
      <div className="insights-section">
        <h2 className="section-heading">
          <span className="emoji-icon">💡</span>
          Insights Dashboard
        </h2>
        <div className="insights-grid">
          {combinedInsights.map((insight, index) => (
            <div
              key={index}
              className={`insight-card ${insight.colorClass} ${animateCards ? 'animate-in' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="insight-icon-wrapper">
                {insight.icon}
              </div>
              <div className="insight-content">
                <h3 className="insight-title">{insight.title}</h3>
                <p className="insight-value">{insight.value}</p>
                <p className="insight-subtitle">{insight.subtitle}</p>
              </div>
              <div className="insight-decoration"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performing Schools */}
      <div className="schools-section">
        <h2 className="section-heading">
          <span className="emoji-icon">🏆</span>
          Top Performing Schools
        </h2>
        <div className="schools-table-wrapper">
          <table className="schools-table">
            <thead>
              <tr>
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
                <tr key={index} className={index < 3 ? `rank-${index + 1}` : ''}>
                  <td>
                    <div className={`rank-badge rank-${index + 1}`}>
                      #{index + 1}
                    </div>
                  </td>
                  <td className="school-name">{school.name}</td>
                  <td>
                    <div className="metric-cell">
                      <span className="metric-value">{school.studentActivity}</span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill blue"
                          style={{ width: `${(school.studentActivity / 892) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="metric-cell">
                      <span className="metric-value">{school.teacherEngagement}%</span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill purple"
                          style={{ width: `${school.teacherEngagement}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="metric-cell">
                      <span className="metric-value">{school.assignmentCompletion}%</span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill green"
                          style={{ width: `${school.assignmentCompletion}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="metric-cell">
                      <span className="metric-value">{school.averageScore}%</span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill indigo"
                          style={{ width: `${school.averageScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="trend-cell">
                    {getTrendIcon(school.studentActivity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed School Statistics - Enhanced with Colors */}
      <div className="statistics-section">
        <h2 className="section-heading">
          <span className="emoji-icon">📊</span>
          Detailed School Statistics
        </h2>
        <div className="statistics-table-wrapper">
          <table className="statistics-table colorful">
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
                <tr key={index} className={stat.colorClass}>
                  <td className="school-cell">{stat.school}</td>
                  <td>
                    <span className="grade-badge">{stat.grade}</span>
                  </td>
                  <td className="number-cell">
                    <span className="active-students-badge">{stat.activeStudents}</span>
                  </td>
                  <td className="number-cell">
                    <span className="expected-students-badge">{stat.expectedStudents}</span>
                  </td>
                  <td>
                    <div className="participation-cell">
                      <span className={`rate-value ${
                        stat.participationRate >= 80 ? 'high' : 
                        stat.participationRate >= 60 ? 'medium' : 'low'
                      }`}>
                        {stat.participationRate.toFixed(1)}%
                      </span>
                      <div className="mini-progress">
                        <div 
                          className={`mini-progress-fill ${
                            stat.participationRate >= 80 ? 'high' : 
                            stat.participationRate >= 60 ? 'medium' : 'low'
                          }`}
                          style={{ width: `${stat.participationRate}%` }}
                        ></div>
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
      </div>

      {/* Student Participation Chart */}
      <div className="chart-section">
        <h2 className="section-heading">
          <span className="emoji-icon">📈</span>
          Student Participation Rate by School
        </h2>
        <div className="chart-wrapper">
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