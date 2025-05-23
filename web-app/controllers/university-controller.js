let universities = require('../database/models/universities');
let fabricEnrollment  = require('../services/fabric/enrollment');
let chaincode = require('../services/fabric/chaincode');
let logger = require("../services/logger");
let universityService = require("../services/university-service");
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';


let title = "University";
let root = "university";


async function postRegisterUniversity(req, res, next) {
    try {
        logger.info(`Starting university registration process for email: ${req.body.email}`);
        
        // Check if university already exists in database
        const existingUniversity = await universities.findOne({ email: req.body.email });
        if (existingUniversity) {
            logger.error(`University with email ${req.body.email} already exists in database`);
            return res.status(400).render("register-university", { 
                title, 
                root,
                error: "A university with this email already exists",
                logInType: "none"
            });
        }
        
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
            logInType: "none"}); // Đăng ký xong, chưa đăng nhập nên logInType là none
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
        // Tạo JWT thay vì lưu session
        const token = jwt.sign({
            user_id: universityObject._id,
            user_type: "university",
            email: universityObject.email,
            name: universityObject.name
        }, JWT_SECRET, { expiresIn: '2h' });

        // Trả về token cho client (có thể set cookie httpOnly hoặc trả về JSON)
        // Ở đây trả về JSON
        return res.json({
            token,
            message: "Login successful"
        });
    } catch (e) {
        logger.error(e);
        next(e);
    }
}

// Middleware xác thực JWT
function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ error: 'Invalid or expired token' });
            }
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json({ error: 'Authorization header missing' });
    }
}

async function logOutAndRedirect (req, res, next) {
    // Với JWT, chỉ cần client xóa token, server không cần xử lý
    res.redirect('/');
}

async function postIssueCertificate(req,res,next) {
    try {
        logger.info(`[University] Bắt đầu cấp chứng chỉ cho sinh viên: ${req.body.studentEmail}`);
        
        // Validate required fields
        const requiredFields = ['studentEmail', 'studentName', 'major', 'department', 'cgpa', 'date'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            logger.error(`[University] Thiếu trường bắt buộc: ${missingFields.join(', ')}`);
            return res.status(400).render("issue-university", { 
                title, 
                root,
                error: `Thiếu trường bắt buộc: ${missingFields.join(', ')}`,
                logInType: req.user ? req.user.user_type : "none"
            });
        }

        // Validate session (JWT)
        if (!req.user || !req.user.name || !req.user.email) {
            logger.error('[University] Thiếu thông tin xác thực JWT');
            return res.status(401).render("issue-university", { 
                title, 
                root,
                error: "Vui lòng đăng nhập với tư cách trường đại học để cấp chứng chỉ",
                logInType: req.user ? req.user.user_type : "none"
            });
        }
        let certData = {
            studentEmail: req.body.studentEmail,
            studentName: req.body.studentName,
            universityName: req.user.name,
            universityEmail: req.user.email,
            major: req.body.major,
            departmentName: req.body.department,
            cgpa: req.body.cgpa,
            dateOfIssuing: req.body.date,
        };

        logger.debug('Certificate data prepared:', certData);

        let serviceResponse = await universityService.issueCertificate(certData);

        if(serviceResponse) {
            logger.info(`[University] Cấp chứng chỉ thành công cho sinh viên: ${req.body.studentEmail}`);
            res.render("issue-success", { 
                title, 
                root,
                logInType: req.user ? req.user.user_type : "none"
            });
        }
    } catch (e) {
        logger.error(`[University] Lỗi khi cấp chứng chỉ: ${e.message}`);
        logger.error(`[University] Stack trace: ${e.stack}`);
        
        // Handle specific error cases
        if (e.message.includes("Schema v1 does not exist")) {
            return res.status(500).render("issue-university", { 
                title, 
                root,
                error: "Chưa khởi tạo schema chứng chỉ. Vui lòng liên hệ quản trị viên.",
                logInType: req.user ? req.user.user_type : "none"
            });
        }
        if (e.message.includes("Could not fetch student profile")) {
            return res.status(400).render("issue-university", { 
                title, 
                root,
                error: "Sinh viên chưa đăng ký trong hệ thống. Vui lòng kiểm tra lại email.",
                logInType: req.user ? req.user.user_type : "none"
            });
        }

        // Generic error handling
        next(e);
    }
}

async function getDashboard(req, res, next) {
    try {
        let certData = await universityService.getCertificateDataforDashboard(req.user.name, req.user.email);
        res.render("dashboard-university", { title, root, certData,
            logInType: req.user ? req.user.user_type : "none"});

    } catch (e) {
        logger.error(e);
        next(e);
    }
}
module.exports = {postRegisterUniversity, postLoginUniversity, logOutAndRedirect, postIssueCertificate, getDashboard, authenticateJWT};