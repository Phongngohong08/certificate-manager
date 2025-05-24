const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

const ccpPath = process.env.CCP_PATH;
const channelName = process.env.FABRIC_CHANNEL_NAME;
const chaincodeName = process.env.FABRIC_CHAINCODE_NAME;

async function getContract(userId) {
  // Load connection profile
  const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
  // Load wallet
  const walletPath = path.join(process.cwd(), 'wallet');
  const wallet = await Wallets.newFileSystemWallet(walletPath);
  // Check identity
  const identity = await wallet.get(userId);
  if (!identity) throw new Error(`Identity for user ${userId} not found in wallet`);
  // Connect gateway
  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: userId,
    discovery: { enabled: true, asLocalhost: true },
  });
  // Get contract
  const network = await gateway.getNetwork(channelName);
  const contract = network.getContract(chaincodeName);
  return { contract, gateway };
}

async function invokeChaincode(userId, fn, args = []) {
  const { contract, gateway } = await getContract(userId);
  try {
    const result = await contract.submitTransaction(fn, ...args);
    return result.toString();
  } finally {
    gateway.disconnect();
  }
}

async function queryChaincode(userId, fn, args = []) {
  const { contract, gateway } = await getContract(userId);
  try {
    const result = await contract.evaluateTransaction(fn, ...args);
    return result.toString();
  } finally {
    gateway.disconnect();
  }
}

module.exports = { invokeChaincode, queryChaincode };
