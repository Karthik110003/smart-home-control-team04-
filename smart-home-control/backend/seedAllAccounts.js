/**
 * Add devices and scenes to ALL existing user accounts
 * Run this script with: node seedAllAccounts.js
 */

const mongoose = require('mongoose');
const User = require('./models/User');
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
  { name: 'Good Morning', icon: '🌅', color: '#FFD700' },
  { name: 'Movie Night', icon: '🎬', color: '#1a1a1a' },
  { name: 'Away Mode', icon: '🚪', color: '#FF6B6B' },
  { name: 'Bedtime', icon: '🛏️', color: '#4A90E2' },
  { name: 'Party Mode', icon: '🎉', color: '#FF1493' },
  { name: 'Energy Saver', icon: '⚡', color: '#2ECC71' },
];

async function seedAllAccounts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-home-db');
    console.log('✓ Connected to MongoDB\n');

    // Get all users
    const allUsers = await User.find();
    console.log(`Found ${allUsers.length} user account(s)\n`);

    if (allUsers.length === 0) {
      console.log('⚠️  No user accounts found. Please create accounts first.');
      await mongoose.connection.close();
      return;
    }

    // Process each user
    let totalDevices = 0;
    let totalScenes = 0;

    for (const user of allUsers) {
      console.log(`📱 Processing account: ${user.name} (${user.email})`);
      const userId = user._id.toString();

      // Clear existing devices and scenes for this user
      await Device.deleteMany({ userId });
      await Scene.deleteMany({ userId });

      // Add devices
      const devicesWithUserId = sampleDevices.map(device => ({
        ...device,
        userId,
        device_id: `${user.name.toLowerCase()}-${device.device_id}`
      }));

      const insertedDevices = await Device.insertMany(devicesWithUserId);
      console.log(`  ✓ Added ${insertedDevices.length} devices`);
      totalDevices += insertedDevices.length;

      // Add scenes
      const scenesWithUserId = sampleScenes.map(scene => ({
        ...scene,
        userId,
        devices: insertedDevices.slice(0, 2).map(d => d._id.toString())
      }));

      const insertedScenes = await Scene.insertMany(scenesWithUserId);
      console.log(`  ✓ Added ${insertedScenes.length} scenes`);
      totalScenes += insertedScenes.length;

      console.log('');
    }

    // Display summary
    console.log('═'.repeat(60));
    console.log('📊 SEEDING COMPLETE');
    console.log('═'.repeat(60));
    console.log(`✓ Total Accounts Processed: ${allUsers.length}`);
    console.log(`✓ Total Devices Added: ${totalDevices}`);
    console.log(`✓ Total Scenes Added: ${totalScenes}`);
    console.log('\n📱 Accounts with devices and scenes:');
    allUsers.forEach(user => {
      console.log(`  • ${user.name} (${user.email})`);
    });

    // Disconnect
    await mongoose.connection.close();
    console.log('\n✓ All accounts seeded successfully!');

  } catch (error) {
    console.error('✗ Error seeding accounts:', error.message);
    process.exit(1);
  }
}

seedAllAccounts();
