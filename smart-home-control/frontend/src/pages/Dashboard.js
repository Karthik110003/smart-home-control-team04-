import React, { useState, useEffect, useCallback } from 'react';
import '../styles/Dashboard.css';
import { useNotifications } from '../context/NotificationContext';
import { sceneService } from '../services/api';

function Dashboard({ devices, toggle, deleteDevice, setPage }) {
  const { addNotification, activeScenes, activateScene } = useNotifications();
  const [sceneCount, setSceneCount] = useState(0);
  const [quickScenes, setQuickScenes] = useState([]);
  const [accountRooms, setAccountRooms] = useState([]);
  const [banner, setBanner] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomDevices, setRoomDevices] = useState([]);

  // Log when devices change
  useEffect(() => {
    console.log('Dashboard received devices:', devices);
  }, [devices]);

  // Group devices by room
  const groupByRoom = () => {
    const rooms = {};
    devices.forEach(d => {
      const room = d.room_location || 'Other';
      if (!rooms[room]) rooms[room] = [];
      rooms[room].push(d);
    });
    return rooms;
  };

  const rooms = groupByRoom();
  const activeDevices = devices.filter(d => d.status).length;

  // Load account rooms
  useEffect(() => {
    const loadRooms = () => {
      const currentAccount = localStorage.getItem('currentAccount');
      console.log('Dashboard loadRooms: currentAccount from localStorage:', currentAccount);
      
      let accountId = 'default';
      
      if (currentAccount) {
        try {
          const account = JSON.parse(currentAccount);
          accountId = account.id || account.email;
          console.log('Dashboard loadRooms: parsed accountId:', accountId);
        } catch (err) {
          console.error('Error parsing account:', err);
        }
      }

      const storedRooms = localStorage.getItem(`accountRooms_${accountId}`);
      console.log('Dashboard loadRooms: looking for key:', `accountRooms_${accountId}`, 'found:', storedRooms);
      
      if (storedRooms) {
        try {
          const parsedRooms = JSON.parse(storedRooms);
          console.log('Dashboard loaded rooms:', parsedRooms, 'for account:', accountId);
          setAccountRooms(parsedRooms);
        } catch (err) {
          console.error('Error loading rooms:', err);
          setAccountRooms([]);
        }
      } else {
        console.log('No rooms found for account:', accountId);
        setAccountRooms([]);
      }
    };

    loadRooms();

    // Listen for storage changes (for different tabs)
    const handleStorageChange = (e) => {
      if (e.key && e.key.includes('accountRooms_')) {
        console.log('Dashboard: Storage change detected for rooms:', e.key);
        loadRooms();
      }
    };

    // Listen for custom room update events (same tab)
    const handleRoomsUpdated = (event) => {
      console.log('Dashboard: Rooms updated event received:', event.detail);
      loadRooms();
    };

    // Listen for account change events
    const handleAccountChanged = (event) => {
      console.log('Dashboard: Account changed event received:', event.detail);
      loadRooms();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('roomsUpdated', handleRoomsUpdated);
    window.addEventListener('accountChanged', handleAccountChanged);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('roomsUpdated', handleRoomsUpdated);
      window.removeEventListener('accountChanged', handleAccountChanged);
    };
  }, []);

  // Fetch scenes from backend
  useEffect(() => {
    fetchScenes();
  }, []);

  const fetchScenes = async () => {
    try {
      const res = await sceneService.getAllScenes();
      setQuickScenes(res.data.data || []);
    } catch (err) {
      console.error('Error fetching scenes:', err);
    }
  };

  // Update scene count when active scenes change
  useEffect(() => {
    setSceneCount(activeScenes.length);
  }, [activeScenes]);

  const handleSceneClick = useCallback((scene) => {
    // Apply devices in this scene - toggle them on
    if (scene.devices && scene.devices.length > 0) {
      scene.devices.forEach(deviceId => {
        const device = devices.find(d => d._id === deviceId);
        if (device && !device.status) {
          toggle(deviceId, true);
        }
      });
    }
    
    // Check if scene is already active
    const isActive = activeScenes.find(s => s.id === scene.id);
    
    // Show banner notification
    if (isActive) {
      setBanner({
        type: 'deactivate',
        message: `⏹️ ${scene.name} scene deactivated`,
        icon: '⏹️'
      });
    } else {
      setBanner({
        type: 'activate',
        message: `🎬 ${scene.name} scene activated`,
        icon: '🎬'
      });
    }
    
    // Auto-hide banner after 3 seconds
    setTimeout(() => {
      setBanner(null);
    }, 3000);
    
    activateScene(scene);
  }, [activateScene, devices, toggle, activeScenes]);

  const handleToggleDevice = useCallback((id, currentStatus) => {
    const device = devices.find(d => d._id === id);
    if (device) {
      const newStatus = !currentStatus;
      toggle(id, newStatus);
      
      // Add notification
      addNotification({
        type: newStatus ? 'success' : 'info',
        title: `${device.label || device.device_type} ${newStatus ? 'Turned ON' : 'Turned OFF'}`,
        message: `${device.label || device.device_type} in ${device.room_location || 'Unknown'} has been ${newStatus ? 'turned on' : 'turned off'}`,
      });
    }
  }, [devices, toggle, addNotification]);

  const handleRoomClick = (room) => {
    const filteredDevices = rooms[room] || [];
    setSelectedRoom(room);
    setRoomDevices(filteredDevices);
  };

  return (
    <div className="dashboard-page">
      {/* Scene Notification Banner */}
      {banner && (
        <div className={`scene-banner scene-banner-${banner.type}`}>
          <span className="banner-icon">{banner.icon}</span>
          <span className="banner-message">{banner.message}</span>
          <button 
            className="banner-close" 
            onClick={() => setBanner(null)}
          >
            ✕
          </button>
        </div>
      )}
      
      {/* Add Device Button */}
      <div className="dashboard-toolbar">
        <button className="btn-add-device" onClick={() => setPage('add')}>
          ➕ Add Device
        </button>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon">⚙️</div>
          <div className="card-content">
            <h3 className="card-title">Active Devices</h3>
            <p className="card-value">{activeDevices}</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="card-icon">🌡️</div>
          <div className="card-content">
            <h3 className="card-title">Temperature</h3>
            <p className="card-value">72°F</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="card-icon">🎬</div>
          <div className="card-content">
            <h3 className="card-title">Active Scenes</h3>
            <p className="card-value">{sceneCount}</p>
          </div>
        </div>
      </div>

      {/* Quick Scenes */}
      <div className="section">
        <div className="section-header">
          <h2>Quick Scenes</h2>
          <button className="view-all-btn" onClick={() => setPage('scenes')}>View All</button>
        </div>
        <div className="quick-scenes">
          {quickScenes && quickScenes.length > 0 ? (
            quickScenes.map(scene => (
              <div 
                key={scene.id}
                className="scene-card"
                onClick={() => handleSceneClick(scene)}
              >
                <div className="scene-icon">{scene.icon}</div>
                <p className="scene-name">{scene.name}</p>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No scenes available. Create one in the Scenes section.</p>
            </div>
          )}
        </div>
      </div>

      {/* Rooms Section */}
      <div className="section">
        <div className="section-header">
          <h2>Rooms</h2>
          <button className="view-all-btn" onClick={() => setPage('settings')}>Manage Rooms</button>
        </div>
        <div className="rooms-grid">
          {accountRooms && accountRooms.length > 0 ? (
            accountRooms.map(room => {
              const roomDevicesLocal = rooms[room] || [];
              return (
                <div 
                  key={room} 
                  className="room-card" 
                  onClick={() => handleRoomClick(room)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="room-icon">🏠</div>
                  <div className="room-info">
                    <h3 className="room-name">{room}</h3>
                    <p className="room-device-count">{roomDevicesLocal.length} devices</p>
                  </div>
                  <span className="room-arrow">→</span>
                </div>
              );
            })
          ) : (
            <div className="empty-state">
              <p>No rooms configured. Go to Settings to add rooms.</p>
            </div>
          )}
        </div>
      </div>

      {/* All Devices */}
      <div className="section">
        <div className="section-header">
          <h2>All Devices</h2>
          <button className="view-all-btn" onClick={() => setPage('add')}>Add Device</button>
        </div>
        <div className="devices-grid">
          {devices && devices.length > 0 ? (
            devices.map(device => (
              <div key={device._id} className="device-card">
                <div className="device-card-header">
                  <div className="device-card-top">
                    <span className="device-icon">{getDeviceIcon(device.device_type)}</span>
                    <h4 className="device-name">{device.label || device.device_type}</h4>
                  </div>
                  <button
                    className={`device-status ${device.status ? 'active' : 'inactive'}`}
                    onClick={() => handleToggleDevice(device._id, device.status)}
                  >
                    {device.status ? 'ON' : 'OFF'}
                  </button>
                </div>
                
                <div className="device-details">
                  <div className="device-detail-row">
                    <span className="detail-label">Type:</span>
                    <span className="detail-value">{(device.device_type || 'Unknown').toUpperCase()}</span>
                  </div>
                  <div className="device-detail-row">
                    <span className="detail-label">Room:</span>
                    <span className="detail-value">{device.room_location || 'Unknown'}</span>
                  </div>
                  <div className="device-detail-row">
                    <span className="detail-label">Power:</span>
                    <span className="detail-value">{device.power_consumption || 0}W</span>
                  </div>
                  <div className="device-detail-row">
                    <span className="detail-label">Usage:</span>
                    <span className="detail-value">{device.usage_hours || 0}h</span>
                  </div>
                </div>
                
                <button
                  className="remove-btn"
                  onClick={() => deleteDevice(device._id)}
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No devices added yet. Click "Add Device" to get started!</p>
            </div>
          )}
        </div>
      </div>

      {/* Room Details Modal */}
      {selectedRoom && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }} onClick={() => setSelectedRoom(null)}>
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            animation: 'slideUp 0.3s ease-out'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{
                margin: 0,
                fontSize: '24px',
                fontWeight: '600',
                color: '#1e293b'
              }}>🏠 {selectedRoom}</h2>
              <button 
                onClick={() => setSelectedRoom(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '28px',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ✕
              </button>
            </div>

            {roomDevices.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '12px'
              }}>
                {roomDevices.map(device => (
                  <div 
                    key={device._id}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <p style={{
                        margin: '0 0 4px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#1e293b'
                      }}>{device.label || device.device_type}</p>
                      <p style={{
                        margin: 0,
                        fontSize: '12px',
                        color: '#64748b'
                      }}>Type: {device.device_type}</p>
                    </div>
                    <button
                      onClick={() => handleToggleDevice(device._id, device.status)}
                      style={{
                        background: device.status ? '#10b981' : '#ef4444',
                        color: '#fff',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                      }}
                    >
                      {device.status ? 'ON' : 'OFF'}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{
                textAlign: 'center',
                color: '#64748b',
                padding: '20px'
              }}>No devices in this room</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function getDeviceIcon(type) {
  const icons = {
    light: '💡',
    fan: '🌀',
    ac: '❄️',
    camera: '📷',
    sensor: '📊',
    thermostat: '🌡️',
    door: '🚪',
    plug: '🔌',
    switch: '🔘'
  };
  return icons[type] || '⚙️';
}

export default Dashboard;