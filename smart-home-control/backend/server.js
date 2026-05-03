
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());

app.use(express.json());

// Connect to MongoDB
let dbConnected = false;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-home-db';
    console.log(`Attempting to connect to MongoDB...`);
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000,
    });
    console.log("✓ Connected to MongoDB");
    dbConnected = true;
  } catch (error) {
    console.error("⚠️ MongoDB connection failed:", error.message);
    console.error("App will continue to run, but database operations will fail");
    dbConnected = false;
  }
};

// Start DB connection (don't wait for it)
connectDB();

// Middleware to check DB connection for API routes
app.use((req, res, next) => {
  if (!dbConnected && req.path.startsWith('/api')) {
    return res.status(503).json({ 
      success: false,
      message: 'Database connection unavailable. Please try again later.' 
    });
  }
  next();
});

const authRoutes = require('./routes/auth');
const devicesRoutes = require('./routes/devices');
const automationsRoutes = require('./routes/automations');
const scenesRoutes = require('./routes/scenes');
const energyRoutes = require('./routes/energy');
const membersRoutes = require('./routes/members');

// Register API routes
app.use('/api', authRoutes);
app.use('/api/devices', devicesRoutes);
app.use('/api/automations', automationsRoutes);
app.use('/api/scenes', scenesRoutes);
app.use('/api/energy', energyRoutes);
app.use('/api/members', membersRoutes);

// Serve uploads folder for member images
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

// Serve frontend
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
