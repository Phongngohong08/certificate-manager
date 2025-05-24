const express = require('express');
const router = express.Router();
const Certificate = require('../models/certificate');
const fabric = require('../services/fabric');
const certificateService = require('../services/certificate-service');

/**
 * @swagger
 * /api/generateProof:
 *   get:
 *     summary: Generate a certificate proof
 *     tags: [API]
 *     description: Generate a Merkle proof for selected certificate attributes that can be used for verification
 *     parameters:
 *       - in: query
 *         name: sharedAttributes
 *         required: true
 *         description: Comma-separated list of attributes to include in the proof
 *         schema:
 *           type: string
 *       - in: query
 *         name: certUUID
 *         required: true
 *         description: Certificate UUID to generate proof for
 *         schema:
 *           type: string
 *       - in: query
 *         name: email
 *         required: true
 *         description: Email of the user requesting the proof
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Generated proof and disclosed data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 proof:
 *                   type: object
 *                   description: Cryptographic proof for the certificate
 *                 disclosedData:
 *                   type: object
 *                   description: Selected certificate attributes
 *                 certUUID:
 *                   type: string
 *                   description: Certificate UUID
 *       400:
 *         description: Missing parameters
 *       404:
 *         description: Certificate not found
 *       500:
 *         description: Server error
 */
// Sinh Merkle proof và trả về dữ liệu chứng chỉ đã chọn
router.get('/generateProof', async (req, res) => {
  try {
    const { sharedAttributes, certUUID, email } = req.query;
    if (!sharedAttributes || !certUUID) return res.status(400).json({ error: 'Thiếu tham số' });
    const attrs = Array.isArray(sharedAttributes) ? sharedAttributes : sharedAttributes.split(',');
    const cert = await Certificate.findById(certUUID);
    if (!cert) return res.status(404).json({ error: 'Không tìm thấy chứng chỉ' });
    // Lấy proof từ blockchain (giả lập)
    const proof = await fabric.queryChaincode(email, 'generateCertificateProof', [JSON.stringify({ sharedAttributes: attrs, certUUID, email })]);
    // Lấy dữ liệu đã chọn
    const disclosedData = attrs.reduce((obj, key) => { obj[key] = cert[key]; return obj; }, {});
    res.json({ proof, disclosedData, certUUID });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
