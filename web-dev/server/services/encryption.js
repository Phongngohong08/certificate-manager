const crypto = require('crypto');

// Merkle tree root from array of values
function generateMerkleRoot(values) {
  if (!Array.isArray(values) || values.length === 0) return null;
  let nodes = values.map(v => crypto.createHash('sha256').update(v).digest('hex'));
  while (nodes.length > 1) {
    let temp = [];
    for (let i = 0; i < nodes.length; i += 2) {
      if (i + 1 < nodes.length) {
        temp.push(crypto.createHash('sha256').update(nodes[i] + nodes[i + 1]).digest('hex'));
      } else {
        temp.push(nodes[i]);
      }
    }
    nodes = temp;
  }
  return nodes[0];
}

// Digital signature thực sự bằng ECDSA private key PEM
function createDigitalSignature(data, privateKeyPEM) {
  const sign = crypto.createSign('SHA256');
  sign.update(data);
  sign.end();
  // privateKeyPEM là chuỗi PEM lấy từ Fabric wallet
  return sign.sign(privateKeyPEM, 'hex');
}

// Xác thực chữ ký số thực sự bằng ECDSA public key PEM
function verifySignature(data, signatureHex, publicKeyPEM) {
  const verify = crypto.createVerify('SHA256');
  verify.update(data);
  verify.end();
  return verify.verify(publicKeyPEM, Buffer.from(signatureHex, 'hex'));
}

/**
 * Generate a certificate proof for selective disclosure of attributes
 * @param {Array<String>} attributesToShare - List of attribute names to share
 * @param {String} certificateId - Certificate ID 
 * @param {String} userEmail - Email of the certificate holder
 * @returns {Object} Proof object with selected attributes
 */
async function generateCertificateProof(attributesToShare, certificateId, userEmail) {
  // Create a hash of the certificate data with only the selected attributes
  if (!Array.isArray(attributesToShare) || attributesToShare.length === 0) {
    throw new Error('At least one attribute must be shared');
  }

  // In a real implementation, we would create a Merkle tree of all certificate attributes
  // and return a proof for just the selected attributes
  // For simplicity in this implementation, we'll hash the selected attributes together
  const certData = { 
    certificateId,
    userEmail,
    selectedAttributes: attributesToShare,
    timestamp: Date.now()
  };
  
  // Create a proof hash of the selected data
  const proofHash = crypto.createHash('sha256')
    .update(JSON.stringify(certData))
    .digest('hex');
  
  // Generate a random nonce for the proof  
  const nonce = crypto.randomBytes(16).toString('hex');
  
  return {
    proofHash,
    nonce,
    timestamp: Date.now(),
    certificateId,
    selectedAttributes: attributesToShare
  };
}

module.exports = { generateMerkleRoot, createDigitalSignature, verifySignature, generateCertificateProof };
