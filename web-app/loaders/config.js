//add configuration files
//initialize environment variables
//try to use the export from this file instead of touching process.env directly.

const logger = require('../utils/logger');

const env = process.env.NODE_ENV || 'development';
logger.info(`Current environment: ${env}`);

if (env === 'development') {
    process.env.MONGODB_URI = process.env.MONGODB_URI_LOCAL;  //in case of dev, connect to local URI.
    process.env.NODE_ENV = 'development';
    logger.info('Development environment detected, using local MongoDB URI');
}

// Log all Fabric-related environment variables
logger.info('Fabric Configuration:');
logger.info(`CCP_PATH: ${process.env.CCP_PATH}`);
logger.info(`FABRIC_CHANNEL_NAME: ${process.env.FABRIC_CHANNEL_NAME}`);
logger.info(`FABRIC_CHAINCODE_NAME: ${process.env.FABRIC_CHAINCODE_NAME}`);

// Validate required environment variables
const requiredEnvVars = [
    'CCP_PATH',
    'FABRIC_CHANNEL_NAME',
    'FABRIC_CHAINCODE_NAME'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
    logger.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

module.exports = {
    mongodbURI: process.env.MONGODB_URI,
    port: process.env.PORT,
    logLevel: process.env.LOG_LEVEL || "info",
    expressSessionSecret: process.env.EXPRESS_SESSION_SECRET,

    fabric: {
        ccpPath: process.env.CCP_PATH,
        walletPath: require('path').resolve(__dirname, "..", "wallet"),
        channelName: process.env.FABRIC_CHANNEL_NAME,
        chaincodeName: process.env.FABRIC_CHAINCODE_NAME
    }
};




