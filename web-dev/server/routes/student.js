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
    
    // Debug logging
    console.log('=== DEBUG DASHBOARD API ===');
    console.log('Student email from JWT:', studentEmail);
    
    // Get certificates for this student
    const certificates = await Certificate.find({ studentEmail: studentEmail });
    console.log('Certificates found for dashboard:', certificates.length);
    
    // Calculate stats
    const stats = {
      totalCertificates: certificates.length,
      activeVerifications: certificates.filter(cert => !cert.revoked).length,
      profileViews: 0 // Placeholder for now
    };
    
    console.log('Dashboard stats:', stats);
    console.log('=== END DEBUG ===');
    
    res.json({ 
      stats: stats,
      certificates: certificates
    });
  } catch (err) {
    console.error('Error in dashboard API:', err);
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
    
    // Debug logging
    console.log('=== DEBUG CERTIFICATES API ===');
    console.log('JWT user object:', req.user);
    console.log('Student email from JWT:', studentEmail);
    console.log('Student email type:', typeof studentEmail);
    
    // Kiểm tra tất cả certificates trước
    const allCerts = await Certificate.find({});
    console.log('Total certificates in DB:', allCerts.length);
    
    if (allCerts.length > 0) {
      console.log('Sample certificate studentEmail:', allCerts[0].studentEmail);
      console.log('Sample certificate studentEmail type:', typeof allCerts[0].studentEmail);
      
      // Kiểm tra email match
      const emailMatches = allCerts.filter(cert => cert.studentEmail === studentEmail);
      console.log('Email exact matches:', emailMatches.length);
      
      // Kiểm tra với case-insensitive
      const emailMatchesIgnoreCase = allCerts.filter(cert => 
        cert.studentEmail.toLowerCase() === studentEmail.toLowerCase()
      );
      console.log('Email case-insensitive matches:', emailMatchesIgnoreCase.length);
      
      // Kiểm tra với trim
      const emailMatchesTrim = allCerts.filter(cert => 
        cert.studentEmail.trim() === studentEmail.trim()
      );
      console.log('Email trim matches:', emailMatchesTrim.length);
    }
    
    // Thử nhiều cách query khác nhau
    let certs = await Certificate.find({ studentEmail: studentEmail });
    
    // Nếu không tìm thấy, thử với regex case-insensitive
    if (certs.length === 0) {
      console.log('Trying case-insensitive search...');
      certs = await Certificate.find({ 
        studentEmail: { $regex: new RegExp(`^${studentEmail}$`, 'i') } 
      });
    }
    
    // Nếu vẫn không tìm thấy, thử với trim
    if (certs.length === 0) {
      console.log('Trying trimmed search...');
      certs = await Certificate.find({ 
        studentEmail: { $regex: new RegExp(`^\\s*${studentEmail.trim()}\\s*$`, 'i') } 
      });
    }
    
    console.log('Certificates found for student:', certs.length);
    console.log('=== END DEBUG ===');
    
    res.json({ certificates: certs });
  } catch (err) {
    console.error('Error in certificates API:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get a specific certificate by ID for a student
router.get('/certificates/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const studentEmail = req.user.email;
    
    // Debug logging
    console.log('=== DEBUG CERTIFICATE BY ID API ===');
    console.log('Certificate ID:', id);
    console.log('Student email from JWT:', studentEmail);
    
    // Find certificate by ID and ensure it belongs to this student
    const certificate = await Certificate.findOne({ 
      _id: id, 
      studentEmail: studentEmail 
    });
    
    console.log('Certificate found:', certificate ? 'Yes' : 'No');
    console.log('=== END DEBUG ===');
    
    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found or access denied' });
    }
    
    res.json({ certificate });
  } catch (err) {
    console.error('Error in certificate by ID API:', err);
    res.status(500).json({ error: err.message });
  }
});

// DEBUG API - Temporary endpoint to check data
router.get('/debug/certificates', authenticateJWT, async (req, res) => {
  try {
    const studentEmail = req.user.email;
    
    console.log('=== FULL DEBUG ===');
    console.log('JWT Token User:', JSON.stringify(req.user, null, 2));
    
    // Lấy tất cả certificates
    const allCerts = await Certificate.find({});
    console.log('All certificates in DB:', allCerts.length);
    
    // Log tất cả student emails trong DB
    const allEmails = allCerts.map(cert => cert.studentEmail);
    console.log('All student emails in DB:', allEmails);
    
    // So sánh với email từ JWT
    console.log('JWT Email:', `"${studentEmail}"`);
    console.log('JWT Email length:', studentEmail.length);
    
    // Tìm kiếm với nhiều cách
    const exactMatch = allCerts.filter(cert => cert.studentEmail === studentEmail);
    const trimMatch = allCerts.filter(cert => cert.studentEmail.trim() === studentEmail.trim());
    const lowerMatch = allCerts.filter(cert => cert.studentEmail.toLowerCase() === studentEmail.toLowerCase());
    
    console.log('Exact matches:', exactMatch.length);
    console.log('Trim matches:', trimMatch.length);
    console.log('Lowercase matches:', lowerMatch.length);
    
    // Kiểm tra từng certificate
    if (allCerts.length > 0) {
      allCerts.forEach((cert, index) => {
        console.log(`Certificate ${index + 1}:`);
        console.log(`  Email: "${cert.studentEmail}"`);
        console.log(`  Email length: ${cert.studentEmail.length}`);
        console.log(`  Student Name: ${cert.studentName}`);
        console.log(`  Match with JWT: ${cert.studentEmail === studentEmail}`);
      });
    }
    
    res.json({
      jwtUser: req.user,
      jwtEmail: studentEmail,
      totalCertificates: allCerts.length,
      allEmails: allEmails,
      exactMatches: exactMatch.length,
      trimMatches: trimMatch.length,
      lowercaseMatches: lowerMatch.length,
      certificates: allCerts
    });
  } catch (err) {
    console.error('Debug API error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
