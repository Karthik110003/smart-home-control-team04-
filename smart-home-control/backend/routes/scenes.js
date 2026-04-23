const express = require('express');
const Scene = require('../models/Scene');
const auth = require('../middleware/auth');

const router = express.Router();

// GET all scenes for current user
router.get('/', auth, async (req, res) => {
  try {
    const scenes = await Scene.find({ userId: req.userId });
    res.json({ success: true, data: scenes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST - Add a new scene
router.post('/', auth, async (req, res) => {
  try {
    const { name, icon, color, devices } = req.body;
    if (!name || !icon || !color) {
      return res.status(400).json({ success: false, error: 'Missing required fields: name, icon, color' });
    }
    const newScene = new Scene({ userId: req.userId, name, icon, color, devices });
    await newScene.save();
    res.status(201).json({ success: true, data: newScene });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE - Remove a scene
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Scene.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Scene not found' });
    res.json({ success: true, message: 'Scene deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
