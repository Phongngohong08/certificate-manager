const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { Wallets } = require('fabric-network');

const walletDir = path.join(process.cwd(), 'wallet');
if (!fs.existsSync(walletDir)) {
  fs.mkdirSync(walletDir);
}

/**
 * Tạo cặp khóa public/private cho user registration (ECDSA, prime256v1)
 * @returns {Object} Object chứa publicKey và privateKey ở dạng PEM
 */
function generateKeyPair() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', {
    namedCurve: 'prime256v1',
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  });
  return {
    publicKey,
    privateKey
  };
}

async function saveToFabricWallet(email, publicKey, privateKey) {
  const wallet = await Wallets.newFileSystemWallet(walletDir);
  const x509Identity = {
    credentials: {
      certificate: publicKey, // giả lập, thực tế cần certificate
      privateKey: privateKey,
    },
    mspId: 'Org1MSP',
    type: 'X.509',
  };
  await wallet.put(email, x509Identity);
}

/**
 * Đăng ký user với Fabric CA (giả lập)
 * @param {string} email Email của user
 * @returns {Object} Object chứa thông tin đăng ký
 */
async function registerUser(email) {
  try {
    // Tạo cặp khóa
    const keys = generateKeyPair();
    // Lưu vào ví Fabric chuẩn
    await saveToFabricWallet(email, keys.publicKey, keys.privateKey);
    // Trong thực tế, cần đăng ký user với Fabric CA để lấy certificate thật
    return {
      publicKey: keys.publicKey,
      success: true,
      message: `User ${email} registered successfully`
    };
  } catch (error) {
    console.error(`Failed to register user ${email}:`, error);
    throw error;
  }
}

module.exports = { registerUser, generateKeyPair };
