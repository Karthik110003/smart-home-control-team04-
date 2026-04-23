/**
 * Fix MongoDB Device collection index
 * Drop old unique index and create compound unique index
 */

const mongoose = require('mongoose');

async function fixDeviceIndex() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-home-db');
    console.log('✓ Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('devices');

    // Drop the old unique index on device_id
    try {
      await collection.dropIndex('device_id_1');
      console.log('✓ Dropped old unique index on device_id');
    } catch (err) {
      console.log('ℹ Old index not found (already dropped)');
    }

    // Drop duplicate key index if it exists
    try {
      await collection.dropIndex('userId_1_device_id_1');
      console.log('✓ Dropped existing compound index');
    } catch (err) {
      console.log('ℹ Compound index not found');
    }

    // Create the new compound unique index
    await collection.createIndex({ userId: 1, device_id: 1 }, { unique: true });
    console.log('✓ Created new compound unique index on (userId, device_id)');

    console.log('\n✓ Index migration complete!');
    await mongoose.connection.close();

  } catch (error) {
    console.error('✗ Error fixing index:', error.message);
    process.exit(1);
  }
}

fixDeviceIndex();
