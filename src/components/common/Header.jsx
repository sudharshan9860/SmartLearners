// Header.jsx
import React from 'react';
import './Common.css';
import { FiBell, FiSearch, FiSettings } from 'react-icons/fi';

const Header = ({ title }) => {
  return (
    <header className="app-header">
      <div className="header-content">
        <h1 className="header-title">{title}</h1>
        <p className="header-subtitle">Detailed insights into student engagement and teacher effectiveness across schools</p>
      </div>
      <div className="header-actions">
        <button className="header-btn">
          <FiSearch />
        </button>
        <button className="header-btn notification-btn">
          <FiBell />
          <span className="notification-badge">5</span>
        </button>
        <button className="header-btn">
          <FiSettings />
        </button>
      </div>
    </header>
  );
};

export default Header;

