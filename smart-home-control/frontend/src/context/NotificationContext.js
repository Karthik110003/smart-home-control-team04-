import React, { createContext, useState, useCallback } from 'react';

export const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Device Added',
      message: 'Living Room Light has been successfully added',
      timestamp: new Date(),
      read: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'High Energy Usage',
      message: 'Your AC unit is consuming more power than usual',
      timestamp: new Date(Date.now() - 3600000),
      read: false
    },
    {
      id: 3,
      type: 'info',
      title: 'Automation Active',
      message: 'Morning Routine automation has been activated',
      timestamp: new Date(Date.now() - 7200000),
      read: true
    }
  ]);

  const [activeScenes, setActiveScenes] = useState(() => {
    const savedScenes = localStorage.getItem('activeScenes');
    return savedScenes ? JSON.parse(savedScenes) : [];
  });

  const addNotification = useCallback((notification) => {
    const id = Date.now();
    const newNotif = {
      id,
      timestamp: new Date(),
      read: false,
      ...notification
    };
    setNotifications(prev => [newNotif, ...prev]);
    return id;
  }, []);

  const clearNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const activateScene = useCallback((scene) => {
    let isActivating = false;
    setActiveScenes(prev => {
      let newScenes;
      // Check if scene already active
      if (prev.find(s => s.id === scene.id)) {
        // Deactivating
        newScenes = prev.filter(s => s.id !== scene.id);
        isActivating = false;
      } else {
        // Activating
        newScenes = [...prev, scene];
        isActivating = true;
      }
      // Save to localStorage
      localStorage.setItem('activeScenes', JSON.stringify(newScenes));
      return newScenes;
    });

    // Add notification for scene activation/deactivation
    addNotification({
      type: isActivating ? 'success' : 'info',
      title: isActivating ? '🎬 Mode Activated' : '⏹️ Mode Deactivated',
      message: isActivating 
        ? `${scene.name} - Mode Activated`
        : `${scene.name} - Mode Deactivated`,
    });
  }, [addNotification]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        clearNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        activeScenes,
        activateScene
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}
