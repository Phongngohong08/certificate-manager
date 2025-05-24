const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student-controller');
const studentMiddleware = require('../middleware/student-middleware');
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const { validateRequest } = require('../middleware/validation-middleware');
const cacheMiddleware = require('../middleware/cache-middleware');
let title = "Student Dashboard";
let root = "student";

router.get('/dashboard', auth, studentMiddleware.authenticateLogin, studentController.getDashboard);

router.get('/register', function(req, res, next) {
    res.render('register-student', {   title, root,
        logInType: req.user ? req.user.role : "none"
    });
});

router.get('/login', auth, studentMiddleware.redirectToDashboardIfLoggedIn, function (req,res,next) {
    res.render('login-student',  {   title, root,
        logInType: req.user ? req.user.role : "none"
    })
});

router.get('/logout', studentController.logOutAndRedirect);

router.post('/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('studentId').trim().notEmpty().withMessage('Student ID is required'),
    validateRequest
  ],
  studentController.register
);

router.post('/login/submit', studentController.postLoginStudent);

/**
 * @swagger
 * /student/certificates:
 *   get:
 *     summary: Get student certificates
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of certificates
 */
router.get('/certificates',
  cacheMiddleware(300), // Cache for 5 minutes
  studentController.getCertificates
);

module.exports = router;
