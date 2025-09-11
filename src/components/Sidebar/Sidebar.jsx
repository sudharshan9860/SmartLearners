// Sidebar.jsx
import React, { useState } from 'react';
import './Sidebar.css';
import { 
  FiGrid, 
  FiActivity, 
  FiUsers, 
  FiMessageSquare,
  FiMenu,
  FiX
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
                style={{ '--item-color': item.color }}
              >
                <span className="nav-icon" style={{ color: item.color }}>
                  {item.icon}
                </span>
                {(!isCollapsed || isHovered) && (
                  <span className="nav-text">{item.title}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;