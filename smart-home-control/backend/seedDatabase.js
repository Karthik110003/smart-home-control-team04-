/**
 * Seed database with sample devices and scenes
 * Run this script with: node seedDatabase.js
 */

const mongoose = require('mongoose');
const Device = require('./models/Device');
const Scene = require('./models/Scene');

const sampleDevices = [
  // Living Room Devices
  {
    device_id: "light-living-001",
    device_type: "light",
    room_location: "Living Room",
    power_consumption: 60,
    usage_hours: 8.5,
    label: "Main Light",
    status: false
  },
  {
    device_id: "fan-living-001",
    device_type: "fan",
    room_location: "Living Room",
    power_consumption: 75,
    usage_hours: 6,
    label: "Ceiling Fan",
    status: false
  },

  // Bedroom Devices
  {
    device_id: "ac-bedroom-001",
    device_type: "ac",
    room_location: "Bedroom",
    power_consumption: 2000,
    usage_hours: 7,
    label: "AC Unit",
    status: true
  },
  {
    device_id: "light-bedroom-001",
    device_type: "light",
    room_location: "Bedroom",
    power_consumption: 40,
    usage_hours: 5,
    label: "Bedroom Light",
    status: false
  },
  {
    device_id: "sensor-bedroom-001",
    device_type: "sensor",
    room_location: "Bedroom",
    power_consumption: 5,
    usage_hours: 24,
    label: "Temperature Sensor",
    status: true
  },

  // Kitchen Devices
  {
    device_id: "ac-kitchen-001",
    device_type: "ac",
    room_location: "Kitchen",
    power_consumption: 1800,
    usage_hours: 6,
    label: "Kitchen AC",
    status: false
  },
  {
    device_id: "light-kitchen-001",
    device_type: "light",
    room_location: "Kitchen",
    power_consumption: 80,
    usage_hours: 4.5,
    label: "Kitchen Light",
    status: true
  },
  {
    device_id: "camera-kitchen-001",
    device_type: "camera",
    room_location: "Kitchen",
    power_consumption: 10,
    usage_hours: 10,
    label: "Security Camera",
    status: true
  },

  // Store Room Devices
  {
    device_id: "light-store-001",
    device_type: "light",
    room_location: "Store Room",
    power_consumption: 40,
    usage_hours: 3,
    label: "Store Room Light",
    status: false
  },
  {
    device_id: "camera-store-001",
    device_type: "camera",
    room_location: "Store Room",
    power_consumption: 10,
    usage_hours: 24,
    label: "Store Room Camera",
    status: true
  },

  // Bedroom2 Devices
  {
    device_id: "light-bedroom2-001",
    device_type: "light",
    room_location: "Bedroom2",
    power_consumption: 40,
    usage_hours: 5,
    label: "Bedroom 2 Light",
    status: false
  },
  {
    device_id: "ac-bedroom2-001",
    device_type: "ac",
    room_location: "Bedroom2",
    power_consumption: 1500,
    usage_hours: 6,
    label: "Bedroom 2 AC",
    status: false
  },

  // Parking Area Devices
  {
    device_id: "light-parking-001",
    device_type: "light",
    room_location: "Parking Area",
    power_consumption: 100,
    usage_hours: 12,
    label: "Parking Light",
    status: true
  },
  {
    device_id: "camera-parking-001",
    device_type: "camera",
    room_location: "Parking Area",
    power_consumption: 10,
    usage_hours: 24,
    label: "Parking Camera",
    status: true
  },

  // Movie Room Devices
  {
    device_id: "light-movie-001",
    device_type: "light",
    room_location: "Movie Room",
    power_consumption: 150,
    usage_hours: 4,
    label: "Movie Room Light",
    status: false
  },
  {
    device_id: "ac-movie-001",
    device_type: "ac",
    room_location: "Movie Room",
    power_consumption: 2000,
    usage_hours: 4,
    label: "Movie Room AC",
    status: true
  }
];

const sampleScenes = [
  { name: 'Good Morning', icon: '🌅', color: '#FFD700', devices: [] },
  { name: 'Movie Night', icon: '🎬', color: '#1a1a1a', devices: [] },
  { name: 'Away Mode', icon: '🚪', color: '#FF6B6B', devices: [] },
  { name: 'Bedtime', icon: '🛏️', color: '#4A90E2', devices: [] },
  { name: 'Party Mode', icon: '🎉', color: '#FF1493', devices: [] },
  { name: 'Energy Saver', icon: '⚡', color: '#2ECC71', devices: [] },
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-home-db');
    console.log('✓ Connected to MongoDB');

    // Clear existing data
    await Device.deleteMany({});
    await Scene.deleteMany({});
    console.log('✓ Cleared existing data');

    // Insert sample devices
    const insertedDevices = await Device.insertMany(sampleDevices);
    console.log(`✓ Inserted ${insertedDevices.length} sample devices`);

    // Update scenes with device IDs
    const updatedScenes = sampleScenes.map((scene, index) => ({
      ...scene,
      devices: insertedDevices.slice(0, 2).map(d => d._id.toString())
    }));

    // Insert sample scenes
    const insertedScenes = await Scene.insertMany(updatedScenes);
    console.log(`✓ Inserted ${insertedScenes.length} sample scenes`);

    // Disconnect
    await mongoose.connection.close();
    console.log('✓ Database seeded successfully!');
    console.log('\nSample Devices:');
    insertedDevices.forEach(device => {
      console.log(`  - ${device.label} (${device.room_location}): ${device.status ? 'ON' : 'OFF'}`);
    });
  } catch (error) {
    console.error('✗ Error seeding database:', error.message);
    process.exit(1);
  }
}

seedDatabase();
