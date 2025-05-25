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
 * Đăng ký user với Fabric CA
 * @param {string} email Email của user
 * @param {string} role Role của user (university hoặc student)
 * @returns {Object} Object chứa thông tin đăng ký
 */
async function registerUser(email, role = 'university') {
  try {
    // Sử dụng hàm đăng ký user chính thức với Fabric CA
    const registerAndEnrollUser = require('../registerUser');
    const result = await registerAndEnrollUser(email, role);
    
    if (!result.success) {
      throw new Error(result.message);
    }
    
    // Lấy public key từ wallet sau khi đăng ký
    const wallet = await Wallets.newFileSystemWallet(walletDir);
    const identity = await wallet.get(email);
    if (!identity) {
      throw new Error(`Identity for user ${email} not found in wallet after registration`);
    }
    
    // Trả về public key từ certificate
    return {
      publicKey: identity.credentials.certificate,
      success: true,
      message: `User ${email} registered successfully with Fabric CA`
    };
  } catch (error) {
    console.error(`Failed to register user ${email}:`, error);
    throw error;
  }
}

module.exports = { registerUser, generateKeyPair };
