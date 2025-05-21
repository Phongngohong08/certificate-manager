require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/academic-certificates',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  nodeEnv: process.env.NODE_ENV || 'development',
  fabric: {
    channelName: process.env.CHANNEL_NAME || 'mychannel',
    chaincodeName: process.env.CHAINCODE_NAME || 'academic-certificates',
    mspId: process.env.MSP_ID || 'Org1MSP',
    connectionProfile: process.env.CONNECTION_PROFILE || './connection-profile.json'
  }
}; 