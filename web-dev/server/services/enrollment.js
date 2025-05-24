const crypto = require('crypto');

/**
 * Tạo cặp khóa public/private cho user registration
 * @returns {Object} Object chứa publicKey và privateKey
 */
function generateKeyPair() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  });
  
  // Trả về public key dạng hex string để lưu vào DB
  const publicKeyHex = Buffer.from(publicKey).toString('hex');
  return {
    publicKey: publicKeyHex,
    privateKey
  };
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
    
    // Trong thực tế, cần đăng ký user với Fabric CA
    // Hiện tại chỉ giả lập và trả về cặp khóa
    
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
