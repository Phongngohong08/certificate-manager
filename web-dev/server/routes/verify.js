const express = require('express');
const router = express.Router();
const fabric = require('../services/fabric');
const proofService = require('../services/proof-service');
const Certificate = require('../models/certificate');

/**
 * @swagger
 * /api/verify/verify:
 *   post:
 *     summary: Verify certificate proof on blockchain
 *     tags: [Verification]
 *     description: Verifies the authenticity of a certificate using blockchain proof
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - certUUID
 *               - disclosedData
 *               - proof
 *             properties:
 *               certUUID:
 *                 type: string
 *                 description: Unique identifier of the certificate
 *               disclosedData:
 *                 type: object
 *                 description: The certificate data being disclosed for verification
 *               proof:
 *                 type: object
 *                 description: The cryptographic proof for verification
 *     responses:
 *       200:
 *         description: Verification result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 verified:
 *                   type: boolean
 *                   description: Whether the certificate is verified as authentic
 *       500:
 *         description: Server error
 */
router.post('/verify', async (req, res) => {
  try {
    const { certUUID, disclosedData, proof } = req.body;
    
    console.log('=== Verify Request Debug ===');
    console.log('certUUID:', certUUID);
    console.log('disclosedData:', disclosedData);
    console.log('proof type:', typeof proof);
    console.log('proof:', proof);
    
    if (!certUUID || !disclosedData || !proof) {
      return res.status(400).json({ 
        verified: false, 
        error: 'Missing required parameters: certUUID, disclosedData, and proof are all required' 
      });
    }

    // Log request structure for debugging
    console.log('Verify request:', {
      certUUID,
      disclosedData: Object.keys(disclosedData),
      proof: typeof proof === 'string' ? 'string' : Object.keys(proof)
    });    
    // Gọi chaincode để xác thực proof
    let result;
    try {
      result = await fabric.queryChaincode(
        'admin',
        'verifyCertificateProof',
        [JSON.stringify({ certUUID, disclosedData, proof })]
      );
    } catch (fabricError) {
      console.log('Fabric verification failed, trying local verification:', fabricError.message);
      
      // Fallback to local proof verification
      const proofService = require('../services/proof-service');
      const isValid = await proofService.verifyCertificateProof(proof, disclosedData);
      result = isValid ? 'true' : 'false';
    }
    
    const verified = result === 'true' || result === true;
    
    res.json({ 
      verified,
      certUUID,
      disclosedData: verified ? disclosedData : undefined,
      message: verified ? 'Certificate is authentic' : 'Certificate verification failed'
    });
  } catch (err) {
    console.error('Verification error:', err);
    res.status(500).json({ verified: false, error: err.message });
  }
});

/**
 * @swagger
 * /api/verify/verify:
 *   get:
 *     summary: Verify certificate by ID
 *     tags: [Verification]
 *     description: Verifies a certificate by its ID and returns certificate details if valid
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: Certificate ID to verify
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Verification result with certificate details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                   description: Whether the certificate is valid
 *                 certificate:
 *                   type: object
 *                   description: Certificate details if valid
 *                 message:
 *                   type: string
 *                   description: Status message
 *       400:
 *         description: Missing certificate ID
 *       404:
 *         description: Certificate not found
 *       500:
 *         description: Server error
 */
router.get('/verify', async (req, res) => {
  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ 
        valid: false, 
        error: 'Certificate ID is required' 
      });
    }

    // Find certificate in database
    const certificate = await Certificate.findById(id);
    
    if (!certificate) {
      return res.status(404).json({ 
        valid: false, 
        error: 'Certificate not found' 
      });
    }

    // Check if certificate is revoked
    if (certificate.revoked) {
      return res.json({ 
        valid: false,
        certificate: certificate,
        message: 'Certificate has been revoked'
      });
    }

    // For simple verification, we'll return the certificate as valid
    // In a full implementation, you might want to verify against blockchain
    res.json({ 
      valid: true,
      certificate: certificate,
      message: 'Certificate is valid and authentic'
    });
    
  } catch (err) {
    console.error('Verification error:', err);
    res.status(500).json({ 
      valid: false, 
      error: err.message 
    });
  }
});

module.exports = router;
