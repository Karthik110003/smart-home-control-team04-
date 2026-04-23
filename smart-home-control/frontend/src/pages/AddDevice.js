import React from 'react';
import AddDeviceForm from '../components/AddDeviceForm';

function AddDevice({ onAddDevice, onCancel }) {
  return (
    <div style={{ padding: '20px' }}>
      <AddDeviceForm onAddDevice={onAddDevice} onCancel={onCancel} />
    </div>
  );
}

export default AddDevice;