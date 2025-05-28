const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const Certificate = require('../models/certificate');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticateJWT } = require('../middleware/auth-middleware');
const enrollment = require('../services/enrollment');

/**
 * @swagger
 * /api/student/register:
 *   post:
 *     summary: Register a new student
 *     tags: [Students]
 *     description: Register a new student in the system and generates blockchain identity
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: Student's full name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Student's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Password for student account
 *     responses:
 *       201:
 *         description: Student registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 student:
 *                   type: object
 *       400:
 *         description: Bad request - Student already exists or invalid data
 *       500:
 *         description: Server error
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await Student.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Student already exists' });
    
    // Tự động tạo public key thay vì yêu cầu người dùng nhập
    const keys = await enrollment.registerUser(email);
    
    const hashed = await bcrypt.hash(password, 10);
    const student = await Student.create({
      name,
      email,
      password: hashed,
      publicKey: keys.publicKey
    });
    res.status(201).json({ student });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/student/login:
 *   post:
 *     summary: Student login
 *     tags: [Students]
 *     description: Authenticate a student user and return a JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Student email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Student password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 student:
 *                   $ref: '#/components/schemas/Student'
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: Student not found
 *       500:
 *         description: Server error
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });
    if (!student) return res.status(404).json({ error: 'Not found' });
    const match = await bcrypt.compare(password, student.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    // Tạo JWT
    const token = jwt.sign({ email, type: 'student' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ student, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/student/dashboard:
 *   get:
 *     summary: Get student dashboard data
 *     tags: [Students]
 *     description: Retrieve dashboard data for student including certificates from both blockchain and MongoDB
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dashboard:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized - No JWT token provided
 *       403:
 *         description: Forbidden - Invalid JWT token
 *       500:
 *         description: Server error
 */
router.get('/dashboard', authenticateJWT, async (req, res) => {
  try {
    const studentEmail = req.user.email;
    
    // Get certificates for this student
    const certificates = await Certificate.find({ studentEmail: studentEmail });
    
    // Calculate stats
    const stats = {
      totalCertificates: certificates.length,
      activeVerifications: certificates.filter(cert => !cert.revoked).length,
      profileViews: 0 // Placeholder for now
    };
    
    res.json({ 
      stats: stats,
      certificates: certificates
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/student/list:
 *   get:
 *     summary: Get all students
 *     tags: [Students]
 *     description: Retrieve a list of all registered students (for university use)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of students retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 students:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       publicKey:
 *                         type: string
 *       401:
 *         description: Unauthorized - No JWT token provided
 *       403:
 *         description: Forbidden - Invalid JWT token
 *       500:
 *         description: Server error
 */
router.get('/list', authenticateJWT, async (req, res) => {
  try {
    // Lấy tất cả students, loại bỏ password khỏi response
    const students = await Student.find({}, { password: 0 });
    res.json({ students });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all certificates for a student
router.get('/certificates', authenticateJWT, async (req, res) => {
  try {
    // Get email from JWT token
    const studentEmail = req.user.email;
    const certs = await Certificate.find({ studentEmail: studentEmail });
    res.json({ certificates: certs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific certificate by ID for a student
router.get('/certificates/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const studentEmail = req.user.email;
    
    // Find certificate by ID and ensure it belongs to this student
    const certificate = await Certificate.findOne({ 
      _id: id, 
      studentEmail: studentEmail 
    });
    
    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found or access denied' });
    }
    
    res.json({ certificate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
