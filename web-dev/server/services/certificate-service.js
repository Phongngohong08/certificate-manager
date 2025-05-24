const moment = require('moment');

/**
 * Merge certificate data from Database and Blockchain Ledger
 * @param {Array} dbRecordArray
 * @param {Array} ledgerRecordArray
 * @returns {Array}
 */
function mergeCertificateData(dbRecordArray, ledgerRecordArray) {
  let certMergedDataArray = [];
  for (let i = 0; i < dbRecordArray.length; i++) {
    let dbEntry = dbRecordArray[i];
    let chaincodeEntry = ledgerRecordArray.find((element) => {
      return element.certUUID === dbEntry._id.toString();
    });
    certMergedDataArray.push({
      studentName: dbEntry.studentName,
      studentEmail: dbEntry.studentEmail,
      universityName: dbEntry.universityName,
      universityEmail: dbEntry.universityEmail,
      cgpa: dbEntry.cgpa,
      departmentName: dbEntry.departmentName,
      dateOfIssuing: moment(dbEntry.dateOfIssuing).format('YYYY-MM-DD'),
      major: dbEntry.major,
      certUUID: dbEntry._id.toString(),
      hash: chaincodeEntry ? chaincodeEntry.certHash : null
    });
  }
  return certMergedDataArray;
}

module.exports = { mergeCertificateData };
