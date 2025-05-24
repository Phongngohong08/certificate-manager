const express = require('express');
const router = express.Router();
const fabric = require('../services/fabric');

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
    // Gọi chaincode để xác thực proof
    const result = await fabric.queryChaincode(
      'admin', // hoặc identity phù hợp
      'verifyCertificateProof',
      [JSON.stringify({ certUUID, disclosedData, proof })]
    );
    res.json({ verified: result === 'true' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
