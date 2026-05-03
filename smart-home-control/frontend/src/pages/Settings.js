import React, { useState, useEffect } from 'react';
import '../styles/Settings.css';
import authService from '../services/authService';

function Settings({ onDarkModeChange, user, onLogout, onUserUpdate, onAccountChange }) {
  const [profile, setProfile] = useState({
    name: user?.name || 'User',
    email: user?.email || 'user@example.com',
    phone: '+1 (555) 123-4567',
    homeAddress: '123 Smart Home St, Tech City, TC 12345',
    plan: 'Premium Plan'
  });

  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: true,
    autoRefresh: true,
    refreshInterval: 30,
    temperature: 'celsius'
  });

  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(user?.id || user?.email);

  const [saved, setSaved] = useState(false);
  const [profileEditing, setProfileEditing] = useState(false);
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [newRoom, setNewRoom] = useState('');
  const [newAccountForm, setNewAccountForm] = useState({
    name: '',
    email: '',
    phone: '',
    homeAddress: '',
    plan: 'Premium Plan'
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Load profile and accounts from localStorage on mount
  useEffect(() => {
    // Load accounts from localStorage
    let savedAccounts = localStorage.getItem('userAccounts');
    let accountsToUse = [];

    if (savedAccounts) {
      try {
        accountsToUse = JSON.parse(savedAccounts);
        setAccounts(accountsToUse);
      } catch (err) {
        console.error('Error loading accounts:', err);
        accountsToUse = createDefaultAccounts();
        setAccounts(accountsToUse);
        localStorage.setItem('userAccounts', JSON.stringify(accountsToUse));
      }
    } else {
      // Create default accounts with different data
      accountsToUse = createDefaultAccounts();
      setAccounts(accountsToUse);
      localStorage.setItem('userAccounts', JSON.stringify(accountsToUse));
    }

    // Load profile for the selected account
    const currentAccountId = selectedAccount || user?.id || user?.email;
    const accountProfiles = localStorage.getItem('accountProfiles');
    let profiles = {};
    
    if (accountProfiles) {
      try {
        profiles = JSON.parse(accountProfiles);
      } catch (err) {
        console.error('Error loading account profiles:', err);
      }
    }

    // If profile exists for this account, use it; otherwise create new one
    if (profiles[currentAccountId]) {
      setProfile(profiles[currentAccountId]);
    } else {
      const account = accountsToUse.find(acc => acc.id === currentAccountId || acc.email === currentAccountId);
      if (account) {
        const newProfile = {
          name: account.name || 'User',
          email: account.email,
          phone: account.phone || '+1 (555) 123-4567',
          homeAddress: account.homeAddress || '123 Smart Home St, Tech City, TC 12345',
          plan: account.plan || 'Premium Plan'
        };
        setProfile(newProfile);
        profiles[currentAccountId] = newProfile;
        localStorage.setItem('accountProfiles', JSON.stringify(profiles));
      }
    }

    // Set currentAccount in localStorage
    const currentAccount = accountsToUse.find(acc => acc.id === currentAccountId || acc.email === currentAccountId);
    if (currentAccount) {
      localStorage.setItem('currentAccount', JSON.stringify(currentAccount));
    }

    // Load rooms for the selected account
    const accountRooms = localStorage.getItem(`accountRooms_${currentAccountId}`);
    if (accountRooms) {
      try {
        setRooms(JSON.parse(accountRooms));
      } catch (err) {
        console.error('Error loading rooms:', err);
        const defaultRooms = ['Living Room', 'Bedroom', 'Kitchen', 'Store Room'];
        setRooms(defaultRooms);
        localStorage.setItem(`accountRooms_${currentAccountId}`, JSON.stringify(defaultRooms));
      }
    } else {
      // Set default rooms for new accounts
      const defaultRooms = ['Living Room', 'Bedroom', 'Kitchen', 'Store Room'];
      setRooms(defaultRooms);
      localStorage.setItem(`accountRooms_${currentAccountId}`, JSON.stringify(defaultRooms));
    }
  }, [user]);

  // Create default accounts with different data
  const createDefaultAccounts = () => {
    return [
      {
        id: 'acc-1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1 (555) 123-4567',
        homeAddress: '123 Smart Home St, Tech City, TC 12345',
        plan: 'Premium Plan'
      },
      {
        id: 'acc-2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1 (555) 987-6543',
        homeAddress: '456 Connected Ave, Innovation City, IC 67890',
        plan: 'Basic Plan'
      },
      {
        id: 'acc-3',
        name: 'Mike Johnson',
        email: 'mike@example.com',
        phone: '+1 (555) 456-7890',
        homeAddress: '789 IoT Boulevard, Future Town, FT 11111',
        plan: 'Premium Plan'
      }
    ];
  };

  // Handle account selection
  const handleAccountChange = (e) => {
    const selectedAccountId = e.target.value;
    const account = accounts.find(acc => acc.id === selectedAccountId || acc.email === selectedAccountId);
    
    if (account) {
      setSelectedAccount(selectedAccountId);
      
      // Load profile for this account from localStorage
      const accountProfiles = localStorage.getItem('accountProfiles');
      let profiles = {};
      
      if (accountProfiles) {
        try {
          profiles = JSON.parse(accountProfiles);
        } catch (err) {
          console.error('Error loading profiles:', err);
        }
      }

      // If profile exists for this account, use it; otherwise create new one with account's data
      if (profiles[selectedAccountId]) {
        setProfile(profiles[selectedAccountId]);
      } else {
        const newProfile = {
          name: account.name,
          email: account.email,
          phone: account.phone || '+1 (555) 123-4567',
          homeAddress: account.homeAddress || '123 Smart Home St, Tech City, TC 12345',
          plan: account.plan || 'Premium Plan'
        };
        setProfile(newProfile);
        profiles[selectedAccountId] = newProfile;
        localStorage.setItem('accountProfiles', JSON.stringify(profiles));
      }
      
      // Update current account in localStorage
      localStorage.setItem('currentAccount', JSON.stringify(account));

      // Load rooms for this account
      const accountRooms = localStorage.getItem(`accountRooms_${selectedAccountId}`);
      if (accountRooms) {
        try {
          setRooms(JSON.parse(accountRooms));
        } catch (err) {
          console.error('Error loading rooms:', err);
          const defaultRooms = ['Living Room', 'Bedroom', 'Kitchen', 'Store Room'];
          setRooms(defaultRooms);
          localStorage.setItem(`accountRooms_${selectedAccountId}`, JSON.stringify(defaultRooms));
        }
      } else {
        const defaultRooms = ['Living Room', 'Bedroom', 'Kitchen', 'Store Room'];
        setRooms(defaultRooms);
        localStorage.setItem(`accountRooms_${selectedAccountId}`, JSON.stringify(defaultRooms));
      }

      // Dispatch custom events to notify other components
      console.log('Dispatching accountChanged event from Settings');
      window.dispatchEvent(new CustomEvent('accountChanged', { detail: { accountId: selectedAccountId } }));
      window.dispatchEvent(new CustomEvent('roomsUpdated', { detail: { accountId: selectedAccountId } }));

      // Notify parent component of account change
      if (onAccountChange) {
        onAccountChange(selectedAccountId);
      }
    }
  };

  const handleToggle = (key) => {
    const newValue = !settings[key];
    setSettings(prev => ({
      ...prev,
      [key]: newValue
    }));
    
    // Apply dark mode immediately
    if (key === 'darkMode' && onDarkModeChange) {
      onDarkModeChange(newValue);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNewAccountChange = (e) => {
    const { name, value } = e.target;
    setNewAccountForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateNewAccount = () => {
    const { name, email, phone, homeAddress, plan } = newAccountForm;

    // Validation
    if (!name.trim() || !email.trim()) {
      alert('Please enter name and email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email');
      return;
    }

    // Check if email already exists
    if (accounts.some(acc => acc.email === email)) {
      alert('Email already exists');
      return;
    }

    // Create new account with fresh/empty data
    const newAccount = {
      id: `acc-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || '',
      homeAddress: homeAddress.trim() || '',
      plan: plan || 'Premium Plan'
    };

    // Add to accounts list
    const updatedAccounts = [...accounts, newAccount];
    setAccounts(updatedAccounts);
    localStorage.setItem('userAccounts', JSON.stringify(updatedAccounts));

    // Create empty profile for new account
    const accountProfiles = localStorage.getItem('accountProfiles');
    let profiles = {};
    if (accountProfiles) {
      try {
        profiles = JSON.parse(accountProfiles);
      } catch (err) {
        console.error('Error loading profiles:', err);
      }
    }

    const newProfile = {
      name: newAccount.name,
      email: newAccount.email,
      phone: newAccount.phone,
      homeAddress: newAccount.homeAddress,
      plan: newAccount.plan
    };
    profiles[newAccount.id] = newProfile;
    localStorage.setItem('accountProfiles', JSON.stringify(profiles));

    // Initialize default rooms for new account
    const defaultRooms = ['Living Room', 'Bedroom', 'Kitchen', 'Store Room'];
    localStorage.setItem(`accountRooms_${newAccount.id}`, JSON.stringify(defaultRooms));

    // Switch to the new account
    setSelectedAccount(newAccount.id);
    setProfile(newProfile);
    setRooms(defaultRooms);

    // Reset form and close
    setNewAccountForm({
      name: '',
      email: '',
      phone: '',
      homeAddress: '',
      plan: 'Premium Plan'
    });
    setShowCreateAccount(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);

    // Dispatch custom events to notify other components
    console.log('Dispatching events after new account created');
    window.dispatchEvent(new CustomEvent('roomsUpdated', { detail: { accountId: newAccount.id } }));
    window.dispatchEvent(new CustomEvent('accountChanged', { detail: { accountId: newAccount.id } }));

    // Update currentAccount in localStorage
    localStorage.setItem('currentAccount', JSON.stringify(newAccount));

    // Notify parent component of account change
    if (onAccountChange) {
      onAccountChange(newAccount.id);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      
      // Load existing account profiles
      const accountProfiles = localStorage.getItem('accountProfiles');
      let profiles = {};
      if (accountProfiles) {
        try {
          profiles = JSON.parse(accountProfiles);
        } catch (err) {
          console.error('Error loading profiles:', err);
        }
      }

      // Save the current account's profile locally
      profiles[selectedAccount] = profile;
      localStorage.setItem('accountProfiles', JSON.stringify(profiles));
      
      // Always update the user object in localStorage with latest profile
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          let parsedUser = JSON.parse(userData);
          const currentUserId = parsedUser.id || parsedUser.email;
          
          // If the profile being saved is for the currently logged-in user, update it
          if (selectedAccount === currentUserId) {
            // Save to backend (MongoDB) for the logged-in user
            console.log('Saving profile to backend for user:', profile.name, profile.email);
            await authService.updateProfile(profile.name, profile.email);
            
            const updatedUser = {
              ...parsedUser,
              name: profile.name,
              email: profile.email,
              phone: profile.phone,
              homeAddress: profile.homeAddress,
              plan: profile.plan
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            console.log('Profile saved to backend and localStorage for current user:', currentUserId);
            
            if (onUserUpdate) {
              onUserUpdate(updatedUser);
            }
          }
        } catch (err) {
          console.error('Error updating user object:', err);
        }
      }
      
      console.log('Profile saved:', profile.name, 'for account:', selectedAccount);
      setSaved(true);
      setProfileEditing(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
    setPasswordError('');
  };

  const handleUpdatePassword = async () => {
    setPasswordError('');
    setPasswordSuccess('');
    setLoading(true);

    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all password fields');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const data = await authService.changePassword(currentPassword, newPassword);
      setPasswordSuccess(data.message || 'Password updated successfully!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordForm(false);
      
      setTimeout(() => setPasswordSuccess(''), 3000);
    } catch (err) {
      setPasswordError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoom = () => {
    const roomName = newRoom.trim();
    
    if (!roomName) {
      alert('Please enter a room name');
      return;
    }

    if (rooms.includes(roomName)) {
      alert('Room already exists');
      return;
    }

    const updatedRooms = [...rooms, roomName];
    setRooms(updatedRooms);
    localStorage.setItem(`accountRooms_${selectedAccount}`, JSON.stringify(updatedRooms));
    
    // Ensure currentAccount is set to selected account
    const accounts = JSON.parse(localStorage.getItem('userAccounts') || '[]');
    const selectedAccountObj = accounts.find(acc => acc.id === selectedAccount || acc.email === selectedAccount);
    if (selectedAccountObj) {
      localStorage.setItem('currentAccount', JSON.stringify(selectedAccountObj));
    }
    
    console.log('Room added to Settings:', roomName, 'Account:', selectedAccount, 'Total rooms:', updatedRooms);
    setNewRoom('');
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);

    // Dispatch custom events to notify other components
    console.log('Dispatching events after room added');
    window.dispatchEvent(new CustomEvent('roomsUpdated', { detail: { accountId: selectedAccount, rooms: updatedRooms } }));
    window.dispatchEvent(new CustomEvent('accountChanged', { detail: { accountId: selectedAccount } }));
  };

  const handleRemoveRoom = (roomName) => {
    if (window.confirm(`Remove room "${roomName}"?`)) {
      const updatedRooms = rooms.filter(room => room !== roomName);
      setRooms(updatedRooms);
      localStorage.setItem(`accountRooms_${selectedAccount}`, JSON.stringify(updatedRooms));
      
      // Ensure currentAccount is set to selected account
      const accounts = JSON.parse(localStorage.getItem('userAccounts') || '[]');
      const selectedAccountObj = accounts.find(acc => acc.id === selectedAccount || acc.email === selectedAccount);
      if (selectedAccountObj) {
        localStorage.setItem('currentAccount', JSON.stringify(selectedAccountObj));
      }
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);

      // Dispatch custom events to notify other components
      window.dispatchEvent(new CustomEvent('roomsUpdated', { detail: { accountId: selectedAccount, rooms: updatedRooms } }));
      window.dispatchEvent(new CustomEvent('accountChanged', { detail: { accountId: selectedAccount } }));
    }
  };

  const handleLogoutClick = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      authService.logout();
      onLogout();
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>⚙️ Settings</h1>
      </div>

      {saved && <div className="success-message">Settings saved successfully!</div>}

      <div className="settings-container">
        <div className="settings-section profile-section">
          <div className="section-header">
            <h2>👤 Profile</h2>
            {!profileEditing && <button className="btn-edit" onClick={() => setProfileEditing(true)}>Edit Profile</button>}
          </div>
          
          {profileEditing ? (
            <div className="profile-form">
              <div className="profile-form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                />
              </div>
              <div className="profile-form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                />
              </div>
              <div className="profile-form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleProfileChange}
                />
              </div>
              <div className="profile-form-group">
                <label>Home Address</label>
                <textarea
                  name="homeAddress"
                  value={profile.homeAddress}
                  onChange={handleProfileChange}
                  rows="3"
                />
              </div>
              <div className="profile-actions">
                <button className="btn-save" onClick={handleSaveProfile}>Save Profile</button>
                <button className="btn-cancel" onClick={() => setProfileEditing(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <div className="profile-display">
              <div className="profile-avatar">JD</div>
              <div className="profile-details">
                <div className="profile-item">
                  <span className="profile-label">Name:</span>
                  <span className="profile-value">{profile.name}</span>
                </div>
                <div className="profile-item">
                  <span className="profile-label">Email:</span>
                  <span className="profile-value">{profile.email}</span>
                </div>
                <div className="profile-item">
                  <span className="profile-label">Phone:</span>
                  <span className="profile-value">{profile.phone}</span>
                </div>
                <div className="profile-item">
                  <span className="profile-label">Address:</span>
                  <span className="profile-value">{profile.homeAddress}</span>
                </div>
                <div className="profile-item">
                  <span className="profile-label">Plan:</span>
                  <span className="profile-value premium">{profile.plan}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="settings-section account-section">
          <div className="section-header">
            <h2>🔐 Account & Security</h2>
          </div>

          <div className="account-info">
            <div className="account-item">
              <span className="account-label">Select Account:</span>
              <select 
                className="account-selector"
                value={selectedAccount} 
                onChange={handleAccountChange}
              >
                {accounts.map((account) => (
                  <option key={account.id || account.email} value={account.id || account.email}>
                    {account.name} ({account.email})
                  </option>
                ))}
              </select>
            </div>
            <div className="account-item">
              <span className="account-label">Email:</span>
              <span className="account-value">{user?.email || profile.email}</span>
            </div>
            <div className="account-item">
              <span className="account-label">Account Status:</span>
              <span className="account-value active">Active</span>
            </div>
          </div>

          <div className="account-actions">
            <button 
              className="btn-change-password"
              onClick={() => setShowPasswordForm(!showPasswordForm)}
            >
              🔑 Change Password
            </button>
            <button 
              className="btn-create-account"
              onClick={() => setShowCreateAccount(!showCreateAccount)}
            >
              ➕ Create New Account
            </button>
          </div>

          {showCreateAccount && (
            <div className="create-account-form">
              <h3>Create New Account</h3>
              <div className="profile-form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={newAccountForm.name}
                  onChange={handleNewAccountChange}
                  placeholder="Enter full name"
                />
              </div>
              <div className="profile-form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={newAccountForm.email}
                  onChange={handleNewAccountChange}
                  placeholder="Enter email address"
                />
              </div>
              <div className="profile-form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={newAccountForm.phone}
                  onChange={handleNewAccountChange}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="profile-form-group">
                <label>Home Address</label>
                <textarea
                  name="homeAddress"
                  value={newAccountForm.homeAddress}
                  onChange={handleNewAccountChange}
                  placeholder="Enter home address"
                  rows="3"
                />
              </div>
              <div className="profile-form-group">
                <label>Plan</label>
                <select
                  name="plan"
                  value={newAccountForm.plan}
                  onChange={handleNewAccountChange}
                >
                  <option value="Basic Plan">Basic Plan</option>
                  <option value="Premium Plan">Premium Plan</option>
                </select>
              </div>
              <div className="profile-actions">
                <button 
                  className="btn-save" 
                  onClick={handleCreateNewAccount}
                >
                  Create Account
                </button>
                <button 
                  className="btn-cancel" 
                  onClick={() => {
                    setShowCreateAccount(false);
                    setNewAccountForm({
                      name: '',
                      email: '',
                      phone: '',
                      homeAddress: '',
                      plan: 'Premium Plan'
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {showPasswordForm && (
            <div className="password-form">
              {passwordError && <div className="error-message">{passwordError}</div>}
              {passwordSuccess && <div className="success-message">{passwordSuccess}</div>}

              <div className="profile-form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter your current password"
                  disabled={loading}
                />
              </div>

              <div className="profile-form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password (min 6 characters)"
                  disabled={loading}
                />
              </div>

              <div className="profile-form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                  disabled={loading}
                />
              </div>

              <div className="profile-actions">
                <button 
                  className="btn-save" 
                  onClick={handleUpdatePassword}
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
                <button 
                  className="btn-cancel" 
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordForm({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                    setPasswordError('');
                  }}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="settings-section">
          <h2>Display Settings</h2>
          
          <div className="setting-item">
            <div className="setting-label">
              <span className="setting-name">Dark Mode</span>
              <span className="setting-description">Enable dark theme for the application</span>
            </div>
            <div className="setting-control">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.darkMode}
                  onChange={() => handleToggle('darkMode')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-label">
              <span className="setting-name">Temperature Unit</span>
              <span className="setting-description">Choose temperature display format</span>
            </div>
            <div className="setting-control">
              <select
                name="temperature"
                value={settings.temperature}
                onChange={handleChange}
              >
                <option value="celsius">Celsius (°C)</option>
                <option value="fahrenheit">Fahrenheit (°F)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2>Notification Settings</h2>

          <div className="setting-item">
            <div className="setting-label">
              <span className="setting-name">Enable Notifications</span>
              <span className="setting-description">Receive alerts about your devices</span>
            </div>
            <div className="setting-control">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={() => handleToggle('notifications')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2>Data & Performance</h2>

          <div className="setting-item">
            <div className="setting-label">
              <span className="setting-name">Auto Refresh</span>
              <span className="setting-description">Automatically refresh data at intervals</span>
            </div>
            <div className="setting-control">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.autoRefresh}
                  onChange={() => handleToggle('autoRefresh')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          {settings.autoRefresh && (
            <div className="setting-item">
              <div className="setting-label">
                <span className="setting-name">Refresh Interval</span>
                <span className="setting-description">How often to refresh data (in seconds)</span>
              </div>
              <div className="setting-control">
                <input
                  type="number"
                  name="refreshInterval"
                  value={settings.refreshInterval}
                  onChange={handleChange}
                  min="10"
                  max="300"
                  step="10"
                />
                <span className="unit">seconds</span>
              </div>
            </div>
          )}
        </div>

        <div className="settings-section">
          <h2>About</h2>
          
          <div className="about-info">
            <p><strong>Application:</strong> Smart Home Control Center</p>
            <p><strong>Version:</strong> 1.0.0</p>
            <p><strong>Build:</strong> 2024</p>
          </div>
        </div>

        <div className="settings-section logout-section">
          <h2>Session</h2>
          <div className="logout-info">
            <p>Currently logged in as: <strong>{user?.name || 'User'}</strong></p>
            <p className="logout-description">Click below to logout from your account</p>
          </div>
          <button className="btn-logout" onClick={handleLogoutClick}>
            🚪 Logout
          </button>
        </div>

        <div className="settings-actions">
          <button className="btn-save" onClick={handleSave}>
            Save Settings
          </button>
          <button className="btn-reset" onClick={() => setSettings({
            darkMode: false,
            notifications: true,
            autoRefresh: true,
            refreshInterval: 30,
            temperature: 'celsius'
          })}>
            Reset to Default
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
