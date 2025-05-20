let mongoose = require('mongoose');
const logger = require('../services/logger');
const config = require('../loaders/config');

//loader class for mongoDB.
//initializes mongodb and exports connection.

mongoose.Promise = global.Promise;

// MongoDB connection options for version 8.x
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4
};

mongoose.connect(config.mongodbURI, options)
    .then(() => {
        logger.info("Successfully connected to MongoDB.");
        logger.info(`MongoDB version: ${mongoose.version}`);
    })
    .catch((err) => {
        logger.error("MongoDB connection error:", err);
        process.exit(1);
    });

// Handle connection events
mongoose.connection.on('error', (err) => {
    logger.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
    logger.info('MongoDB reconnected');
});

// Handle process termination
process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        logger.info('MongoDB connection closed through app termination');
        process.exit(0);
    } catch (err) {
        logger.error('Error during MongoDB connection closure:', err);
        process.exit(1);
    }
});

module.exports = mongoose;
