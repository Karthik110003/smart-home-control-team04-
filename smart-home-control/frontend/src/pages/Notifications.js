import React, { useState } from 'react';
import '../styles/Notifications.css';
import { useNotifications } from '../context/NotificationContext';

function Notifications() {
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'

  // Filter notifications based on selected filter
  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleClearAll = () => {
    notifications.forEach(n => deleteNotification(n.id));
  };

  const getNotificationIcon = (type) => {
    const icons = {
      success: '✓',
      warning: '⚠️',
      error: '✕',
      info: 'ℹ'
    };
    return icons[type] || '•';
  };

  const formatTimestamp = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <h1>🔔 Notifications</h1>
        <div className="header-actions">
          {unreadCount > 0 && (
            <button className="btn-mark-all" onClick={markAllAsRead}>
              Mark All as Read ({unreadCount})
            </button>
          )}
          {notifications.length > 0 && (
            <button className="btn-clear-all" onClick={handleClearAll}>
              Clear All
            </button>
          )}
        </div>
      </div>

      {unreadCount > 0 && (
        <div className="unread-badge">
          {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
        </div>
      )}

      <div className="filter-tabs">
        <button 
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({notifications.length})
        </button>
        <button 
          className={`filter-tab ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          Unread ({unreadCount})
        </button>
        <button 
          className={`filter-tab ${filter === 'read' ? 'active' : ''}`}
          onClick={() => setFilter('read')}
        >
          Read ({notifications.filter(n => n.read).length})
        </button>
      </div>

      {filteredNotifications.length === 0 ? (
        <div className="empty-state">
          <p>🎉 No notifications</p>
          <p className="empty-subtitle">
            {filter === 'unread' ? "You're all caught up!" : 'Nothing to show here'}
          </p>
        </div>
      ) : (
        <div className="notifications-list">
          {filteredNotifications.map(notification => (
            <div
              key={notification.id}
              className={`notification-item ${notification.type} ${notification.read ? 'read' : 'unread'}`}
            >
              <div className={`notification-icon notification-${notification.type}`}>
                {getNotificationIcon(notification.type)}
              </div>
              <div className="notification-content">
                <div className="notification-header">
                  <div className="notification-title">{notification.title}</div>
                  <div className="notification-time">
                    {formatTimestamp(notification.timestamp)}
                  </div>
                </div>
                <p className="notification-message">{notification.message}</p>
              </div>
              <div className="notification-actions">
                {!notification.read && (
                  <button
                    className="btn-read"
                    onClick={() => markAsRead(notification.id)}
                    title="Mark as read"
                  >
                    ●
                  </button>
                )}
                <button
                  className="btn-delete"
                  onClick={() => deleteNotification(notification.id)}
                  title="Delete notification"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;
