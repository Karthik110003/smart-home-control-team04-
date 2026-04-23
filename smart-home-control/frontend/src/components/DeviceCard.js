import React from 'react';
import '../styles/DeviceCard.css';

const DeviceCard = ({ device, onToggle, onDelete }) => {
  const getDeviceIcon = (type) => {
    const icons = {
      light: '💡',
      fan: '🌀',
      ac: '❄️',
      camera: '📷',
      sensor: '📊'
    };
    return icons[type] || '⚙️';
  };

  const getStatusColor = (status) => {
    return status ? '#4CAF50' : '#f44336';
  };

  return (
    <div className="device-card">
      <div className="device-header">
        <span className="device-icon">{getDeviceIcon(device.device_type)}</span>
        <h3 className="device-name">{device.label || device.device_type}</h3>
        <button
          className={`status-btn ${device.status ? 'on' : 'off'}`}
          onClick={() => onToggle(device._id, !device.status)}
        >
          {device.status ? 'ON' : 'OFF'}
        </button>
      </div>

      <div className="device-body">
        <div className="device-info">
          <span className="info-label">Type:</span>
          <span className="info-value">{device.device_type.toUpperCase()}</span>
        </div>
        <div className="device-info">
          <span className="info-label">Room:</span>
          <span className="info-value">{device.room_location}</span>
        </div>
        <div className="device-info">
          <span className="info-label">Power:</span>
          <span className="info-value">{device.power_consumption}W</span>
        </div>
        <div className="device-info">
          <span className="info-label">Usage:</span>
          <span className="info-value">{device.usage_hours}h</span>
        </div>
      </div>

      <div className="device-footer">
        <button
          className="delete-btn"
          onClick={() => onDelete(device._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeviceCard;
