const mongoose = require('mongoose');
const validator = require('validator');

const certificateSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
    trim: true,
  },
  studentEmail: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email',
    },
  },
  universityName: {
    type: String,
    required: true,
    trim: true,
  },
  universityEmail: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email',
    },
  },
  major: {
    type: String,
    required: true,
    trim: true,
  },
  departmentName: {
    type: String,
    required: true,
    trim: true,
  },
  cgpa: {
    type: String,
    required: true,
    trim: true,
  },
  dateOfIssue: {
    type: Date,
    required: true,
  },
  certificateId: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model('Certificate', certificateSchema);
