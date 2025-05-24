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

// Digital signature (placeholder, real implementation cần private key)
function createDigitalSignature(data, privateKey) {
  // TODO: Ký số thực tế bằng privateKey
  return crypto.createHash('sha256').update(data + privateKey).digest('hex');
}

// Verify signature (placeholder)
function verifySignature(data, signature, publicKey) {
  // TODO: Xác thực thực tế bằng publicKey
  return signature === crypto.createHash('sha256').update(data + publicKey).digest('hex');
}

module.exports = { generateMerkleRoot, createDigitalSignature, verifySignature };
