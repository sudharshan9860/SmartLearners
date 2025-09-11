// ActivityBreakdown.jsx
import React from 'react';
import { Bar } from 'react-chartjs-2';

const ActivityBreakdown = ({ data, chartOptions }) => {
  const chartData = {
    labels: data.map(item => item.activity),
    datasets: [{
      label: 'Time Spent (minutes)',
      data: data.map(item => item.value),
      backgroundColor: [
        'rgba(102, 126, 234, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)'
      ],
      borderRadius: 8
    }]
  };

  return (
    <div className="breakdown-section">
      <div className="section-header">
        <h3 className="section-title">
          <span className="section-icon">📊</span>
          Today's Activity Breakdown
        </h3>
      </div>
      
      <div className="chart-container">
        <Bar data={chartData} options={chartOptions} />
      </div>
      
      <div className="activity-stats">
        {data.map((item, index) => (
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
  );
};

export default ActivityBreakdown;