const express = require('express');
const router = express.Router();
const fabric = require('../services/fabric');
const proofService = require('../services/proof-service');

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
    const result = await fabric.queryChaincode(
      'admin',
      'verifyCertificateProof',
      [JSON.stringify({ certUUID, disclosedData, proof })]
    );
    
    const verified = result === 'true';
    
    res.json({ 
      verified,
      certUUID,
      message: verified ? 'Certificate is authentic' : 'Certificate verification failed'
    });
  } catch (err) {
    console.error('Verification error:', err);
    res.status(500).json({ verified: false, error: err.message });
  }
});

module.exports = router;
