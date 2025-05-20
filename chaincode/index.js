'use strict';

const EducertContract = require('./lib/educert_contract');

console.log(EducertContract)
//NOTE: Estore was changed to Educert.
//Todo: During chaincode invocation, each chaincode is given a name. Find out where that name originates from. 
module.exports = EducertContract;
