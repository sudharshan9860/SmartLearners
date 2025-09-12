import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar/Sidebar';
import Overview from './components/Overview/Overview';
import StudentActivity from './components/StudentActivity/StudentActivity';
import TeacherAction from './components/TeacherAction/TeacherAction';
import AIAssistant from './components/AIAssistant/AIAssistant';
import SchoolAnalytics from './components/SchoolAnalytics/SchoolAnalytics';
import Header from './components/common/Header';
import FilterBar from './components/common/FilterBar';

function App() {
  const [activeSection, setActiveSection] = useState('overview');
  const [filters, setFilters] = useState({
    school: 'All Schools',
    schoolBlock: 'All Blocks',
    class: 'All Classes',
    section: 'All Sections'
  });

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <Overview filters={filters} />;
      case 'studentActivity':
        return <StudentActivity filters={filters} />;
      case 'teacherAction':
        return <TeacherAction filters={filters} />;
      case 'aiAssistant':
        return <AIAssistant filters={filters} />;
      case 'schoolAnalytics':
        return <SchoolAnalytics filters={filters} />;
      default:
        return <Overview filters={filters} />;
    }
  };

  // Only show filter bar for Teacher Action Details
  const showFilterBar = activeSection === 'teacherAction';

  return (
    <div className="App">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="main-content">
        <Header title="SmartLearners.ai - Comprehensive Analytics Dashboard" />
        {showFilterBar && (
          <FilterBar 
            filters={filters} 
            onFilterChange={handleFilterChange}
          />
        )}
        <div className="content-wrapper">
          {renderSection()}
        </div>
      </div>
    </div>
  );
}

export default App;