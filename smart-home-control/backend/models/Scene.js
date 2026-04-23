const mongoose = require('mongoose');

const sceneSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  name: { type: String, required: true },
  icon: { type: String, required: true },
  color: { type: String, required: true },
  devices: [{ type: String }], // device_ids or names
  createdAt: { type: Date, default: Date.now }
});

// Compound unique index: scene names are unique per user (not globally)
sceneSchema.index({ userId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Scene', sceneSchema);
