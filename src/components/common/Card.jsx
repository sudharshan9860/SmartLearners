// Card.jsx
import React from 'react';
import './Common.css';

const Card = ({ 
  title, 
  children, 
  icon, 
  className = '', 
  headerAction,
  gradient = false 
}) => {
  return (
    <div className={`custom-card ${className} ${gradient ? 'gradient-card' : ''}`}>
      {(title || icon || headerAction) && (
        <div className="card-header">
          <div className="card-title-wrapper">
            {icon && <span className="card-icon">{icon}</span>}
            {title && <h3 className="card-title">{title}</h3>}
          </div>
          {headerAction && <div className="card-action">{headerAction}</div>}
        </div>
      )}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};

export default Card;