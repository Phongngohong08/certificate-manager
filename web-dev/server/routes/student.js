const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const Certificate = require('../models/certificate');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticateJWT } = require('../middleware/auth-middleware');

// Student registration
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, publicKey } = req.body;
    const existing = await Student.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Student already exists' });
    const hashed = await bcrypt.hash(password, 10);
    const student = await Student.create({ name, email, password: hashed, publicKey });
    res.status(201).json({ student });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Student login (JWT)
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

// Dashboard (bảo vệ bằng JWT)
router.get('/dashboard', authenticateJWT, async (req, res) => {
  try {
    // Lấy dữ liệu từ blockchain (giả lập)
    // TODO: Thay thế bằng gọi chaincode thực tế
    const ledgerData = [];
    // Lấy dữ liệu từ MongoDB
    const dbData = await Certificate.find();
    // Gộp dữ liệu
    const merged = require('../services/certificate-service').mergeCertificateData(dbData, ledgerData);
    res.json({ dashboard: merged });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all certificates for a student
router.get('/certificates', async (req, res) => {
  try {
    const { email } = req.query;
    const certs = await Certificate.find({ studentEmail: email });
    res.json({ certificates: certs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
