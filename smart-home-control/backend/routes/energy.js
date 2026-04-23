const express = require('express');
const Energy = require('../models/Energy');
const auth = require('../middleware/auth');

const router = express.Router();

// GET all energy records for current user
router.get('/', auth, async (req, res) => {
  try {
    const energy = await Energy.find({ userId: req.userId }).sort({ date: -1 }).limit(30);
    res.json({ success: true, data: energy });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET energy stats for current user (last 7 days)
router.get('/stats/weekly', auth, async (req, res) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const stats = await Energy.find({
      userId: req.userId,
      date: { $gte: sevenDaysAgo }
    }).sort({ date: 1 });
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST - Add a new energy record
router.post('/', auth, async (req, res) => {
  try {
    const { date, totalUsage, cost, averageUsage, co2Saved, categoryUsage } = req.body;
    if (!date || totalUsage == null || cost == null || averageUsage == null || co2Saved == null) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    const newEnergy = new Energy({ userId: req.userId, date, totalUsage, cost, averageUsage, co2Saved, categoryUsage });
    await newEnergy.save();
    res.status(201).json({ success: true, data: newEnergy });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE - Remove an energy record
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Energy.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Energy record not found' });
    res.json({ success: true, message: 'Energy record deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
