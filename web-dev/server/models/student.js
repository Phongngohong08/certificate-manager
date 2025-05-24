const mongoose = require('mongoose');
const validator = require('validator');

/**
 * @swagger
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       required:
 *         - email
 *         - name
 *         - password
 *         - publicKey
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         email:
 *           type: string
 *           format: email
 *           description: Student's email address
 *         name:
 *           type: string
 *           description: Student's full name
 *         password:
 *           type: string
 *           format: password
 *           description: Hashed password (not returned in responses)
 *         publicKey:
 *           type: string
 *           description: Public key for blockchain operations
 *       example:
 *         email: "student1@university.edu"
 *         name: "Nguyen Van A"
 *         password: "12345678"
 *         publicKey: "04a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1"
 */
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
