const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');
const config = require("../loaders/config");
const logger = require("../utils/logger");

async function joinChannel() {
    try {
        logger.info('Starting channel join process...');
        
        // Load connection profile
        const ccpPath = config.fabric.ccpPath;
        if (!fs.existsSync(ccpPath)) {
            throw new Error(`Connection profile not found at path: ${ccpPath}`);
        }
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        logger.info('Successfully loaded connection profile');

        // Initialize wallet
        const walletPath = config.fabric.walletPath;
        if (!fs.existsSync(walletPath)) {
            throw new Error(`Wallet directory not found at path: ${walletPath}`);
        }
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        logger.info('Successfully initialized wallet');

        // Get admin identity
        const adminIdentity = await wallet.get('admin');
        if (!adminIdentity) {
            throw new Error('Admin identity not found in wallet');
        }
        logger.info('Found admin identity');

        // Connect to gateway
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: 'admin',
            discovery: { enabled: true, asLocalhost: true }
        });
        logger.info('Successfully connected to gateway');

        // Get network
        const network = await gateway.getNetwork(config.fabric.channelName);
        logger.info(`Successfully got network for channel: ${config.fabric.channelName}`);

        // Get channel info
        const channel = network.getChannel();
        const channelInfo = await channel.queryInfo();
        logger.info('Channel information:');
        logger.info(`Channel name: ${channelInfo.channelId}`);
        logger.info(`Block height: ${channelInfo.height}`);
        logger.info(`Current block hash: ${channelInfo.currentBlockHash.toString('hex')}`);
        logger.info(`Previous block hash: ${channelInfo.previousBlockHash.toString('hex')}`);

        // Get channel config
        const configBlock = await channel.queryConfig();
        logger.info('Channel configuration:');
        logger.info(`Channel ID: ${configBlock.channelId}`);
        logger.info(`Channel version: ${configBlock.version}`);
        logger.info(`Channel orderer: ${configBlock.ordererAddress}`);

        // Get channel members
        const channelMembers = await channel.queryPeers();
        logger.info('Channel members:');
        channelMembers.forEach(peer => {
            logger.info(`Peer: ${peer.name}`);
        });

        await gateway.disconnect();
        logger.info('Successfully disconnected from gateway');

    } catch (error) {
        logger.error(`Error in join channel process: ${error}`);
        logger.error(`Stack trace: ${error.stack}`);
        throw error;
    }
}

// Run the script
joinChannel().then(() => {
    logger.info('Channel join process completed');
    process.exit(0);
}).catch(error => {
    logger.error(`Channel join process failed: ${error}`);
    process.exit(1);
}); 