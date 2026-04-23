import React, { useState, useEffect } from 'react';
import { automationService } from '../services/api';
import '../styles/Automations.css';

function Automations() {
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentAccountId, setCurrentAccountId] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    triggerTime: '',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    actions: [],
    active: true
  });

  // Get current account ID
  const getCurrentAccountId = () => {
    const currentAccount = localStorage.getItem('currentAccount');
    if (currentAccount) {
      try {
        const account = JSON.parse(currentAccount);
        return account.id || account.email || 'default';
      } catch (err) {
        console.error('Error parsing account:', err);
        return 'default';
      }
    }
    return 'default';
  };

  // Fetch automations for current account
  const fetchAutomations = async () => {
    try {
      const accountId = getCurrentAccountId();
      console.log('Automations: Fetching automations for account:', accountId);
      setCurrentAccountId(accountId);
      setLoading(true);
      const res = await automationService.getAllAutomations();
      setAutomations(res.data.data || []);
      setError('');
      console.log('Automations: Loaded automations:', res.data.data);
    } catch (err) {
      console.error('Error fetching automations:', err);
      setError('Failed to load automations');
      setAutomations([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load and account change listener
  useEffect(() => {
    fetchAutomations();

    // Listen for account changes
    const handleAccountChanged = (event) => {
      console.log('Automations: Account changed event received:', event.detail);
      fetchAutomations();
    };

    window.addEventListener('accountChanged', handleAccountChanged);
    
    return () => {
      window.removeEventListener('accountChanged', handleAccountChanged);
    };
  }, []);

  // Auto-scroll to error message when it appears
  useEffect(() => {
    if (error && showForm) {
      // Scroll to the error message with a small delay
      setTimeout(() => {
        const errorElement = document.querySelector('.error-message');
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          console.log('Automations: Scrolled to error message');
        }
      }, 100);
    }
  }, [error, showForm]);

  const handleToggle = async (id) => {
    try {
      const res = await automationService.toggleAutomation(id);
      setAutomations(automations.map(a => a._id === id ? res.data.data : a));
    } catch (err) {
      console.error('Error toggling automation:', err);
      setError('Failed to toggle automation');
    }
  };

  const handleDelete = async (id) => {
    try {
      await automationService.deleteAutomation(id);
      setAutomations(automations.filter(a => a._id !== id));
    } catch (err) {
      console.error('Error deleting automation:', err);
      setError('Failed to delete automation');
    }
  };

  const handleEdit = (automation) => {
    console.log('Editing automation:', automation);
    console.log('Days to load:', automation.days);
    setEditingId(automation._id);
    setFormData({
      name: automation.name,
      description: automation.description,
      triggerTime: automation.triggerTime,
      days: automation.days || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      actions: automation.actions || [],
      active: automation.active
    });
    setShowForm(true);
  };

  const handleUpdateAutomation = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || formData.name.trim() === '') {
      setError('Please enter an automation name');
      return;
    }
    
    if (!formData.triggerTime || formData.triggerTime.trim() === '') {
      setError('Please select a trigger time');
      return;
    }
    
    if (formData.days.length === 0) {
      setError('Please select at least one day of the week');
      return;
    }
    
    try {
      console.log('Updating automation with data:', formData);
      const res = await automationService.updateAutomation(editingId, formData);
      console.log('Update response:', res.data.data);
      setAutomations(automations.map(a => a._id === editingId ? res.data.data : a));
      setFormData({
        name: '',
        description: '',
        triggerTime: '',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        actions: [],
        active: true
      });
      setEditingId(null);
      setShowForm(false);
      setError('');
    } catch (err) {
      console.error('Error updating automation:', err);
      const errorMessage = err.response?.data?.error || 'Failed to update automation';
      console.log('Automations: Setting error message:', errorMessage);
      setError(errorMessage);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      triggerTime: '',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      actions: [],
      active: true
    });
  };

  const handleDayToggle = (day) => {
    setFormData(prev => {
      const newDays = prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day];
      console.log('Day toggled:', day, 'New days:', newDays);
      return {
        ...prev,
        days: newDays
      };
    });
  };

  const handleAddAutomation = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || formData.name.trim() === '') {
      setError('Please enter an automation name');
      return;
    }
    
    if (!formData.triggerTime || formData.triggerTime.trim() === '') {
      setError('Please select a trigger time');
      return;
    }
    
    if (formData.days.length === 0) {
      setError('Please select at least one day of the week');
      return;
    }
    
    try {
      if (editingId) {
        await handleUpdateAutomation(e);
      } else {
        const res = await automationService.addAutomation(formData);
        setAutomations([...automations, res.data.data]);
        setFormData({
          name: '',
          description: '',
          triggerTime: '',
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          actions: [],
          active: true
        });
        setShowForm(false);
        setError('');
      }
    } catch (err) {
      console.error('Error adding automation:', err);
      const errorMessage = err.response?.data?.error || 'Failed to save automation';
      console.log('Automations: Setting error message:', errorMessage);
      setError(errorMessage);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const automationTemplates = [
    { name: 'Morning Routine', icon: '🌅', description: 'Turn on lights and AC at 7 AM', time: '07:00' },
    { name: 'Movie Night', icon: '🎬', description: 'Dim lights and close curtains at evening', time: '18:00' },
    { name: 'Bedtime', icon: '🛏️', description: 'Turn off all devices at 10 PM', time: '22:00' },
    { name: 'Away Mode', icon: '🚪', description: 'Turn off all devices when leaving', time: 'manual' },
    { name: 'Energy Saver', icon: '⚡', description: 'Optimize power usage during peak hours', time: '18:00' }
  ];

  const handleUseTemplate = (template) => {
    setFormData(prev => ({
      ...prev,
      name: template.name,
      description: template.description,
      triggerTime: template.time
    }));
  };

  return (
    <div className="automations-page">
      {error && (
        <div className="error-banner">
          <strong>⚠️ Error:</strong> {error}
          <button 
            className="error-close-btn" 
            onClick={() => setError('')}
          >
            ✕
          </button>
        </div>
      )}
      
      <div className="automations-header">
        <div className="automations-header-left">
          <h1>Automations</h1>
          <p className="automations-subtitle">Automate your smart home based on time and conditions</p>
        </div>
        <button 
          className="btn-create-automation"
          onClick={() => setShowForm(!showForm)}
        >
          + Create Automation
        </button>
      </div>

      {showForm && (
        <div className="automation-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-templates">
            <h3>🎯 Popular Templates</h3>
            <div className="templates-grid">
              {automationTemplates.map((template, idx) => (
                <div
                  key={idx}
                  className="template-card"
                  onClick={() => handleUseTemplate(template)}
                >
                  <div className="template-icon">{template.icon}</div>
                  <div className="template-name">{template.name}</div>
                  <div className="template-description">{template.description}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="form-divider">
            <span>or</span>
          </div>

          <h2>{editingId ? 'Edit Automation' : 'Create Custom Automation'}</h2>
          <form onSubmit={handleAddAutomation}>
            <div className="form-group">
              <label>Automation Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="e.g., Morning Routine"
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                placeholder="Describe what this automation does"
              />
            </div>
            <div className="form-group">
              <label>Trigger Time *</label>
              <input
                type="time"
                name="triggerTime"
                value={formData.triggerTime}
                onChange={handleFormChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Days of Week</label>
              <div className="days-selector">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                  <button
                    key={day}
                    type="button"
                    className={`day-button ${formData.days.includes(day) ? 'selected' : ''}`}
                    onClick={() => handleDayToggle(day)}
                  >
                    {day.substring(0, 3)}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-submit">
                {editingId ? 'Update Automation' : 'Create Automation'}
              </button>
              {editingId && (
                <button type="button" className="btn-cancel" onClick={handleCancel}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p>Loading automations...</p>
      ) : automations.length === 0 ? (
        <div className="empty-state">
          <p>No automations yet. Create one to get started!</p>
        </div>
      ) : (
        <div className="automations-grid">
          {automations.map(automation => (
            <div key={automation._id} className="automation-card">
              <div className="automation-card-content">
                <div className="automation-info">
                  <div className="automation-title-row">
                    <h3 className="automation-title">{automation.name}</h3>
                    <span className={`status-badge ${automation.active ? 'active' : 'inactive'}`}>
                      {automation.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="automation-details">
                    <div className="detail-item">
                      <span className="detail-icon">⏰</span>
                      <span className="detail-text">Trigger: {automation.triggerTime || 'Not set'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">🎯</span>
                      <span className="detail-text">Action: {automation.description || 'Activate scene'}</span>
                    </div>
                  </div>
                  <div className="days-indicator">
                    {automation.days && automation.days.length > 0 ? (
                      automation.days.map((day, idx) => (
                        <span key={idx} className="day">{day.substring(0, 3)}</span>
                      ))
                    ) : (
                      <span className="day-empty">No days selected</span>
                    )}
                  </div>
                </div>
                <div className="automation-toggle-container">
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={automation.active}
                      onChange={() => handleToggle(automation._id)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
              <div className="automation-footer">
                <button 
                  className="edit-link"
                  onClick={() => handleEdit(automation)}
                  title="Edit automation"
                >
                  Edit automation →
                </button>
                <button 
                  className="btn-delete-small"
                  onClick={() => handleDelete(automation._id)}
                  title="Delete automation"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Automations;