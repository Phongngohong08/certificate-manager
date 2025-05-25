// registerUser.js - Script to register users with the Fabric CA and store in wallet
const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const ccpPath = process.env.CCP_PATH;
const walletPath = path.join(process.cwd(), 'wallet');

/**
 * Register and enroll a user with the Fabric CA
 * @param {string} userId - The user ID to register (using email address)
 * @param {string} role - The role of the user (e.g., 'university', 'student')
 */
async function registerAndEnrollUser(userId, role) {
  try {
    if (!ccpPath || !fs.existsSync(ccpPath)) {
      throw new Error('CCP_PATH not found or not properly configured in .env');
    }

    // Load the network configuration
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    // Create a new CA client for interacting with the CA
    const caInfo = ccp.certificateAuthorities[Object.keys(ccp.certificateAuthorities)[0]];
    const ca = new FabricCAServices(caInfo.url, { 
      trustedRoots: caInfo.tlsCACerts.pem, 
      verify: false 
    }, caInfo.caName);

    // Create a new file system wallet for managing identities
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Check if the user already exists in the wallet
    const userIdentity = await wallet.get(userId);
    if (userIdentity) {
      console.log(`User ${userId} already exists in the wallet`);
      return {
        success: true,
        message: `User ${userId} already exists in the wallet`
      };
    }

    // Check to see if admin is enrolled
    const adminIdentity = await wallet.get('admin');
    if (!adminIdentity) {
      console.log('Admin identity does not exist in the wallet');
      console.log('Please enroll admin first by running enrollAdmin.js');
      throw new Error('Admin must be enrolled before registering users');
    }

    // Build a user object for authenticating with the CA
    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, 'admin');

    // Register the user and return the enrollment secret
    // Luôn dùng affiliation org1 cho mọi role
    let affiliation = 'org1';

    const secret = await ca.register({
      enrollmentID: userId,
      enrollmentSecret: `${userId}pw`, // Simple password based on userId
      role: 'client', // luôn là client để invoke chaincode
      affiliation: 'org1', // Use specific affiliation for proper permissions
      attrs: [
        {
          name: 'role',
          value: role,
          ecert: true
        }
      ]
    }, adminUser);

    // Enroll the user with the CA to get their certificate
    // Request specific attributes to ensure proper OU fields
    const enrollment = await ca.enroll({
      enrollmentID: userId,
      enrollmentSecret: secret,
      attr_reqs: [
        { name: 'hf.Type', optional: false },
        { name: 'role', optional: false }
      ]
    });

    // Create the user identity in the wallet
    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: 'Org1MSP',
      type: 'X.509',
    };

    await wallet.put(userId, x509Identity);
    console.log(`Successfully registered and enrolled user ${userId} and imported into the wallet`);

    return {
      success: true,
      message: `User ${userId} registered and enrolled successfully`
    };

  } catch (error) {
    console.error(`Failed to register user ${userId}: ${error}`);
    return {
      success: false,
      message: `Failed to register user: ${error.message}`
    };
  }
}

// If running from command line
if (require.main === module) {
  if (process.argv.length < 4) {
    console.log('Usage: node registerUser.js <userId> <role>');
    process.exit(1);
  }
  
  const userId = process.argv[2];
  const role = process.argv[3]; 
  
  console.log(`Starting registration for user: ${userId} with role: ${role}`);
  console.log(`CCP Path: ${process.env.CCP_PATH}`);
  console.log(`Wallet Path: ${walletPath}`);
  
  registerAndEnrollUser(userId, role)
    .then(result => {
      console.log(JSON.stringify(result, null, 2));
      if (!result.success) process.exit(1);
    })
    .catch(err => {
      console.error('Error in registerUser.js:', err);
      process.exit(1);
    });
} else {
  module.exports = registerAndEnrollUser;
}
