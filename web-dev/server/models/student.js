const mongoose = require('mongoose');
const validator = require('validator');

const studentSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email',
    },
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 2,
  },
  publicKey: {
    type: String,
    required: true,
    unique: true,
    minlength: 10,
  },
});

module.exports = mongoose.model('Student', studentSchema);
