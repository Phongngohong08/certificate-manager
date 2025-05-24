const express = require('express');
const router = express.Router();
const University = require('../models/university');
const Student = require('../models/student');
const Certificate = require('../models/certificate');
const bcrypt = require('bcryptjs');
const fabric = require('../services/fabric');
const encryption = require('../services/encryption');
const jwt = require('jsonwebtoken');
const { authenticateJWT } = require('../middleware/auth-middleware');

// University registration
router.post('/register', async (req, res) => {
  try {
    const { name, email, description, location, password, publicKey } = req.body;
    const existing = await University.findOne({ email });
    if (existing) return res.status(400).json({ error: 'University already exists' });
    const hashed = await bcrypt.hash(password, 10);
    const university = await University.create({ name, email, description, location, password: hashed, publicKey });
    res.status(201).json({ university });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// University login (JWT)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const university = await University.findOne({ email });
    if (!university) return res.status(404).json({ error: 'Not found' });
    const match = await bcrypt.compare(password, university.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    // Tạo JWT
    const token = jwt.sign({ email, type: 'university' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ university, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Issue certificate (MongoDB + Blockchain)
router.post('/issue', async (req, res) => {
  try {
    // 1. Lưu vào MongoDB
    const cert = await Certificate.create(req.body);
    // 2. Sinh Merkle root từ dữ liệu chứng chỉ
    const values = Object.values(req.body);
    const merkleRoot = encryption.generateMerkleRoot(values);
    // 3. Ghi lên blockchain
    await fabric.invokeChaincode(
      req.body.universityEmail, // userId (identity)
      'issueCertificate', // function name trên chaincode
      [JSON.stringify({ ...req.body, merkleRoot })]
    );
    res.status(201).json({ certificate: cert, merkleRoot });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all certificates for a university
router.get('/certificates', async (req, res) => {
  try {
    const { email } = req.query;
    const certs = await Certificate.find({ universityEmail: email });
    res.json({ certificates: certs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dashboard tổng hợp dữ liệu từ blockchain và MongoDB
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

module.exports = router;
