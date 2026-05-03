
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
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-home-db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✓ Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

connectDB();

const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);

// Serve frontend
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
