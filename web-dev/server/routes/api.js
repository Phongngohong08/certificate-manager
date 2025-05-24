const express = require('express');
const router = express.Router();
const Certificate = require('../models/certificate');
const fabric = require('../services/fabric');
const certificateService = require('../services/certificate-service');

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
