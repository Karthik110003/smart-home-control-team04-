import React, { useState, useEffect } from 'react';
import '../styles/RoomManagement.css';

function RoomManagement({ onCancel }) {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState('');
  const [saved, setSaved] = useState('');

  // Load rooms on component mount
  useEffect(() => {
    loadRooms();
  }, []);

  // Listen for room updates from other pages
  useEffect(() => {
    const handleRoomsUpdated = (event) => {
      console.log('RoomManagement: Rooms updated event received');
      loadRooms();
    };

    const handleAccountChanged = (event) => {
      console.log('RoomManagement: Account changed event received');
      loadRooms();
    };

    window.addEventListener('roomsUpdated', handleRoomsUpdated);
    window.addEventListener('accountChanged', handleAccountChanged);

    return () => {
      window.removeEventListener('roomsUpdated', handleRoomsUpdated);
      window.removeEventListener('accountChanged', handleAccountChanged);
    };
  }, []);

  const loadRooms = () => {
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
        console.log('RoomManagement loaded rooms:', parsedRooms, 'for account:', accountId);
      } catch (err) {
        console.error('Error loading rooms:', err);
        setRooms([]);
      }
    } else {
      setRooms([]);
    }
  };

  const handleAddRoom = () => {
    const roomName = newRoom.trim();

    if (!roomName) {
      setSaved('error: Please enter a room name');
      setTimeout(() => setSaved(''), 3000);
      return;
    }

    if (rooms.includes(roomName)) {
      setSaved('error: Room already exists');
      setTimeout(() => setSaved(''), 3000);
      return;
    }

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

    const updatedRooms = [...rooms, roomName];
    setRooms(updatedRooms);
    localStorage.setItem(`accountRooms_${accountId}`, JSON.stringify(updatedRooms));

    console.log('Room added from RoomManagement:', roomName, 'Account:', accountId, 'Total rooms:', updatedRooms);
    setNewRoom('');
    setSaved('success: Room added successfully!');
    setTimeout(() => setSaved(''), 2000);

    // Dispatch custom events to notify other components
    window.dispatchEvent(new CustomEvent('roomsUpdated', { detail: { accountId, rooms: updatedRooms } }));
    window.dispatchEvent(new CustomEvent('accountChanged', { detail: { accountId } }));
  };

  const handleRemoveRoom = (roomName) => {
    if (window.confirm(`Remove room "${roomName}"?`)) {
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

      const updatedRooms = rooms.filter(room => room !== roomName);
      setRooms(updatedRooms);
      localStorage.setItem(`accountRooms_${accountId}`, JSON.stringify(updatedRooms));

      setSaved('success: Room removed successfully!');
      setTimeout(() => setSaved(''), 2000);

      // Dispatch custom events to notify other components
      window.dispatchEvent(new CustomEvent('roomsUpdated', { detail: { accountId, rooms: updatedRooms } }));
      window.dispatchEvent(new CustomEvent('accountChanged', { detail: { accountId } }));
    }
  };

  return (
    <div className="room-management-page">
      <div className="room-management-header">
        <h1>🏠 Room Management</h1>
        <p className="header-subtitle">Manage rooms for your smart home</p>
      </div>

      {saved && (
        <div className={`status-message ${saved.startsWith('success') ? 'success' : 'error'}`}>
          {saved.replace('success: ', '').replace('error: ', '')}
        </div>
      )}

      <div className="room-management-container">
        {/* Rooms List Section */}
        <div className="room-list-section">
          <div className="section-header">
            <h2>Available Rooms</h2>
            <span className="room-count">{rooms.length} room{rooms.length !== 1 ? 's' : ''}</span>
          </div>

          <div className="rooms-grid">
            {rooms.length > 0 ? (
              rooms.map((room, index) => (
                <div key={index} className="room-card">
                  <div className="room-card-content">
                    <div className="room-icon">🏠</div>
                    <h3 className="room-name">{room}</h3>
                  </div>
                  <button
                    className="btn-delete-room"
                    onClick={() => handleRemoveRoom(room)}
                    title="Delete room"
                  >
                    🗑️ Delete
                  </button>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <p>No rooms created yet</p>
                <span>Add a room below to get started!</span>
              </div>
            )}
          </div>
        </div>

        {/* Add Room Section */}
        <div className="add-room-section">
          <div className="section-header">
            <h2>Add New Room</h2>
          </div>

          <div className="add-room-form">
            <div className="form-group">
              <label htmlFor="room-name">Room Name</label>
              <input
                id="room-name"
                type="text"
                value={newRoom}
                onChange={(e) => setNewRoom(e.target.value)}
                placeholder="e.g., Living Room, Bathroom, Office"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddRoom();
                  }
                }}
                className="room-input"
              />
              <p className="input-hint">Enter a descriptive name for the room</p>
            </div>

            <button className="btn-add-room" onClick={handleAddRoom}>
              ➕ Create Room
            </button>
          </div>

          {/* Room Suggestions */}
          <div className="suggestions">
            <p className="suggestions-title">Quick Add:</p>
            <div className="suggestion-buttons">
              {['Garage', 'Gym', 'Study', 'Balcony', 'Patio'].map((suggestedRoom) => (
                !rooms.includes(suggestedRoom) && (
                  <button
                    key={suggestedRoom}
                    className="suggestion-btn"
                    onClick={() => {
                      setNewRoom(suggestedRoom);
                      setTimeout(() => {
                        // Simulate adding the room
                        const currentAccount = localStorage.getItem('currentAccount');
                        let accountId = 'default';
                        if (currentAccount) {
                          try {
                            const account = JSON.parse(currentAccount);
                            accountId = account.id || account.email;
                          } catch (err) {}
                        }
                        const updatedRooms = [...rooms, suggestedRoom];
                        setRooms(updatedRooms);
                        localStorage.setItem(`accountRooms_${accountId}`, JSON.stringify(updatedRooms));
                        setNewRoom('');
                        setSaved('success: Room added successfully!');
                        setTimeout(() => setSaved(''), 2000);
                        window.dispatchEvent(new CustomEvent('roomsUpdated', { detail: { accountId, rooms: updatedRooms } }));
                        window.dispatchEvent(new CustomEvent('accountChanged', { detail: { accountId } }));
                      }, 0);
                    }}
                  >
                    + {suggestedRoom}
                  </button>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomManagement;
