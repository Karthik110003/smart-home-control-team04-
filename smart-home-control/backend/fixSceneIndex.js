/**
 * Fix MongoDB Scene collection index
 * Drop old unique index and let mongoose recreate it
 */

const mongoose = require('mongoose');

async function fixSceneIndex() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-home-db');
    console.log('✓ Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('scenes');

    // Drop the old unique index on name
    try {
      await collection.dropIndex('name_1');
      console.log('✓ Dropped old unique index on name');
    } catch (err) {
      console.log('ℹ Old index not found (already dropped)');
    }

    // Drop duplicate key index if it exists
    try {
      await collection.dropIndex('userId_1_name_1');
      console.log('✓ Dropped existing compound index');
    } catch (err) {
      console.log('ℹ Compound index not found');
    }

    // Create the new compound unique index
    await collection.createIndex({ userId: 1, name: 1 }, { unique: true });
    console.log('✓ Created new compound unique index on (userId, name)');

    console.log('\n✓ Index migration complete!');
    await mongoose.connection.close();

  } catch (error) {
    console.error('✗ Error fixing index:', error.message);
    process.exit(1);
  }
}

fixSceneIndex();
