const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const deviceRoutes = require('./routes/devices');
const sceneRoutes = require('./routes/scenes');
const automationRoutes = require('./routes/automations');
const energyRoutes = require('./routes/energy');
const authRoutes = require('./routes/auth');
const membersRoutes = require('./routes/members');
// Removed clusteringRoutes import (no longer used)

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-home-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✓ MongoDB connected successfully');
})
.catch(err => {
  console.error('✗ MongoDB connection error:', err.message);
  process.exit(1);
});

// Routes
app.use('/api/devices', deviceRoutes);
app.use('/api/scenes', sceneRoutes);
app.use('/api/automations', automationRoutes);
app.use('/api/energy', energyRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/members', membersRoutes);
// Removed clustering route (no longer used)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend server is running' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Smart Home Control Center Backend',
    version: '1.0.0',
    endpoints: {
      devices: '/api/devices',
      clustering: '/api/clustering/analysis',
      health: '/api/health'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ API docs available at http://localhost:${PORT}`);
});
