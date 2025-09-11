// TopPerformingSchools.jsx
import React from 'react';
import { FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi';

const TopPerformingSchools = ({ schools, selectedSchools, onSchoolSelect }) => {
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

  const handleSchoolClick = (school) => {
    if (selectedSchools.includes(school.school)) {
      onSchoolSelect(selectedSchools.filter(s => s !== school.school));
    } else if (selectedSchools.length < 3) {
      onSchoolSelect([...selectedSchools, school.school]);
    }
  };

  return (
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
        {schools.map((school) => (
          <div 
            key={school.rank}
            className={`table-row ${selectedSchools.includes(school.school) ? 'selected' : ''}`}
            onClick={() => handleSchoolClick(school)}
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
  );
};

export default TopPerformingSchools;