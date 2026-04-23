/**
 * Seed Harika account with sample devices and scenes
 * Run this script with: node seedHarikaAccount.js
 */

const mongoose = require('mongoose');
const User = require('./models/User');
const Device = require('./models/Device');
const Scene = require('./models/Scene');

const sampleDevices = [
  // Living Room Devices
  {
    device_id: "harika-light-living-001",
    device_type: "light",
    room_location: "Living Room",
    power_consumption: 60,
    usage_hours: 8.5,
    label: "Main Light",
    status: false
  },
  {
    device_id: "harika-fan-living-001",
    device_type: "fan",
    room_location: "Living Room",
    power_consumption: 75,
    usage_hours: 6,
    label: "Ceiling Fan",
    status: false
  },

  // Bedroom Devices
  {
    device_id: "harika-ac-bedroom-001",
    device_type: "ac",
    room_location: "Bedroom",
    power_consumption: 2000,
    usage_hours: 7,
    label: "AC Unit",
    status: true
  },
  {
    device_id: "harika-light-bedroom-001",
    device_type: "light",
    room_location: "Bedroom",
    power_consumption: 40,
    usage_hours: 5,
    label: "Bedroom Light",
    status: false
  },
  {
    device_id: "harika-sensor-bedroom-001",
    device_type: "sensor",
    room_location: "Bedroom",
    power_consumption: 5,
    usage_hours: 24,
    label: "Temperature Sensor",
    status: true
  },

  // Kitchen Devices
  {
    device_id: "harika-ac-kitchen-001",
    device_type: "ac",
    room_location: "Kitchen",
    power_consumption: 1800,
    usage_hours: 6,
    label: "Kitchen AC",
    status: false
  },
  {
    device_id: "harika-light-kitchen-001",
    device_type: "light",
    room_location: "Kitchen",
    power_consumption: 80,
    usage_hours: 4.5,
    label: "Kitchen Light",
    status: true
  },
  {
    device_id: "harika-camera-kitchen-001",
    device_type: "camera",
    room_location: "Kitchen",
    power_consumption: 10,
    usage_hours: 10,
    label: "Security Camera",
    status: true
  },

  // Store Room Devices
  {
    device_id: "harika-light-store-001",
    device_type: "light",
    room_location: "Store Room",
    power_consumption: 40,
    usage_hours: 3,
    label: "Store Room Light",
    status: false
  },
  {
    device_id: "harika-camera-store-001",
    device_type: "camera",
    room_location: "Store Room",
    power_consumption: 10,
    usage_hours: 24,
    label: "Store Room Camera",
    status: true
  },

  // Parking Area Devices
  {
    device_id: "harika-light-parking-001",
    device_type: "light",
    room_location: "Parking Area",
    power_consumption: 100,
    usage_hours: 12,
    label: "Parking Light",
    status: true
  },
  {
    device_id: "harika-camera-parking-001",
    device_type: "camera",
    room_location: "Parking Area",
    power_consumption: 10,
    usage_hours: 24,
    label: "Parking Camera",
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

async function seedHarikaAccount() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-home-db');
    console.log('✓ Connected to MongoDB');

    // Create or find Harika user
    let harikaUser = await User.findOne({ email: 'harika@example.com' });
    
    if (!harikaUser) {
      // Create new Harika user
      harikaUser = new User({
        userId: new Date().getTime().toString(),
        name: 'Harika',
        email: 'harika@example.com',
        password: 'Harika@123' // Will be hashed by model pre-hook
      });
      await harikaUser.save();
      console.log('✓ Created Harika user account');
      console.log(`  Email: ${harikaUser.email}`);
      console.log(`  Password: Harika@123`);
    } else {
      console.log('✓ Harika user already exists');
    }

    const harikaUserId = harikaUser._id.toString();
    console.log(`  User ID: ${harikaUserId}`);

    // Clear existing devices and scenes for Harika
    await Device.deleteMany({ userId: harikaUserId });
    await Scene.deleteMany({ userId: harikaUserId });
    console.log('✓ Cleared existing devices and scenes for Harika');

    // Add userId to devices
    const devicesWithUserId = sampleDevices.map(device => ({
      ...device,
      userId: harikaUserId
    }));

    // Insert sample devices for Harika
    const insertedDevices = await Device.insertMany(devicesWithUserId);
    console.log(`✓ Inserted ${insertedDevices.length} sample devices for Harika`);

    // Update scenes with device IDs and userId
    const updatedScenes = sampleScenes.map(scene => ({
      ...scene,
      userId: harikaUserId,
      devices: insertedDevices.slice(0, 2).map(d => d._id.toString())
    }));

    // Insert sample scenes for Harika
    const insertedScenes = await Scene.insertMany(updatedScenes);
    console.log(`✓ Inserted ${insertedScenes.length} sample scenes for Harika`);

    // Display summary
    console.log('\n📱 Harika Account Summary:');
    console.log('─'.repeat(50));
    console.log('\n🏠 Sample Devices:');
    insertedDevices.forEach(device => {
      console.log(`  • ${device.label} (${device.room_location}) - ${device.status ? '✓ ON' : '✗ OFF'}`);
    });

    console.log('\n🎬 Sample Scenes:');
    insertedScenes.forEach(scene => {
      console.log(`  • ${scene.icon} ${scene.name}`);
    });

    // Disconnect
    await mongoose.connection.close();
    console.log('\n✓ Harika account seeded successfully!');
    console.log('\nLogin with:');
    console.log(`  Email: harika@example.com`);
    console.log(`  Password: Harika@123`);

  } catch (error) {
    console.error('✗ Error seeding Harika account:', error.message);
    process.exit(1);
  }
}

seedHarikaAccount();
