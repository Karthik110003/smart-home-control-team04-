const mongoose = require('mongoose');

const automationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  name: { type: String, required: true },
  description: { type: String },
  triggerTime: { type: String }, // e.g. '07:00', '22:00'
  days: [{ 
    type: String, 
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  }], // Days of week
  actions: [{ type: String }], // e.g. ['Turn on Light', 'Set AC to 24C']
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// Compound unique index: automation names are unique per user
automationSchema.index({ userId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Automation', automationSchema);
