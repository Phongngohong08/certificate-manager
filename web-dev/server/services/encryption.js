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

module.exports = { generateMerkleRoot, createDigitalSignature, verifySignature };
