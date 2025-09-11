// FilterBar.jsx
import React from 'react';
import './Common.css';
import { FiCalendar, FiFilter } from 'react-icons/fi';
import { schoolsList, blocksList, classList, sectionList } from '../../data/mockData';

const FilterBar = ({ filters, onFilterChange }) => {
  const handleFilterChange = (filterName, value) => {
    if (onFilterChange) {
      onFilterChange({
        ...filters,
        [filterName]: value
      });
    }
  };

  return (
    <div className="filter-bar">
      <div className="filters-container">
        <div className="filter-group">
          <label className="filter-label">School</label>
          <select 
            className="filter-select" 
            value={filters?.school || 'All Schools'}
            onChange={(e) => handleFilterChange('school', e.target.value)}
          >
            {schoolsList.map(school => (
              <option key={school} value={school}>{school}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label className="filter-label">School Block</label>
          <select 
            className="filter-select" 
            value={filters?.schoolBlock || 'All Blocks'}
            onChange={(e) => handleFilterChange('schoolBlock', e.target.value)}
          >
            {blocksList.map(block => (
              <option key={block} value={block}>{block}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label className="filter-label">Class</label>
          <select 
            className="filter-select" 
            value={filters?.class || 'All Classes'}
            onChange={(e) => handleFilterChange('class', e.target.value)}
          >
            {classList.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label className="filter-label">Section</label>
          <select 
            className="filter-select" 
            value={filters?.section || 'All Sections'}
            onChange={(e) => handleFilterChange('section', e.target.value)}
          >
            {sectionList.map(section => (
              <option key={section} value={section}>{section}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label className="filter-label">Date</label>
          <div className="date-input-wrapper">
            <FiCalendar className="date-icon" />
            <input 
              type="date" 
              className="filter-date" 
              value={filters?.date || new Date().toISOString().split('T')[0]}
              onChange={(e) => handleFilterChange('date', e.target.value)}
            />
          </div>
        </div>
        
        <button className="filter-apply-btn">
          <FiFilter />
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterBar;