const express = require('express');
const router = express.Router();
const Certificate = require('../models/certificate');

/**
 * @swagger
 * /api/certificate:
 *   get:
 *     summary: Get all certificates
 *     tags: [Certificates]
 *     description: Retrieve a list of all certificates in the system
 *     responses:
 *       200:
 *         description: A list of certificates
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 certificates:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Certificate'
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
  try {
    const certs = await Certificate.find();
    res.json({ certificates: certs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/certificate/{id}:
 *   get:
 *     summary: Get a certificate by ID
 *     tags: [Certificates]
 *     description: Retrieve a specific certificate by its MongoDB ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the certificate to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A certificate object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 certificate:
 *                   $ref: '#/components/schemas/Certificate'
 *       404:
 *         description: Certificate not found
 *       500:
 *         description: Server error
 */
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
