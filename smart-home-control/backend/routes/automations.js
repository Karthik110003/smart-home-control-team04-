const express = require('express');
const Automation = require('../models/Automation');
const auth = require('../middleware/auth');

const router = express.Router();

// GET all automations for current user
router.get('/', auth, async (req, res) => {
  try {
    const automations = await Automation.find({ userId: req.userId });
    res.json({ success: true, data: automations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST - Add a new automation
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, triggerTime, days, actions, active } = req.body;
    
    // Validation
    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, error: 'Automation name is required' });
    }
    if (!triggerTime || triggerTime.trim() === '') {
      return res.status(400).json({ success: false, error: 'Trigger time is required' });
    }
    if (!days || days.length === 0) {
      return res.status(400).json({ success: false, error: 'Please select at least one day' });
    }
    
    const newAutomation = new Automation({ 
      userId: req.userId, 
      name: name.trim(), 
      description, 
      triggerTime, 
      days, 
      actions, 
      active 
    });
    await newAutomation.save();
    res.status(201).json({ success: true, data: newAutomation });
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: 'An automation with this name already exists. Please use a different name.' });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT - Toggle automation active status
router.put('/:id/toggle', auth, async (req, res) => {
  try {
    const automation = await Automation.findById(req.params.id);
    if (!automation) return res.status(404).json({ success: false, error: 'Automation not found' });
    // Verify ownership
    if (automation.userId !== req.userId) {
      return res.status(403).json({ success: false, error: 'Unauthorized: This automation does not belong to your account' });
    }
    automation.active = !automation.active;
    await automation.save();
    res.json({ success: true, data: automation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT - Update automation details
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description, triggerTime, days, actions, active } = req.body;
    
    // Validation
    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, error: 'Automation name is required' });
    }
    if (!triggerTime || triggerTime.trim() === '') {
      return res.status(400).json({ success: false, error: 'Trigger time is required' });
    }
    if (!days || days.length === 0) {
      return res.status(400).json({ success: false, error: 'Please select at least one day' });
    }
    
    // Check ownership first
    const existingAutomation = await Automation.findById(req.params.id);
    if (!existingAutomation) {
      return res.status(404).json({ success: false, error: 'Automation not found' });
    }
    if (existingAutomation.userId !== req.userId) {
      return res.status(403).json({ success: false, error: 'Unauthorized: This automation does not belong to your account' });
    }
    
    const automation = await Automation.findByIdAndUpdate(
      req.params.id,
      { name: name.trim(), description, triggerTime, days, actions, active },
      { new: true, runValidators: true }
    );
    console.log('Updated automation:', automation);
    res.json({ success: true, data: automation });
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: 'An automation with this name already exists. Please use a different name.' });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE - Remove an automation
router.delete('/:id', auth, async (req, res) => {
  try {
    const automation = await Automation.findById(req.params.id);
    if (!automation) return res.status(404).json({ success: false, error: 'Automation not found' });
    // Verify ownership
    if (automation.userId !== req.userId) {
      return res.status(403).json({ success: false, error: 'Unauthorized: This automation does not belong to your account' });
    }
    const deleted = await Automation.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Automation deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
