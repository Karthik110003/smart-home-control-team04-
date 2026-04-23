import React from 'react';
import '../styles/RoomSection.css';
import DeviceCard from './DeviceCard';

const RoomSection = ({ room, devices, onToggle, onDelete }) => {
  return (
    <div className="room-section">
      <h2 className="room-title">🏠 {room}</h2>
      <div className="devices-grid">
        {devices.length === 0 ? (
          <p className="no-devices">No devices in this room</p>
        ) : (
          devices.map(device => (
            <DeviceCard
              key={device._id}
              device={device}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default RoomSection;
