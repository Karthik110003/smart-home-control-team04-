import React, { useState, useEffect } from 'react';
import '../styles/AddDeviceForm.css';
import { useNotifications } from '../context/NotificationContext';

const AddDeviceForm = ({ onAddDevice, onCancel }) => {
  const { addNotification } = useNotifications();
  
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    device_id: '',
    device_type: 'light',
    room_location: '',
    power_consumption: 0,
    usage_hours: 0,
    label: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load rooms for current account
    const currentAccount = localStorage.getItem('currentAccount');
    let accountId = 'default';
    
    if (currentAccount) {
      try {
        const account = JSON.parse(currentAccount);
        accountId = account.id || account.email;
      } catch (err) {
        console.error('Error parsing account:', err);
      }
    }

    const accountRooms = localStorage.getItem(`accountRooms_${accountId}`);
    if (accountRooms) {
      try {
        const parsedRooms = JSON.parse(accountRooms);
        setRooms(parsedRooms);
        // Set the first room as the default
        if (parsedRooms.length > 0) {
          setFormData(prev => ({
            ...prev,
            room_location: parsedRooms[0]
          }));
        }
      } catch (err) {
        console.error('Error loading rooms:', err);
        const defaultRooms = ['Living Room', 'Bedroom', 'Kitchen', 'Store Room'];
        setRooms(defaultRooms);
        setFormData(prev => ({
          ...prev,
          room_location: defaultRooms[0]
        }));
        localStorage.setItem(`accountRooms_${accountId}`, JSON.stringify(defaultRooms));
      }
    } else {
      // Set default rooms for new accounts
      const defaultRooms = ['Living Room', 'Bedroom', 'Kitchen', 'Store Room'];
      setRooms(defaultRooms);
      setFormData(prev => ({
        ...prev,
        room_location: defaultRooms[0]
      }));
      localStorage.setItem(`accountRooms_${accountId}`, JSON.stringify(defaultRooms));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'power_consumption' || name === 'usage_hours' 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.device_id.trim()) {
      setError('Device ID is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onAddDevice(formData);
      
      // Add notification for device addition
      const deviceLabel = formData.label || formData.device_type;
      addNotification({
        type: 'success',
        title: 'Device Added Successfully',
        message: `${deviceLabel} has been added to ${formData.room_location}`,
      });
      
      setFormData({
        device_id: '',
        device_type: 'light',
        room_location: rooms.length > 0 ? rooms[0] : 'Living Room',
        power_consumption: 0,
        usage_hours: 0,
        label: ''
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add device');
      addNotification({
        type: 'error',
        title: 'Failed to Add Device',
        message: err.response?.data?.error || 'An error occurred while adding the device',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-device-form">
      <h2>Add New Device</h2>
      <form onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label>Device ID *</label>
          <input
            type="text"
            name="device_id"
            value={formData.device_id}
            onChange={handleChange}
            placeholder="e.g., device-001"
            required
          />
        </div>

        <div className="form-group">
          <label>Label</label>
          <input
            type="text"
            name="label"
            value={formData.label}
            onChange={handleChange}
            placeholder="e.g., Living Room Light"
          />
        </div>

        <div className="form-group">
          <label>Device Type *</label>
          <select
            name="device_type"
            value={formData.device_type}
            onChange={handleChange}
          >
            <option value="light">💡 Light</option>
            <option value="fan">🌀 Fan</option>
            <option value="ac">❄️ AC</option>
            <option value="camera">📷 Camera</option>
            <option value="sensor">📊 Sensor</option>
          </select>
        </div>

        <div className="form-group">
          <label>Room Location *</label>
          <select
            name="room_location"
            value={formData.room_location}
            onChange={handleChange}
          >
            {rooms.map((room) => (
              <option key={room} value={room}>{room}</option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Power Consumption (W)</label>
            <input
              type="number"
              name="power_consumption"
              value={formData.power_consumption}
              onChange={handleChange}
              min="0"
              step="1"
            />
          </div>

          <div className="form-group">
            <label>Usage Hours</label>
            <input
              type="number"
              name="usage_hours"
              value={formData.usage_hours}
              onChange={handleChange}
              min="0"
              step="0.1"
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Device'}
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDeviceForm;
