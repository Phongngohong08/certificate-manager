const express = require('express');
const router = express.Router();
const fabric = require('../services/fabric');

// Verify certificate proof (blockchain)
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
