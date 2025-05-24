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
