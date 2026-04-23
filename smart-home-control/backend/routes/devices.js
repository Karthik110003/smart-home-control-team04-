const express = require('express');
const router = express.Router();
const Device = require('../models/Device');
const auth = require('../middleware/auth');

// GET all devices for current user
router.get('/', auth, async (req, res) => {
  try {
    const devices = await Device.find({ userId: req.userId });
    res.json({ success: true, data: devices });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ADD device
router.post('/', auth, async (req, res) => {
  try {
    const device = new Device({ userId: req.userId, ...req.body });
    await device.save();
    res.json({ success: true, data: device });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// UPDATE device
router.put('/:id', auth, async (req, res) => {
  try {
    const device = await Device.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    if (!device) return res.status(404).json({ success: false, error: 'Device not found' });
    res.json({ success: true, data: device });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE device
router.delete('/:id', auth, async (req, res) => {
  try {
    const device = await Device.findByIdAndDelete(req.params.id);
    if (!device) return res.status(404).json({ success: false, error: 'Device not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;