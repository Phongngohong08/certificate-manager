const universities = require('../database/models/universities');
const certificates = require('../database/models/certificates');
const students = require('../database/models/students');
const chaincode = require('./fabric/chaincode');
const logger = require("./logger");
const encryption = require('./encryption');
const certificateService = require('./certificate-service');

/**
 * Create certificate object in database and ledger.
 * For ledger - data needs to be cryptographically signed by student and university private key.
 * @param {certificates.schema} certData
 * @returns {Promise<{}>}
 */
async function issueCertificate(certData) {
    try {
        logger.info(`Starting certificate issuance process for student: ${certData.studentEmail}`);
        
        // Validate university
        let universityObj = await universities.findOne({"email": certData.universityEmail});
        if (!universityObj) {
            logger.error(`University not found with email: ${certData.universityEmail}`);
            throw new Error("Could not fetch university profile. Please ensure the university is registered.");
        }
        logger.debug(`Found university: ${universityObj.name}`);

        // Validate student
        let studentObj = await students.findOne({"email": certData.studentEmail});
        if (!studentObj) {
            logger.error(`Student not found with email: ${certData.studentEmail}`);
            throw new Error("Could not fetch student profile. Please ensure the student is registered.");
        }
        logger.debug(`Found student: ${studentObj.name}`);

        // Create certificate model
        let certDBModel = new certificates(certData);
        logger.debug('Created certificate database model');

        // Generate Merkle tree hash
        logger.debug('Generating Merkle tree hash...');
        let mTreeHash = await encryption.generateMerkleRoot(certDBModel);
        logger.debug('Merkle tree hash generated successfully');

        // Generate signatures
        logger.debug('Generating university signature...');
        let universitySignature = await encryption.createDigitalSignature(mTreeHash, certData.universityEmail);
        logger.debug('University signature generated successfully');

        logger.debug('Generating student signature...');
        let studentSignature = await encryption.createDigitalSignature(mTreeHash, certData.studentEmail);
        logger.debug('Student signature generated successfully');

        // Issue certificate on blockchain
        logger.debug('Issuing certificate on blockchain...');
        let chaincodeResult = await chaincode.invokeChaincode("issueCertificate",
            [mTreeHash, universitySignature, studentSignature, certData.dateOfIssuing, certDBModel._id, universityObj.publicKey, studentObj.publicKey], 
            false, 
            certData.universityEmail);
        logger.debug(`Certificate issued on blockchain: ${JSON.stringify(chaincodeResult)}`);

        // Save to database
        logger.debug('Saving certificate to database...');
        let res = await certDBModel.save();
        if (!res) {
            logger.error('Failed to save certificate to database');
            throw new Error("Could not create certificate in the database");
        }
        logger.debug('Certificate saved to database successfully');

        logger.info(`Certificate issuance completed successfully for student: ${certData.studentEmail}`);
        return true;
    } catch (error) {
        logger.error(`Error in issueCertificate: ${error.message}`);
        logger.error(`Stack trace: ${error.stack}`);
        throw error;
    }
}

/**
 * Fetch and return all certificates issued by a specific university
 * @param {String} universityName
 * @param {String} universtiyEmail
 * @returns {Promise<certificates[]>}
 */
async function getCertificateDataforDashboard(universityName, universtiyEmail) {
    let universityProfile = await chaincode.invokeChaincode("queryUniversityProfileByName",
        [universityName], true, universtiyEmail);

    let certLedgerDataArray = await chaincode.invokeChaincode("getAllCertificateByUniversity",
        [universityProfile.publicKey], true, universtiyEmail);

    let certUUIDArray = certLedgerDataArray.map( element => {
        return element.certUUID
    });

    let certDBRecords = await certificates.find().where('_id').in(certUUIDArray).exec();

    return certificateService.mergeCertificateData(certDBRecords, certLedgerDataArray);
}


module.exports = {issueCertificate,  getCertificateDataforDashboard};