const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Member = require('../models/Member');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed'));
    }
  }
});

// GET all members
router.get('/', async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch members',
      message: error.message
    });
  }
});

// GET single member by ID
router.get('/:id', async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({
        success: false,
        error: 'Member not found'
      });
    }
    res.json({
      success: true,
      data: member
    });
  } catch (error) {
    console.error('Error fetching member:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch member',
      message: error.message
    });
  }
});

// POST create new member with image upload
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, rollNumber, year, degree, aboutProject, hobbies, certificate, internship, aboutAim } = req.body;

    // Validation
    if (!name || !rollNumber || !year || !degree) {
      // Clean up uploaded file if validation fails
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        success: false,
        error: 'Please provide name, roll number, year, and degree'
      });
    }

    // Check if roll number already exists
    const existingMember = await Member.findOne({ rollNumber: rollNumber.trim() });
    if (existingMember) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        success: false,
        error: 'A member with this roll number already exists'
      });
    }

    const memberData = {
      name: name.trim(),
      rollNumber: rollNumber.trim(),
      year: year.trim(),
      degree: degree.trim(),
      aboutProject: aboutProject ? aboutProject.trim() : '',
      hobbies: hobbies ? hobbies.trim() : '',
      certificate: certificate ? certificate.trim() : '',
      internship: internship ? internship.trim() : '',
      aboutAim: aboutAim ? aboutAim.trim() : '',
      image: req.file ? req.file.filename : ''
    };

    const member = await Member.create(memberData);

    res.status(201).json({
      success: true,
      message: 'Member added successfully',
      data: member
    });
  } catch (error) {
    // Clean up uploaded file on error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Error creating member:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create member',
      message: error.message
    });
  }
});

// PUT update member with optional image upload
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, rollNumber, year, degree, aboutProject, hobbies, certificate, internship, aboutAim } = req.body;
    const member = await Member.findById(req.params.id);

    if (!member) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({
        success: false,
        error: 'Member not found'
      });
    }

    // Check if new roll number is different and already exists
    if (rollNumber && rollNumber.trim() !== member.rollNumber) {
      const existingMember = await Member.findOne({ rollNumber: rollNumber.trim() });
      if (existingMember) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({
          success: false,
          error: 'A member with this roll number already exists'
        });
      }
    }

    // Update fields
    if (name) member.name = name.trim();
    if (rollNumber) member.rollNumber = rollNumber.trim();
    if (year) member.year = year.trim();
    if (degree) member.degree = degree.trim();
    if (aboutProject !== undefined) member.aboutProject = aboutProject.trim();
    if (hobbies !== undefined) member.hobbies = hobbies.trim();
    if (certificate !== undefined) member.certificate = certificate.trim();
    if (internship !== undefined) member.internship = internship.trim();
    if (aboutAim !== undefined) member.aboutAim = aboutAim.trim();

    // Handle image update
    if (req.file) {
      // Delete old image if it exists
      if (member.image) {
        const oldImagePath = path.join(uploadsDir, member.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      member.image = req.file.filename;
    }

    await member.save();

    res.json({
      success: true,
      message: 'Member updated successfully',
      data: member
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Error updating member:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update member',
      message: error.message
    });
  }
});

// DELETE member
router.delete('/:id', async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        error: 'Member not found'
      });
    }

    // Delete member's image if it exists
    if (member.image) {
      const imagePath = path.join(uploadsDir, member.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.json({
      success: true,
      message: 'Member deleted successfully',
      data: member
    });
  } catch (error) {
    console.error('Error deleting member:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete member',
      message: error.message
    });
  }
});

module.exports = router;
