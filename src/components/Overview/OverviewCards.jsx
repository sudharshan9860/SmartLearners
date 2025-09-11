// OverviewCards.jsx
import React from 'react';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { Line } from 'react-chartjs-2';

const OverviewCards = ({ statsCards, getMiniChartConfig }) => {
  return (
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
                  {card.trend.startsWith('+') ? <FiTrendingUp /> : <FiTrendingDown />}
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
  );
};

export default OverviewCards;