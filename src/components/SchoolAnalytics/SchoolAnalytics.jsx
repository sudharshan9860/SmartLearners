// SchoolAnalytics.jsx
import React, { useState } from 'react';
import './SchoolAnalytics.css';
import { schoolAnalyticsData } from '../../data/mockData';
import { FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi';
import { Line, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
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
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SchoolAnalytics = ({ filters }) => {
  const [selectedMetric, setSelectedMetric] = useState('Student Engagement');
  const [selectedSchools, setSelectedSchools] = useState(['Delhi Public School', 'Ryan International', 'Kendriya Vidyalaya']);
  const { topPerformingSchools, comparisonMetrics, trendData } = schoolAnalyticsData;

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <FiTrendingUp className="trend-up" />;
      case 'down':
        return <FiTrendingDown className="trend-down" />;
      default:
        return <FiMinus className="trend-stable" />;
    }
  };

  const lineChartData = {
    labels: trendData.labels,
    datasets: [
      {
        label: 'Delhi Public School',
        data: trendData.datasets.delhiPublic,
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Ryan International',
        data: trendData.datasets.ryanInternational,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Kendriya Vidyalaya',
        data: trendData.datasets.kendriyaVidyalaya,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${selectedMetric} Trends - Last 6 Months`
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      }
    }
  };

  const radarData = {
    labels: ['Engagement', 'Completion', 'Avg Score', 'Teacher Activity', 'Platform Usage'],
    datasets: selectedSchools.map((school, index) => {
      const schoolData = topPerformingSchools.find(s => s.school === school);
      return {
        label: school,
        data: [
          schoolData?.engagement || 0,
          schoolData?.completion || 0,
          schoolData?.averageScore || 0,
          85, // Mock teacher activity
          90  // Mock platform usage
        ],
        borderColor: ['#8b5cf6', '#3b82f6', '#10b981'][index],
        backgroundColor: ['rgba(139, 92, 246, 0.2)', 'rgba(59, 130, 246, 0.2)', 'rgba(16, 185, 129, 0.2)'][index],
        pointBackgroundColor: ['#8b5cf6', '#3b82f6', '#10b981'][index],
      };
    })
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'School Performance Comparison'
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100
      }
    }
  };

  return (
    <div className="school-analytics-container">
      <FilterBar filters={filters} />
      
      <div className="school-comparison-header">
        <h2 className="comparison-title">School Comparison</h2>
        <div className="metric-selector">
          <label>Metric:</label>
          <select 
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="metric-select"
          >
            {comparisonMetrics.map(metric => (
              <option key={metric} value={metric}>{metric}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="top-schools-section">
        <h3 className="section-title">🏆 Top Performing Schools</h3>
        <div className="schools-table">
          <div className="table-header">
            <div className="table-cell">Rank</div>
            <div className="table-cell">School</div>
            <div className="table-cell">Engagement</div>
            <div className="table-cell">Completion Rate</div>
            <div className="table-cell">Average Score</div>
            <div className="table-cell">Trend</div>
          </div>
          {topPerformingSchools.map((school) => (
            <div 
              key={school.rank}
              className={`table-row ${selectedSchools.includes(school.school) ? 'selected' : ''}`}
              onClick={() => {
                if (selectedSchools.includes(school.school)) {
                  setSelectedSchools(selectedSchools.filter(s => s !== school.school));
                } else if (selectedSchools.length < 3) {
                  setSelectedSchools([...selectedSchools, school.school]);
                }
              }}
            >
              <div className="table-cell rank-cell">
                <span className={`rank rank-${school.rank}`}>#{school.rank}</span>
              </div>
              <div className="table-cell school-name">
                {school.school}
              </div>
              <div className="table-cell">
                <div className="metric-value">
                  <span className="value">{school.engagement}%</span>
                  <div className="mini-progress">
                    <div 
                      className="progress-fill"
                      style={{ width: `${school.engagement}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="table-cell">
                <div className="metric-value">
                  <span className="value">{school.completion}%</span>
                  <div className="mini-progress">
                    <div 
                      className="progress-fill"
                      style={{ width: `${school.completion}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="table-cell">
                <div className="metric-value">
                  <span className="value">{school.averageScore}%</span>
                  <div className="mini-progress">
                    <div 
                      className="progress-fill"
                      style={{ width: `${school.averageScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="table-cell trend-cell">
                {getTrendIcon(school.trend)}
              </div>
            </div>
          ))}
        </div>
        <p className="selection-hint">Click on schools to compare (max 3)</p>
      </div>

      <div className="charts-grid">
        <div className="chart-container trend-chart">
          <Line data={lineChartData} options={lineChartOptions} />
        </div>
        <div className="chart-container radar-chart">
          <Radar data={radarData} options={radarOptions} />
        </div>
      </div>

      <div className="analytics-insights">
        <h3 className="insights-title">Key Insights</h3>
        <div className="insights-grid">
          <div className="insight-card positive">
            <div className="insight-icon">📈</div>
            <h4>Top Performer</h4>
            <p>Delhi Public School leads with 94% engagement rate and consistent growth</p>
          </div>
          <div className="insight-card warning">
            <div className="insight-icon">⚠️</div>
            <h4>Needs Attention</h4>
            <p>DAV Public School showing declining trend in completion rates</p>
          </div>
          <div className="insight-card info">
            <div className="insight-icon">💡</div>
            <h4>Best Practice</h4>
            <p>Schools with active teacher participation show 20% higher student engagement</p>
          </div>
          <div className="insight-card success">
            <div className="insight-icon">🎯</div>
            <h4>Goal Achievement</h4>
            <p>3 out of 5 schools exceeded their monthly performance targets</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolAnalytics;