let universities = require('../database/models/universities');
let fabricEnrollment  = require('../services/fabric/enrollment');
let chaincode = require('../services/fabric/chaincode');
let logger = require("../services/logger");
let universityService = require("../services/university-service");


let title = "University";
let root = "university";


async function postRegisterUniversity(req, res, next) {
    try {
        logger.info(`Starting university registration process for email: ${req.body.email}`);
        
        logger.debug('Generating fabric enrollment keys...');
        let keys = await fabricEnrollment.registerUser(req.body.email);
        logger.debug('Fabric enrollment keys generated successfully');
        
        let location = req.body.location + `, ${req.body.country}`;
        logger.debug(`Creating university record in database with location: ${location}`);

        let dbResponse = await universities.create({
            name : req.body.name,
            email: req.body.email,
            description: req.body.description,
            location: location,
            password: req.body.password,
            publicKey: keys.publicKey
        });
        logger.debug('University record created in database successfully');

        logger.debug('Registering university on blockchain...');
        let result = await chaincode.invokeChaincode("registerUniversity",
            [ req.body.name, keys.publicKey, location, req.body.description], false, req.body.email);
        logger.info(`University registration completed successfully. Ledger profile: ${result}`);

        res.render("register-success", { title, root,
            logInType: req.session.user_type || "none"});
    }
    catch (e) {
        logger.error(`Error during university registration: ${e.message}`);
        logger.error(`Stack trace: ${e.stack}`);
        next(e);
    }
}

async function postLoginUniversity (req,res,next) {
    try {
        let universityObject = await universities.validateByCredentials(req.body.email, req.body.password)
        req.session.user_id = universityObject._id;
        req.session.user_type = "university";
        req.session.email = universityObject.email;
        req.session.name = universityObject.name;

        return res.redirect("/university/issue")
    } catch (e) {
        logger.error(e);
        next(e);
    }
}

async function logOutAndRedirect (req, res, next) {
    req.session.destroy(function () {
        res.redirect('/');
    });
}

async function postIssueCertificate(req,res,next) {
    try {
        let certData = {
            studentEmail: req.body.studentEmail,
            studentName: req.body.studentName,
            universityName: req.session.name,
            universityEmail: req.session.email,
            major: req.body.major,
            departmentName:  req.body.department,
            cgpa: req.body.cgpa,
            dateOfIssuing: req.body.date,
        };

        let serviceResponse = await universityService.issueCertificate(certData);

        if(serviceResponse) {
            res.render("issue-success", { title, root,
                logInType: req.session.user_type || "none"});
        }

    } catch (e) {
        logger.error(e);
        next(e);
    }
}

async function getDashboard(req, res, next) {
    try {
        let certData = await universityService.getCertificateDataforDashboard(req.session.name, req.session.email);
        res.render("dashboard-university", { title, root, certData,
            logInType: req.session.user_type || "none"});

    } catch (e) {
        logger.error(e);
        next(e);
    }
}
module.exports = {postRegisterUniversity, postLoginUniversity, logOutAndRedirect, postIssueCertificate, getDashboard};