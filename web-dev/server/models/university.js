const mongoose = require('mongoose');
const validator = require('validator');

/**
 * @swagger
 * components:
 *   schemas:
 *     University:
 *       type: object
 *       required:
 *         - email
 *         - name
 *         - description
 *         - location
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         email:
 *           type: string
 *           format: email
 *           description: University email address
 *         name:
 *           type: string
 *           description: Name of the university
 *         description:
 *           type: string
 *           description: Brief description of the university
 *         location:
 *           type: string
 *           description: Physical location of the university
 *         publicKey:
 *           type: string
 *           description: Public key for blockchain operations
 *         password:
 *           type: string
 *           format: password
 *           description: Hashed password (not returned in responses)
 *       example:
 *         email: "admin@hust.edu.vn"
 *         name: "Hanoi University of Science and Technology"
 *         description: "Top technical university in Vietnam"
 *         location: "1 Dai Co Viet, Hai Ba Trung, Ha Noi"
 *         password: "12345678"
 *         publicKey: "04b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1"
 */
const universitySchema = new mongoose.Schema({
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
    unique: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
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
    minlength: 10,
  },
});

module.exports = mongoose.model('University', universitySchema);
