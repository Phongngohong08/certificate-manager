//Import Hyperledger Fabric 2.2.19 programming model - fabric-network
'use strict';

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');
const config = require("../../loaders/config");
const logger = require("../logger");

const util = require('util');

/**
 * Do all initialization needed to invoke chaincode
 * @param userEmail
 * @returns {Promise<{contract: Contract, gateway: Gateway, network: Network} | Error>} Network objects needed to interact with chaincode
 */
async function connectToNetwork(userEmail) {
    try {
        logger.info(`Attempting to connect to network for user: ${userEmail}`);
        logger.info(`CCP Path: ${config.fabric.ccpPath}`);
        logger.info(`Wallet Path: ${config.fabric.walletPath}`);
        logger.info(`Channel Name: ${config.fabric.channelName}`);
        logger.info(`Chaincode Name: ${config.fabric.chaincodeName}`);

        // Check if CCP file exists
        if (!fs.existsSync(config.fabric.ccpPath)) {
            logger.error(`Connection profile not found at path: ${config.fabric.ccpPath}`);
            throw new Error(`Connection profile not found at path: ${config.fabric.ccpPath}`);
        }

        let ccp = JSON.parse(fs.readFileSync(config.fabric.ccpPath, 'utf8'));
        logger.debug('Successfully loaded connection profile');

        // Check if wallet directory exists
        if (!fs.existsSync(config.fabric.walletPath)) {
            logger.error(`Wallet directory not found at path: ${config.fabric.walletPath}`);
            throw new Error(`Wallet directory not found at path: ${config.fabric.walletPath}`);
        }

        let wallet = await Wallets.newFileSystemWallet(config.fabric.walletPath);
        logger.debug('Successfully initialized wallet');

        const identity = await wallet.get(userEmail);
        if (!identity) {
            logger.error(`An identity for the user with ${userEmail} does not exist in the wallet`);
            logger.info('Run the registerUser.js application before retrying');
            throw new Error(`An identity for the user with ${userEmail} does not exist in the wallet`);
        }
        logger.info(`Found identity for user: ${userEmail}`);

        const gateway = new Gateway();
        logger.info('Connecting to gateway...');
        await gateway.connect(ccp, { 
            wallet, 
            identity: userEmail, 
            discovery: { 
                enabled: true, 
                asLocalhost: true 
            }
        });
        logger.info('Successfully connected to gateway');

        logger.info(`Getting network for channel: ${config.fabric.channelName}`);
        const network = await gateway.getNetwork(config.fabric.channelName);
        logger.info('Successfully got network');

        logger.info(`Getting contract for chaincode: ${config.fabric.chaincodeName}`);
        const contract = network.getContract(config.fabric.chaincodeName);
        logger.info('Successfully got contract');

        return {
            gateway, network, contract
        }
    } catch (error) {
        logger.error(`Failed to connect to network: ${error}`);
        logger.error(`Stack trace: ${error.stack}`);
        throw error;
    }
}

/**
 * Invoke any chaincode using fabric sdk
 *
 * @param {String} func - The chaincode function to call
 * @param {[String]} args - Arguments to chaincode function
 * @param {Boolean} isQuery - True if query function, False if transaction function
 * @param {String} userEmail - Email of fabric user that invokes chaincode. Must be enrolled and have entity in wallet.
 * @returns {Promise<JSON>} Data returned from ledger in Object format
 */
async function invokeChaincode(func, args, isQuery, userEmail) {
    try {
        logger.info(`Invoking chaincode function: ${func}`);
        logger.info(`Arguments: ${JSON.stringify(args)}`);
        logger.info(`Is Query: ${isQuery}`);
        logger.info(`User Email: ${userEmail}`);

        let networkObj = await connectToNetwork(userEmail);
        logger.debug('Successfully connected to network');

        if (isQuery === true) {
            logger.info('Executing query transaction');
            if (args) {
                logger.debug(`Query with args: ${JSON.stringify(args)}`);
                let response = await networkObj.contract.evaluateTransaction(func, ...args);
                logger.debug(`Query response: ${response}`);
                logger.info(`Transaction ${func} with args ${args} has been evaluated`);

                await networkObj.gateway.disconnect();
                return JSON.parse(response);
            } else {
                logger.debug('Query without args');
                let response = await networkObj.contract.evaluateTransaction(func);
                logger.debug(`Query response: ${response}`);
                logger.info(`Transaction ${func} without args has been evaluated`);

                await networkObj.gateway.disconnect();
                return JSON.parse(response);
            }
        } else {
            logger.info('Executing submit transaction');
            if (args) {
                logger.debug(`Submit with args: ${JSON.stringify(args)}`);
                let response = await networkObj.contract.submitTransaction(func, ...args);
                logger.debug(`Submit response: ${response}`);
                logger.info(`Transaction ${func} with args ${args} has been submitted`);

                await networkObj.gateway.disconnect();
                return JSON.parse(response);
            } else {
                logger.debug('Submit without args');
                let response = await networkObj.contract.submitTransaction(func);
                logger.debug(`Submit response: ${response}`);
                logger.info(`Transaction ${func} without args has been submitted`);

                await networkObj.gateway.disconnect();
                return JSON.parse(response);
            }
        }
    } catch (error) {
        logger.error(`Failed to submit transaction: ${error}`);
        logger.error(`Stack trace: ${error.stack}`);
        throw error;
    }
}

module.exports = { invokeChaincode };
