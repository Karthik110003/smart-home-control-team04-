import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { deviceService } from './services/api';
import { NotificationProvider } from './context/NotificationContext';

import Sidebar from './widget/Sidebar';
import Header from './widget/Header';

import Dashboard from './pages/Dashboard';
import Automations from './pages/Automations';
import Energy from './pages/Energy';
import Notifications from './pages/Notifications';
import Scenes from './pages/Scenes';
import Settings from './pages/Settings';
import AddDevice from './pages/AddDevice';
import RoomManagement from './pages/RoomManagement';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Team Management Page
import TeamManagement from './pages/TeamManagement';
import Members from './pages/Members';
import AddMember from './pages/AddMember';
import MemberDetail from './pages/MemberDetail';

function App() {
  const [devices, setDevices] = useState([]);
  const [page, setPage] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [authPage, setAuthPage] = useState('login'); // 'login' or 'signup'
  const [currentAccountId, setCurrentAccountId] = useState(null);
  const [selectedMemberId, setSelectedMemberId] = useState(null); // For member detail page

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        let parsedUser = JSON.parse(userData);
        
        // Get current account id
        let accountId = parsedUser.id || parsedUser.email;
        
        // Try to load updated profile from accountProfiles if it exists
        const accountProfiles = localStorage.getItem('accountProfiles');
        if (accountProfiles) {
          try {
            const profiles = JSON.parse(accountProfiles);
            if (profiles[accountId]) {
              // Merge the updated profile with user data
              parsedUser = {
                ...parsedUser,
                ...profiles[accountId]
              };
              // Update user in localStorage to keep it in sync
              localStorage.setItem('user', JSON.stringify(parsedUser));
            }
          } catch (err) {
            console.error('Error loading updated profile:', err);
          }
        }
        
        setUser(parsedUser);
        setIsAuthenticated(true);
        
        // Get current account from localStorage
        let accountIdFromStorage = null;
        const currentAccount = localStorage.getItem('currentAccount');
        if (currentAccount) {
          try {
            const account = JSON.parse(currentAccount);
            accountIdFromStorage = account.id || account.email;
          } catch (err) {
            console.error('Error parsing account:', err);
            accountIdFromStorage = accountId;
          }
        } else {
          accountIdFromStorage = accountId;
        }
        
        setCurrentAccountId(accountIdFromStorage);
        // Fetch devices from API (not just localStorage)
        setTimeout(() => {
          fetchDevicesFromAPI(accountIdFromStorage);
        }, 100);
        
        // Restore last visited page ONLY if authenticated
        const savedPage = localStorage.getItem('lastPage');
        if (savedPage && savedPage !== 'dashboard') {
          setPage(savedPage);
        }
      } catch (err) {
        console.error('Error parsing user data:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('lastPage');
      }
    }

    // Load dark mode setting from localStorage
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setDarkMode(settings.darkMode || false);
      } catch (err) {
        console.error('Error loading settings:', err);
      }
    }
  }, []);

  // Fetch devices whenever account changes
  useEffect(() => {
    if (isAuthenticated && currentAccountId) {
      fetchDevices();
    }
  }, [currentAccountId]);

  // Log devices when they change
  useEffect(() => {
    console.log('App.js devices state updated:', devices, 'for account:', currentAccountId);
  }, [devices, currentAccountId]);

  // Handle account changes from Settings page
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'currentAccount' || e.key === 'userAccounts') {
        const currentAccount = localStorage.getItem('currentAccount');
        if (currentAccount) {
          try {
            const account = JSON.parse(currentAccount);
            const newAccountId = account.id || account.email;
            if (newAccountId !== currentAccountId) {
              console.log('Account changed via storage event:', newAccountId);
              setCurrentAccountId(newAccountId);
            }
          } catch (err) {
            console.error('Error parsing account:', err);
          }
        }
      }
    };

    // Listen for custom account change events (same tab)
    const handleAccountChange = (event) => {
      console.log('Account change event received:', event.detail);
      const newAccountId = event.detail.accountId;
      if (newAccountId !== currentAccountId) {
        console.log('Account changed via custom event:', newAccountId);
        setCurrentAccountId(newAccountId);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('accountChanged', handleAccountChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('accountChanged', handleAccountChange);
    };
  }, [currentAccountId]);
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('lastPage', page);
    }
  }, [page, isAuthenticated]);

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
      document.body.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const loadDevicesForAccount = (accountId) => {
    try {
      const storedDevices = localStorage.getItem(`accountDevices_${accountId}`);
      if (storedDevices) {
        try {
          setDevices(JSON.parse(storedDevices));
        } catch (err) {
          console.error('Error parsing devices:', err);
          setDevices([]);
        }
      } else {
        setDevices([]);
      }
    } catch (err) {
      console.error('Error loading devices:', err);
      setDevices([]);
    }
  };

  const fetchDevicesFromAPI = async (accountId) => {
    try {
      console.log('Fetching devices from API for account:', accountId);
      const res = await deviceService.getAllDevices();
      const devicesFromAPI = res.data.data || [];
      console.log('Devices from API:', devicesFromAPI);
      
      setDevices(devicesFromAPI);
      if (accountId) {
        localStorage.setItem(`accountDevices_${accountId}`, JSON.stringify(devicesFromAPI));
      }
    } catch (err) {
      console.error('Error fetching devices from API:', err);
      // Fallback to localStorage
      loadDevicesForAccount(accountId);
    }
  };

  const fetchDevices = async () => {
    const accountId = currentAccountId || user?.id || user?.email;
    if (!accountId) return;
    
    try {
      // Fetch devices from backend API
      console.log('Fetching devices from API for account:', accountId);
      const res = await deviceService.getAllDevices();
      const devicesFromAPI = res.data.data || [];
      console.log('Devices from API:', devicesFromAPI);
      
      // Save to localStorage and state
      setDevices(devicesFromAPI);
      localStorage.setItem(`accountDevices_${accountId}`, JSON.stringify(devicesFromAPI));
    } catch (err) {
      console.error('Error fetching devices from API:', err);
      // Fallback to localStorage
      loadDevicesForAccount(accountId);
    }
  };

  const toggleDevice = async (id, status) => {
    try {
      const accountId = currentAccountId || user?.id || user?.email;
      const updatedDevices = devices.map(d => d._id === id ? { ...d, status } : d);
      setDevices(updatedDevices);
      
      // Save to localStorage for this account
      localStorage.setItem(`accountDevices_${accountId}`, JSON.stringify(updatedDevices));
      
      // Optionally sync with backend
      try {
        await deviceService.updateDevice(id, { status });
      } catch (err) {
        console.error('Error syncing with backend:', err);
      }
    } catch (err) {
      console.error('Error toggling device:', err);
    }
  };

  const deleteDevice = async (id) => {
    try {
      const accountId = currentAccountId || user?.id || user?.email;
      const updatedDevices = devices.filter(d => d._id !== id);
      setDevices(updatedDevices);
      
      // Save to localStorage for this account
      localStorage.setItem(`accountDevices_${accountId}`, JSON.stringify(updatedDevices));
      
      // Optionally sync with backend
      try {
        await deviceService.deleteDevice(id);
      } catch (err) {
        console.error('Error syncing with backend:', err);
      }
    } catch (err) {
      console.error('Error deleting device:', err);
    }
  };

  const addDevice = async (data) => {
    try {
      // Determine account ID - check localStorage first as it's most current
      let accountId = null;
      const currentAccount = localStorage.getItem('currentAccount');
      if (currentAccount) {
        try {
          const account = JSON.parse(currentAccount);
          accountId = account.id || account.email;
        } catch (err) {
          console.error('Error parsing currentAccount:', err);
        }
      }
      
      // Fallback to state values
      if (!accountId) {
        accountId = currentAccountId || user?.id || user?.email || 'default';
      }
      
      console.log('Adding device with account ID:', accountId);
      
      // Create device object locally
      const newDevice = {
        _id: `device_${Date.now()}`,
        ...data,
        status: false
      };
      
      const updatedDevices = [...devices, newDevice];
      setDevices(updatedDevices);
      
      // Save to localStorage for this account
      localStorage.setItem(`accountDevices_${accountId}`, JSON.stringify(updatedDevices));
      console.log('Device saved to:', `accountDevices_${accountId}`);
      console.log('Updated devices:', updatedDevices);
      
      // Optionally sync with backend
      try {
        await deviceService.addDevice(data);
      } catch (err) {
        console.error('Error syncing with backend:', err);
      }
      
      setPage('dashboard');
    } catch (err) {
      console.error('Error adding device:', err);
      throw err;
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setPage('dashboard');
  };

  const handleSignup = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setAuthPage('login');
  };

  const handleSwitchToSignup = (e) => {
    e.preventDefault();
    setAuthPage('signup');
  };

  const handleSwitchToLogin = (e) => {
    e.preventDefault();
    setAuthPage('login');
  };

  // Show login/signup pages if not authenticated
  if (!isAuthenticated) {
    return (
      <div>
        {authPage === 'login' ? (
          <Login onLogin={handleLogin} onSwitchToSignup={handleSwitchToSignup} />
        ) : (
          <Signup onSignup={handleSignup} onSwitchToLogin={handleSwitchToLogin} />
        )}
      </div>
    );
  }

  return (
    <NotificationProvider>
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        <Sidebar setPage={setPage} onLogout={handleLogout} />

        <div style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column' }}>
          <Header user={user} onLogout={handleLogout} setPage={setPage} devices={devices} />

          <div style={{ flex: 1, overflow: 'auto' }}>
            {/* Smart Home Pages */}
            {page === 'dashboard' && (
              <Dashboard devices={devices} toggle={toggleDevice} deleteDevice={deleteDevice} setPage={setPage} />
            )}

            {page === 'automations' && <Automations />}

            {page === 'energy' && <Energy />}

            {page === 'notifications' && <Notifications />}

            {page === 'scenes' && <Scenes />}

            {page === 'settings' && <Settings onDarkModeChange={setDarkMode} user={user} onLogout={handleLogout} onUserUpdate={setUser} onAccountChange={(accountId) => { setCurrentAccountId(accountId); loadDevicesForAccount(accountId); }} />}

            {page === 'add' && (
              <AddDevice
                onAddDevice={addDevice}
                onCancel={() => setPage('dashboard')}
              />
            )}

            {page === 'rooms' && (
              <RoomManagement onCancel={() => setPage('dashboard')} />
            )}

            {/* Team Management Page - All in One */}
            {page === 'team' && <TeamManagement setPage={setPage} />}
          </div>
        </div>
      </div>
    </NotificationProvider>
  );
}

export default App;