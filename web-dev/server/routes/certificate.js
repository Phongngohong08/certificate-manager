const express = require('express');
const router = express.Router();
const Certificate = require('../models/certificate');

// Get all certificates
router.get('/', async (req, res) => {
  try {
    const certs = await Certificate.find();
    res.json({ certificates: certs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get certificate by ID
router.get('/:id', async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) return res.status(404).json({ error: 'Not found' });
    res.json({ certificate: cert });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
