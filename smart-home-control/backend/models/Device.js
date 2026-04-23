const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true
    },
    device_id: {
      type: String,
      required: true,
    },
    device_type: {
      type: String,
      required: true,
      enum: ['light', 'fan', 'ac', 'camera', 'sensor']
    },
    room_location: {
      type: String,
      required: true,
      enum: ['Living Room', 'Bedroom', 'Kitchen', 'Store Room', 'Bedroom2', 'Parking Area', 'Movie Room']
    },
    power_consumption: {
      type: Number,
      required: true,
      default: 0
    },
    usage_hours: {
      type: Number,
      required: true,
      default: 0
    },
    status: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

// Compound unique index: device IDs are unique per user
deviceSchema.index({ userId: 1, device_id: 1 }, { unique: true });

module.exports = mongoose.model('Device', deviceSchema);
