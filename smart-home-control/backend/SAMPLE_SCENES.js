// Run this script with: node SAMPLE_SCENES.js (from backend folder)
const mongoose = require('mongoose');
const Scene = require('./models/Scene');

const scenes = [
  { name: 'Good Morning', icon: '🌅', color: '#FFD93D', devices: [] },
  { name: 'Movie Night', icon: '🎬', color: '#6BCB77', devices: [] },
  { name: 'Away Mode', icon: '🚪', color: '#4D96FF', devices: [] },
  { name: 'Bedtime', icon: '🌙', color: '#6A4C93', devices: [] },
  { name: 'Party Mode', icon: '🎉', color: '#FF6B6B', devices: [] },
  { name: 'Energy Saver', icon: '💡', color: '#43E97B', devices: [] },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-home-db');
  await Scene.deleteMany({});
  await Scene.insertMany(scenes);
  console.log('Sample scenes inserted!');
  await mongoose.disconnect();
}

seed();
