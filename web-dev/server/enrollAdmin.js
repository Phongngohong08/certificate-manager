// enrollAdmin.js - Script để enroll admin vào Fabric CA và lưu vào wallet
const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const ccpPath = process.env.CCP_PATH;
const walletPath = path.join(process.cwd(), 'wallet');

async function main() {
  try {
    if (!ccpPath || !fs.existsSync(ccpPath)) {
      throw new Error('CCP_PATH không tồn tại hoặc chưa cấu hình đúng trong .env');
    }
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
    const caInfo = ccp.certificateAuthorities[Object.keys(ccp.certificateAuthorities)[0]];
    const ca = new FabricCAServices(caInfo.url, { trustedRoots: caInfo.tlsCACerts.pem, verify: false }, caInfo.caName);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Kiểm tra đã có admin chưa
    const identity = await wallet.get('admin');
    if (identity) {
      console.log('Admin đã tồn tại trong wallet');
      return;
    }

    // Enroll admin
    const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });

    // Kiểm tra loại private key trả về phải là ECDSA
    const privateKeyPem = enrollment.key.toBytes();
    if (!privateKeyPem.includes('BEGIN EC PRIVATE KEY') && !privateKeyPem.includes('BEGIN PRIVATE KEY')) {
      throw new Error('Private key trả về không phải ECDSA. Hãy chắc chắn Fabric CA cấu hình sinh ECDSA key.');
    }

    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: 'Org1MSP',
      type: 'X.509',
    };
    await wallet.put('admin', x509Identity);
    console.log('Enroll admin thành công và đã lưu vào wallet!');
  } catch (error) {
    console.error(`Enroll admin thất bại: ${error}`);
    process.exit(1);
  }
}

main();
