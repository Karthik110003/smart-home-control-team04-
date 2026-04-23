import React, { useState } from 'react';
import '../styles/Header.css';
import { useNotifications } from '../context/NotificationContext';

function Header({ user, onLogout, setPage, devices = [] }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const { notifications, activeScenes } = useNotifications();

  const unreadCount = notifications.filter(n => !n.read).length;
  const activeDevices = devices.filter(d => d.status === 'on' || d.status === true).length;
  const sceneCount = activeScenes.length;

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="header-container">
      <div className="header-left">
        <h1 className="header-title">SmartHome</h1>
      </div>
      
      <div className="header-right">
        <div className="header-stats">
          <div className="stat-badge">
            <span className="stat-icon">⚡</span>
            <span className="stat-text">{activeDevices} Active Devices</span>
          </div>
          <div className="stat-badge">
            <span className="stat-icon">🌡️</span>
            <span className="stat-text">{devices.length} Total Devices</span>
          </div>
          <div className="stat-badge">
            <span className="stat-icon">🎬</span>
            <span className="stat-text">{sceneCount} Active Scenes</span>
          </div>
        </div>

        <div className="header-actions">
          <button 
            className="header-btn notification-btn"
            onClick={() => setPage('notifications')}
            title="View notifications"
          >
            <span className="bell-icon">🔔</span>
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </button>
          <button 
            className="header-btn settings-btn"
            onClick={() => setPage('settings')}
            title="Go to settings"
          >
            ⚙️
          </button>
          <div className="user-profile" onClick={() => setShowDropdown(!showDropdown)}>
            <div className="user-avatar">{getUserInitials(user?.name)}</div>
            <div className="user-info">
              <p className="user-name">{user?.name || 'User'}</p>
              <p className="user-plan">{user?.email || 'user@example.com'}</p>
            </div>
            {showDropdown && (
              <div className="user-dropdown">
                <button className="dropdown-item logout-btn" onClick={onLogout}>
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;