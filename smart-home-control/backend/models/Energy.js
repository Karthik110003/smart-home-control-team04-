const mongoose = require('mongoose');

const energySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  date: { type: Date, required: true },
  totalUsage: { type: Number, required: true }, // kWh
  cost: { type: Number, required: true }, // $ or local currency
  averageUsage: { type: Number, required: true }, // kWh
  co2Saved: { type: Number, required: true }, // kg
  categoryUsage: {
    type: Map,
    of: Number // e.g. { 'Lighting': 10, 'HVAC': 20 }
  }
});

module.exports = mongoose.model('Energy', energySchema);
