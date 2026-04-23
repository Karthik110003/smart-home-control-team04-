import React, { useState, useEffect } from 'react';
import { sceneService } from '../services/api';
import { deviceService } from '../services/api';
import { useNotifications } from '../context/NotificationContext';
import '../styles/Scenes.css';

function Scenes() {
  const { activateScene, activeScenes } = useNotifications();
  const [scenes, setScenes] = useState([]);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    icon: '🎬',
    color: '#007bff',
    devices: []
  });

  useEffect(() => {
    fetchScenes();
    fetchDevices();
  }, []);

  const fetchScenes = async () => {
    try {
      setLoading(true);
      const res = await sceneService.getAllScenes();
      setScenes(res.data.data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching scenes:', err);
      setError('Failed to load scenes');
    } finally {
      setLoading(false);
    }
  };

  const fetchDevices = async () => {
    try {
      const res = await deviceService.getAllDevices();
      setDevices(res.data.data || []);
    } catch (err) {
      console.error('Error fetching devices:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await sceneService.deleteScene(id);
      setScenes(scenes.filter(s => s._id !== id));
    } catch (err) {
      console.error('Error deleting scene:', err);
      setError('Failed to delete scene');
    }
  };

  const handleActivateScene = (scene) => {
    activateScene(scene);
    setPopupMessage(`${scene.icon} ${scene.name} - Mode Activated`);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };

  const handleDeactivateScene = (scene) => {
    activateScene(scene);
    setPopupMessage(`${scene.icon} ${scene.name} - Mode Deactivated`);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };

  const handleAddScene = async (e) => {
    e.preventDefault();
    try {
      const res = await sceneService.addScene(formData);
      setScenes([...scenes, res.data.data]);
      setFormData({
        name: '',
        icon: '🎬',
        color: '#007bff',
        devices: []
      });
      setShowForm(false);
    } catch (err) {
      console.error('Error adding scene:', err);
      setError('Failed to add scene');
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDeviceToggle = (deviceId) => {
    setFormData(prev => {
      const devices = prev.devices.includes(deviceId)
        ? prev.devices.filter(d => d !== deviceId)
        : [...prev.devices, deviceId];
      return {
        ...prev,
        devices
      };
    });
  };

  const predefinedScenes = [
    { name: 'Good Morning', icon: '🌅', color: '#FFD700' },
    { name: 'Movie Night', icon: '🎬', color: '#1a1a1a' },
    { name: 'Away Mode', icon: '🚪', color: '#FF6B6B' },
    { name: 'Bedtime', icon: '🛏️', color: '#4A90E2' },
    { name: 'Party Mode', icon: '🎉', color: '#FF1493' },
    { name: 'Energy Saver', icon: '⚡', color: '#2ECC71' }
  ];

  return (
    <div className="scenes-page">
      <div className="scenes-header">
        <h1>🎬 Scenes</h1>
        <button
          className="btn-add-scene"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ New Scene'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="scene-form">
          <h2>Create New Scene</h2>
          <form onSubmit={handleAddScene}>
            <div className="form-group">
              <label>Scene Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="e.g., Relaxation Mode"
                required
              />
            </div>
            <div className="form-group">
              <label>Icon</label>
              <input
                type="text"
                name="icon"
                value={formData.icon}
                onChange={handleFormChange}
                placeholder="e.g., 🎬"
                maxLength="2"
              />
            </div>
            <div className="form-group">
              <label>Color</label>
              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleFormChange}
              />
            </div>
            <div className="form-group">
              <label>Devices in this Scene</label>
              <div className="devices-checklist">
                {devices.map(device => (
                  <label key={device._id} className="device-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.devices.includes(device._id)}
                      onChange={() => handleDeviceToggle(device._id)}
                    />
                    <span>{device.label || device.device_type} ({device.room_location})</span>
                  </label>
                ))}
              </div>
            </div>
            <button type="submit" className="btn-submit">Create Scene</button>
          </form>
        </div>
      )}

      {loading ? (
        <p>Loading scenes...</p>
      ) : scenes.length === 0 ? (
        <div className="empty-state">
          <p>No custom scenes yet. Create one or try these presets:</p>
          <div className="preset-scenes">
            {predefinedScenes.map((scene, idx) => (
              <div key={idx} className="preset-scene-card">
                <div className="preset-icon">{scene.icon}</div>
                <p className="preset-name">{scene.name}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="scenes-grid">
          {scenes.map(scene => {
            const isActive = activeScenes.find(s => s._id === scene._id);
            return (
              <div key={scene._id} className="scene-card" style={{ borderTopColor: scene.color }}>
                <div className="scene-icon">{scene.icon}</div>
                <h3>{scene.name}</h3>
                <p className="device-count">{scene.devices?.length || 0} devices</p>
                <div className="scene-card-actions">
                  {!isActive ? (
                    <button
                      className="btn-activate"
                      onClick={() => handleActivateScene(scene)}
                    >
                      Activate
                    </button>
                  ) : (
                    <button
                      className="btn-deactivate"
                      onClick={() => handleDeactivateScene(scene)}
                    >
                      Deactivate
                    </button>
                  )}
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(scene._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showPopup && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#fff',
          padding: '20px 40px',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          zIndex: 1000,
          textAlign: 'center',
          animation: 'slideDown 0.3s ease-out',
          fontSize: '18px',
          fontWeight: '600',
          color: '#2563eb'
        }}>
          {popupMessage}
        </div>
      )}
    </div>
  );
}

export default Scenes;
