import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar/Sidebar';
import Overview from './components/Overview/Overview';
import StudentActivity from './components/StudentActivity/StudentActivity';
import TeacherAction from './components/TeacherAction/TeacherAction';
import AIAssistant from './components/AIAssistant/AIAssistant';
import SchoolAnalytics from './components/SchoolAnalytics/SchoolAnalytics';
import Header from './components/common/Header';
import ApiService from './services/apiService';
import TestConnection from './components/TestConnection';


function App() {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
const [apiHealth, setApiHealth] = useState(null); // 'healthy' | 'unhealthy' | null
  const [filters, setFilters] = useState({
    school: 'All Schools',
    schoolBlock: 'All Blocks',
    class: 'All Classes',
    section: 'All Sections'
  });

  useEffect(() => {
    // Check API health on mount
    checkAPIHealth();
  }, []);

  const checkAPIHealth = async () => {
  try {
    const health = await ApiService.getHealth(); // returns {status: 'healthy'|'unhealthy', ...}
    setApiHealth(health.status);
  } catch (error) {
    console.error('API Health Check Failed:', error);
    setApiHealth('unhealthy');
  }
};

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const renderSection = () => {
  const apiHealthy = apiHealth === 'healthy';
  switch (activeSection) {
    case 'overview':
      return <Overview apiHealthy={apiHealthy} filters={filters} />;
    case 'studentActivity':
      return <StudentActivity apiHealthy={apiHealthy} filters={filters} />;
    case 'teacherAction':
      return <TeacherAction apiHealthy={apiHealthy} filters={filters} />;
    case 'aiAssistant':
        return <AIAssistant apiHealthy={apiHealthy} filters={filters} />;
      case 'schoolAnalytics':
        return <SchoolAnalytics apiHealthy={apiHealthy} filters={filters} />;
      default:
        return <Overview apiHealthy={apiHealthy} filters={filters} />;
    }
  };

  const showFilterBar = activeSection === 'teacherAction';

  <button 
  className="menu-toggle" 
  onClick={() => setSidebarOpen(!sidebarOpen)}
  style={{ display: window.innerWidth <= 768 ? 'block' : 'none' }}
>
  ☰
</button>

  return (
    <div className="App">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="main-content">
        <Header title="SmartLearners.ai - Live Analytics Dashboard" />
        
        {/* API Status Indicator */}
        {apiHealth && (
          <div className={`api-status ${apiHealth}`}>
            <span className="status-dot"></span>
            API Status: {apiHealth === 'healthy' ? 'Connected' : 'Disconnected'}
          </div>
        )}
        
        <div className="content-wrapper">
          {renderSection()}
        </div>
      </div>
    </div>
  );
}

export default App;