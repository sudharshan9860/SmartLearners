// FilterBar.jsx
import React from 'react';
import './FilterBar.css';
import { FiFilter, FiChevronDown } from 'react-icons/fi';

const FilterBar = ({ filters, onFilterChange }) => {
  // Define the hierarchical filter structure
  const filterStructure = {
    schools: ['All Schools', 'A School', 'Montessori'],
    blocks: {
      'All Schools': ['All Blocks'],
      'A School': ['All Blocks', 'Pragna'],
      'Montessori': ['All Blocks', 'Minds', 'Indus', 'Montee']
    },
    classes: {
      'All Blocks': ['All Classes'],
      'Pragna': ['All Classes', '8', '9'],
      'Minds': ['All Classes', '9'],
      'Indus': ['All Classes', '8'],
      'Montee': ['All Classes', '8', '9']
    },
    sections: {
      'All Classes': ['All Sections'],
      'Pragna_8': ['All Sections', 'Akash'],
      'Pragna_9': ['All Sections', 'Agni'],
      'Minds_9': ['All Sections', 'M2'],
      'Indus_8': ['All Sections', 'LB2'],
      'Montee_8': ['All Sections', '8-MEL3'],
      'Montee_9': ['All Sections', '9-MEL3']
    }
  };

  // Get available options based on current selections
  const getBlockOptions = () => {
    return filterStructure.blocks[filters.school] || ['All Blocks'];
  };

  const getClassOptions = () => {
    return filterStructure.classes[filters.schoolBlock] || ['All Classes'];
  };

  const getSectionOptions = () => {
    const key = filters.schoolBlock === 'All Blocks' || filters.class === 'All Classes' 
      ? 'All Classes' 
      : `${filters.schoolBlock}_${filters.class}`;
    return filterStructure.sections[key] || ['All Sections'];
  };

  // Handle school change
  const handleSchoolChange = (value) => {
    onFilterChange('school', value);
    // Reset dependent filters
    onFilterChange('schoolBlock', 'All Blocks');
    onFilterChange('class', 'All Classes');
    onFilterChange('section', 'All Sections');
  };

  // Handle block change
  const handleBlockChange = (value) => {
    onFilterChange('schoolBlock', value);
    // Reset dependent filters
    onFilterChange('class', 'All Classes');
    onFilterChange('section', 'All Sections');
  };

  // Handle class change
  const handleClassChange = (value) => {
    onFilterChange('class', value);
    // Reset section
    onFilterChange('section', 'All Sections');
  };

  const handleApplyFilters = () => {
    // Trigger any additional actions when filters are applied
    console.log('Filters applied:', filters);
    
    // Check if all required filters are selected
    if (filters.school !== 'All Schools' && 
        filters.schoolBlock !== 'All Blocks' && 
        filters.class !== 'All Classes' && 
        filters.section !== 'All Sections') {
      // All filters are selected, data will load in TeacherAction component
      console.log('Loading teacher data for:', filters);
    }
  };

  return (
    <div className="filter-bar">
      <div className="filter-header">
        <div className="filter-title">
          <FiFilter className="filter-icon" />
          <h3>Select Filters to View Teacher Details</h3>
        </div>
        {filters.school !== 'All Schools' && 
         filters.schoolBlock !== 'All Blocks' && 
         filters.class !== 'All Classes' && 
         filters.section !== 'All Sections' && (
          <div className="filter-status">
            {/* <span className="status-badge success">✓ All filters selected</span> */}
          </div>
        )}
      </div>
      
      <div className="filters-grid">
        <div className="filter-item">
          <label className="filter-label">School</label>
          <div className="select-wrapper">
            <select 
              className="filter-select"
              value={filters.school}
              onChange={(e) => handleSchoolChange(e.target.value)}
            >
              {filterStructure.schools.map(school => (
                <option key={school} value={school}>{school}</option>
              ))}
            </select>
            <FiChevronDown className="select-icon" />
          </div>
        </div>

        <div className="filter-item">
          <label className="filter-label">School Block</label>
          <div className="select-wrapper">
            <select 
              className="filter-select"
              value={filters.schoolBlock}
              onChange={(e) => handleBlockChange(e.target.value)}
              disabled={filters.school === 'All Schools'}
            >
              {getBlockOptions().map(block => (
                <option key={block} value={block}>{block}</option>
              ))}
            </select>
            <FiChevronDown className="select-icon" />
          </div>
        </div>

        <div className="filter-item">
          <label className="filter-label">Class</label>
          <div className="select-wrapper">
            <select 
              className="filter-select"
              value={filters.class}
              onChange={(e) => handleClassChange(e.target.value)}
              disabled={filters.schoolBlock === 'All Blocks'}
            >
              {getClassOptions().map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
            <FiChevronDown className="select-icon" />
          </div>
        </div>

        <div className="filter-item">
          <label className="filter-label">Section</label>
          <div className="select-wrapper">
            <select 
              className="filter-select"
              value={filters.section}
              onChange={(e) => onFilterChange('section', e.target.value)}
              disabled={filters.class === 'All Classes'}
            >
              {getSectionOptions().map(section => (
                <option key={section} value={section}>{section}</option>
              ))}
            </select>
            <FiChevronDown className="select-icon" />
          </div>
        </div>

        <button 
          className="apply-filters-btn"
          onClick={handleApplyFilters}
          disabled={
            filters.school === 'All Schools' || 
            filters.schoolBlock === 'All Blocks' || 
            filters.class === 'All Classes' || 
            filters.section === 'All Sections'
          }
        >
          <FiFilter />
          Apply Filters
        </button>
      </div>

      <div className="filter-info">
        <div className="filter-path">
          {filters.school !== 'All Schools' && (
            <>
              <span className="path-item">{filters.school}</span>
              {filters.schoolBlock !== 'All Blocks' && (
                <>
                  <span className="path-separator">→</span>
                  <span className="path-item">{filters.schoolBlock}</span>
                </>
              )}
              {filters.class !== 'All Classes' && (
                <>
                  <span className="path-separator">→</span>
                  <span className="path-item">Class {filters.class}</span>
                </>
              )}
              {filters.section !== 'All Sections' && (
                <>
                  <span className="path-separator">→</span>
                  <span className="path-item">Section {filters.section}</span>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;