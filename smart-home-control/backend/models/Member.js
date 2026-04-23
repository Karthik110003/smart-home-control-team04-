const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a member name'],
    trim: true
  },
  rollNumber: {
    type: String,
    required: [true, 'Please provide a roll number'],
    trim: true
  },
  year: {
    type: String,
    required: [true, 'Please provide year'],
    trim: true
  },
  degree: {
    type: String,
    required: [true, 'Please provide degree'],
    trim: true
  },
  aboutProject: {
    type: String,
    trim: true,
    default: ''
  },
  hobbies: {
    type: String,
    trim: true,
    default: ''
  },
  certificate: {
    type: String,
    trim: true,
    default: ''
  },
  internship: {
    type: String,
    trim: true,
    default: ''
  },
  aboutAim: {
    type: String,
    trim: true,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt before saving
MemberSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Member', MemberSchema);
