const mongoose = require('mongoose');
const validator = require('validator');

/**
 * @swagger
 * components:
 *   schemas:
 *     Certificate:
 *       type: object
 *       required:
 *         - studentName
 *         - studentEmail
 *         - universityName
 *         - universityEmail
 *         - major
 *         - departmentName
 *         - cgpa
 *         - dateOfIssue
 *         - certificateId
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         studentName:
 *           type: string
 *           description: Name of the student
 *         studentEmail:
 *           type: string
 *           format: email
 *           description: Email address of the student
 *         universityName:
 *           type: string
 *           description: Name of the issuing university
 *         universityEmail:
 *           type: string
 *           format: email
 *           description: Email address of the issuing university
 *         major:
 *           type: string
 *           description: Student's major field of study
 *         departmentName:
 *           type: string
 *           description: Name of the department
 *         cgpa:
 *           type: string
 *           description: Cumulative Grade Point Average
 *         dateOfIssue:
 *           type: string
 *           format: date
 *           description: Date when certificate was issued
 *         certificateId:
 *           type: string
 *           description: Unique identifier for the certificate
 *       example:
 *         studentName: "Nguyen Van A"
 *         studentEmail: "student1@university.edu"
 *         universityName: "Hanoi University of Science and Technology"
 *         universityEmail: "admin@hust.edu.vn"
 *         major: "Information Technology"
 *         departmentName: "School of Information and Communication Technology"
 *         cgpa: "3.75"
 *         dateOfIssue: "2025-05-24"
 *         certificateId: "HUST-2025-0001"
 */
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
