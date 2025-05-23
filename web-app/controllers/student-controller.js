let students = require('../database/models/students');
let fabricEnrollment  = require('../services/fabric/enrollment');
let chaincode = require('../services/fabric/chaincode');
let logger = require("../services/logger");
let studentService = require('../services/student-service');
const jwt = require('jsonwebtoken');

let title = "Student Dashboard";
let root = "student";
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';


async function postRegisterStudent(req, res, next) {
    try {
        logger.info(`Starting student registration process for email: ${req.body.email}`);
        logger.debug('Generating fabric enrollment keys...');
        let keys = await fabricEnrollment.registerUser(req.body.email);
        logger.debug('Fabric enrollment keys generated successfully');
        logger.debug('Creating student record in database...');
        let dbResponse = await students.create({
            name : req.body.name,
            email: req.body.email,
            password: req.body.password,
            publicKey: keys.publicKey
        });
        logger.info('Student registration completed successfully');
        res.render("register-success", { title, root,
            logInType: "none"});
    }
    catch (e) {
        logger.error(`Error during student registration: ${e.message}`);
        logger.error(`Stack trace: ${e.stack}`);
        next(e);
    }
}

async function logOutAndRedirect (req, res, next) {
    // Với JWT, chỉ cần client xóa token, server không cần xử lý
    res.redirect('/');
};


async function postLoginStudent (req,res,next) {
    try {
        let studentObject = await students.validateByCredentials(req.body.email, req.body.password)
        // Tạo JWT
        const token = jwt.sign({
            id: studentObject._id,
            role: "student",
            email: studentObject.email,
            name: studentObject.name,
            publicKey: studentObject.publicKey
        }, JWT_SECRET, { expiresIn: '2h' });
        // Trả về token cho client
        return res.json({
            token,
            user: {
                id: studentObject._id,
                email: studentObject.email,
                name: studentObject.name,
                role: "student"
            },
            message: "Login successful"
        });
    } catch (e) {
        logger.error(e);
        next(e);
    }
}

async function getDashboard(req, res, next) {
    try {
        let certData = await studentService.getCertificateDataforDashboard(req.user.publicKey, req.user.email);
        res.render("dashboard-student", { title, root, certData,
            logInType: req.user ? req.user.role : "none"});
    } catch (e) {
        logger.error(e);
        next(e);
    }
}

module.exports = {postRegisterStudent, postLoginStudent, logOutAndRedirect, getDashboard};
