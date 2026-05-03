import React from 'react';
import '../styles/Sidebar.css';

function Sidebar({ setPage }) {
  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'scenes', label: 'Scenes', icon: '🎬' },
    { id: 'automations', label: 'Automations', icon: '⚙️' },
    { id: 'energy', label: 'Energy', icon: '⚡' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'team', label: 'Team Management', icon: '👥' }
  ];

return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-icon">🏠</span>
        <span className="logo-text">SmartHome</span>
      </div>

      <nav className="sidebar-nav">
        {navigation.map(item => (
          <button
            key={item.id}
            className="nav-item"
            onClick={() => setPage(item.id)}
            title={item.label}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="manage-rooms-btn" onClick={() => setPage('rooms')}>
          🏠 Manage Rooms
        </button>
        <button className="add-member-btn" onClick={() => setPage('add-member')}>
          👥 Add Member
        </button>
        <button className="add-device-btn" onClick={() => setPage('add')}>
          + Add Device
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;