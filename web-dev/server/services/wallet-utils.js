const path = require('path');
const { Wallets } = require('fabric-network');

const walletDir = path.join(process.cwd(), 'wallet');

async function getPrivateKeyFromWallet(email) {
  const wallet = await Wallets.newFileSystemWallet(walletDir);
  const identity = await wallet.get(email);
  if (!identity || !identity.credentials || !identity.credentials.privateKey) {
    throw new Error(`No privateKey found in wallet for ${email}`);
  }
  return identity.credentials.privateKey;
}

module.exports = { getPrivateKeyFromWallet };
