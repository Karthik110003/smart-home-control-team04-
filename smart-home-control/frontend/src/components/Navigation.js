import React from 'react';
import '../styles/Navigation.css';

const Navigation = ({ currentPage, onPageChange }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-title">🏠 Smart Home Control Center</h1>
        <ul className="nav-menu">
          <li>
            <button className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`} onClick={() => onPageChange('dashboard')}>Dashboard</button>
          </li>
          <li>
            <button className={`nav-link ${currentPage === 'scenes' ? 'active' : ''}`} onClick={() => onPageChange('scenes')}>Scenes</button>
          </li>
          <li>
            <button className={`nav-link ${currentPage === 'automations' ? 'active' : ''}`} onClick={() => onPageChange('automations')}>Automations</button>
          </li>
          <li>
            <button className={`nav-link ${currentPage === 'energy' ? 'active' : ''}`} onClick={() => onPageChange('energy')}>Energy</button>
          </li>
          <li>
            <button className={`nav-link ${currentPage === 'notifications' ? 'active' : ''}`} onClick={() => onPageChange('notifications')}>Notifications</button>
          </li>
          <li>
            <button className={`nav-link ${currentPage === 'settings' ? 'active' : ''}`} onClick={() => onPageChange('settings')}>Settings</button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
