// Sidebar.jsx
import React, { useState } from 'react';
import './Sidebar.css';
import { 
  FiGrid, 
  FiActivity, 
  FiUsers, 
  FiMessageSquare, 
  FiBarChart2,
  FiMenu,
  FiX,
  FiHome,
  FiSettings
} from 'react-icons/fi';

const Sidebar = ({ activeSection, onSectionChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const menuItems = [
    {
      id: 'overview',
      title: 'Overview',
      icon: <FiGrid />,
      color: '#667eea'
    },
    {
      id: 'studentActivity',
      title: 'Student Activity Details',
      icon: <FiActivity />,
      color: '#48bb78'
    },
    {
      id: 'teacherAction',
      title: 'Teacher Action Details',
      icon: <FiUsers />,
      color: '#f6ad55'
    },
    {
      id: 'aiAssistant',
      title: 'Ask AI Assistant',
      icon: <FiMessageSquare />,
      color: '#4299e1'
    },
    {
      id: 'schoolAnalytics',
      title: 'School Analytics',
      icon: <FiBarChart2 />,
      color: '#f56565'
    }
  ];

  const handleToggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div 
      className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo">
            <span className="logo-icon">🎓</span>
            {(!isCollapsed || isHovered) && (
              <span className="logo-text">SmartLearners</span>
            )}
          </div>
        </div>
        <button 
          className="toggle-btn"
          onClick={handleToggleSidebar}
        >
          {isCollapsed ? <FiMenu /> : <FiX />}
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => onSectionChange(item.id)}
                style={{ 
                  '--item-color': item.color,
                  '--item-bg': `${item.color}20`
                }}
              >
                <span className="nav-icon">{item.icon}</span>
                {(!isCollapsed || isHovered) && (
                  <span className="nav-text">{item.title}</span>
                )}
                {activeSection === item.id && (
                  <span className="active-indicator"></span>
                )}
              </button>
            </li>
          ))}
        </ul>

        {/* <div className="sidebar-footer">
          <button className="nav-item">
            <span className="nav-icon"><FiHome /></span>
            {(!isCollapsed || isHovered) && (
              <span className="nav-text">Dashboard</span>
            )}
          </button>
          <button className="nav-item">
            <span className="nav-icon"><FiSettings /></span>
            {(!isCollapsed || isHovered) && (
              <span className="nav-text">Settings</span>
            )}
          </button>
        </div> */}
      </nav>

      {/* <div className="sidebar-user">
        <div className="user-avatar">👤</div>
        {(!isCollapsed || isHovered) && (
          <div className="user-info">
            <p className="user-name">Admin User</p>
            <p className="user-role">System Administrator</p>
          </div>
        )}
      </div> */}
    </div>
  );
};

export default Sidebar;