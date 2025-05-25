// proof-service.js - Handles certificate proofs and verification
const { generateMerkleRoot, createDigitalSignature, verifySignature } = require('./encryption');
const crypto = require('crypto');
const Certificate = require('../models/certificate');

/**
 * Generate a certificate proof
 * @param {Object|String} requestData - Object containing sharedAttributes, certUUID, and email
 * @returns {Object} Proof object containing hash and verification data
 */
async function generateCertificateProof(requestData) {
  try {
    const data = typeof requestData === 'string' ? JSON.parse(requestData) : requestData;
    const { sharedAttributes, certUUID, email } = data;
    
    if (!Array.isArray(sharedAttributes) || sharedAttributes.length === 0) {
      throw new Error('At least one attribute must be shared');
    }
    
    if (!certUUID || !email) {
      throw new Error('Certificate ID and email are required');
    }

    // Fetch the certificate data from database
    const certificate = await Certificate.findById(certUUID);
    if (!certificate) {
      throw new Error(`Certificate with ID ${certUUID} not found`);
    }
    
    // Extract only the requested attributes
    const selectedData = {};
    for (const attr of sharedAttributes) {
      if (certificate[attr] !== undefined) {
        selectedData[attr] = certificate[attr];
      }
    }
    
    // Create an array of values to hash for the Merkle tree
    const dataValues = Object.values(selectedData);
    
    // Generate a Merkle root from the selected attributes
    const merkleRoot = generateMerkleRoot(dataValues);
    
    // Create the proof object
    const proofData = {
      certificateId: certUUID,
      email: email,
      merkleRoot,
      selectedAttributes: sharedAttributes,
      timestamp: Date.now(),
      nonce: crypto.randomBytes(16).toString('hex')
    };
    
    // Create proof hash
    const proofHash = crypto.createHash('sha256')
      .update(JSON.stringify(proofData))
      .digest('hex');
      
    return JSON.stringify({
      proofHash,
      merkleRoot,
      nonce: proofData.nonce, 
      timestamp: proofData.timestamp,
      certificateId: certUUID,
      selectedAttributes: sharedAttributes,
      status: 'valid'
    });
  } catch (error) {
    console.error('Error generating certificate proof:', error);
    throw error;
  }
}

/**
 * Verify a certificate proof
 * @param {Object|String} proof - The proof to verify
 * @param {Object} disclosedData - The disclosed certificate data
 * @returns {Boolean} True if the proof is valid
 */
async function verifyCertificateProof(proof, disclosedData) {
  try {
    console.log('Verifying proof:', { 
      proofType: typeof proof, 
      disclosedData: disclosedData 
    });

    // Parse proof if needed
    let proofObj;
    try {
      proofObj = typeof proof === 'string' ? JSON.parse(proof) : proof;
    } catch (e) {
      console.error('Error parsing proof:', e);
      return false;
    }
    
    console.log('Parsed proof:', proofObj);
    
    if (!proofObj || !proofObj.merkleRoot || !proofObj.certificateId || !proofObj.selectedAttributes) {
      console.error('Invalid proof structure:', proofObj);
      return false;
    }
    
    if (!disclosedData || Object.keys(disclosedData).length === 0) {
      console.error('No disclosed data provided');
      return false;
    }
    
    // Verify that all required attributes are present in disclosedData
    for (const attr of proofObj.selectedAttributes) {
      if (!disclosedData.hasOwnProperty(attr)) {
        console.error(`Missing disclosed attribute: ${attr}`);
        return false;
      }
    }
    
    // Extract values from disclosed data in the same order as selectedAttributes
    const dataValues = [];
    for (const attr of proofObj.selectedAttributes) {
      dataValues.push(String(disclosedData[attr]));
    }
    
    console.log('Data values for verification:', dataValues);
    
    // Regenerate Merkle root from disclosed data
    const calculatedRoot = generateMerkleRoot(dataValues);
    
    // Compare with the provided Merkle root
    const isValid = calculatedRoot === proofObj.merkleRoot;
    
    console.log('Certificate verification:', {
      claimed: proofObj.merkleRoot,
      calculated: calculatedRoot,
      isValid
    });
    
    return isValid;
  } catch (error) {
    console.error('Error verifying certificate proof:', error);
    return false;
  }
}

module.exports = {
  generateCertificateProof,
  verifyCertificateProof
};
