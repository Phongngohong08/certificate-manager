const express = require('express');
const router = express.Router();
const University = require('../models/university');
const Student = require('../models/student');
const Certificate = require('../models/certificate');
const bcrypt = require('bcryptjs');
const fabric = require('../services/fabric');
const encryption = require('../services/encryption');
const enrollment = require('../services/enrollment');
const jwt = require('jsonwebtoken');
const { authenticateJWT } = require('../middleware/auth-middleware');

/**
 * @swagger
 * /api/university/register:
 *   post:
 *     summary: Register a new university
 *     tags: [Universities]
 *     description: Register a new university in the system and generates blockchain identity
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - description
 *               - location
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: University name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: University email address
 *               description:
 *                 type: string
 *                 description: Brief description of the university
 *               location:
 *                 type: string
 *                 description: Physical location of the university
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Password for university account
 *     responses:
 *       201:
 *         description: University registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 university:
 *                   type: object
 *       400:
 *         description: Bad request - University already exists or invalid data
 *       500:
 *         description: Server error
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, description, location, password } = req.body;
    const existing = await University.findOne({ email });
    if (existing) return res.status(400).json({ error: 'University already exists' });
    
    // Tự động tạo public key thay vì yêu cầu người dùng nhập
    const keys = await enrollment.registerUser(email);
    
    const hashed = await bcrypt.hash(password, 10);
    const university = await University.create({
      name,
      email,
      description,
      location,
      password: hashed,
      publicKey: keys.publicKey
    });
    res.status(201).json({ university });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/university/login:
 *   post:
 *     summary: University login
 *     tags: [Universities]
 *     description: Authenticate a university user and return a JWT token
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
 *                 description: University email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: University password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 university:
 *                   $ref: '#/components/schemas/University'
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: University not found
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /api/university/issue:
 *   post:
 *     summary: Issue a new certificate
 *     tags: [Universities]
 *     description: Issue a new academic certificate and store it in MongoDB and on the blockchain
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Certificate'
 *     responses:
 *       201:
 *         description: Certificate issued successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 certificate:
 *                   $ref: '#/components/schemas/Certificate'
 *                 merkleRoot:
 *                   type: string
 *                   description: Merkle root hash of certificate data
 *       400:
 *         description: Invalid certificate data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /api/university/dashboard:
 *   get:
 *     summary: Get university dashboard data
 *     tags: [Universities]
 *     description: Retrieve dashboard data for university including certificates from both blockchain and MongoDB
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
