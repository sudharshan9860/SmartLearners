// useFilter.js
import { useState, useEffect, useCallback } from 'react';

const useFilter = (initialFilters = {}) => {
  const [filters, setFilters] = useState({
    school: 'All Schools',
    schoolBlock: 'All Blocks',
    class: 'All Classes',
    section: 'All Sections',
    date: new Date().toISOString().split('T')[0],
    ...initialFilters
  });
  
  const [filteredData, setFilteredData] = useState(null);
  
  // Update single filter
  const updateFilter = useCallback((filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  }, []);
  
  // Update multiple filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  }, []);
  
  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters({
      school: 'All Schools',
      schoolBlock: 'All Blocks',
      class: 'All Classes',
      section: 'All Sections',
      date: new Date().toISOString().split('T')[0]
    });
  }, []);
  
  // Apply filters to data
  const applyFilters = useCallback((data) => {
    if (!data) return [];
    
    return data.filter(item => {
      // School filter
      if (filters.school !== 'All Schools' && item.school !== filters.school) {
        return false;
      }
      
      // Block filter
      if (filters.schoolBlock !== 'All Blocks' && item.block !== filters.schoolBlock) {
        return false;
      }
      
      // Class filter
      if (filters.class !== 'All Classes' && item.class !== filters.class) {
        return false;
      }
      
      // Section filter
      if (filters.section !== 'All Sections' && item.section !== filters.section) {
        return false;
      }
      
      // Date filter (if item has date)
      if (item.date && filters.date) {
        const itemDate = new Date(item.date).toISOString().split('T')[0];
        if (itemDate !== filters.date) {
          return false;
        }
      }
      
      return true;
    });
  }, [filters]);
  
  // Check if filters are active
  const hasActiveFilters = useCallback(() => {
    return (
      filters.school !== 'All Schools' ||
      filters.schoolBlock !== 'All Blocks' ||
      filters.class !== 'All Classes' ||
      filters.section !== 'All Sections'
    );
  }, [filters]);
  
  return {
    filters,
    updateFilter,
    updateFilters,
    resetFilters,
    applyFilters,
    hasActiveFilters,
    filteredData,
    setFilteredData
  };
};

export default useFilter;