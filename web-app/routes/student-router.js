const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student-controller');
const studentMiddleware = require('../middleware/student-middleware');
const auth = require('../middleware/auth');
let title = "Student Dashboard";
let root = "student";

router.get('/dashboard', auth, studentMiddleware.authenticateLogin, studentController.getDashboard);

router.get('/register', function(req, res, next) {
    res.render('register-student', {   title, root,
        logInType: req.user ? req.user.user_type : "none"
    });
});

router.get('/login', auth, studentMiddleware.redirectToDashboardIfLoggedIn, function (req,res,next) {
    res.render('login-student',  {   title, root,
        logInType: req.user ? req.user.user_type : "none"
    })
});

router.get('/logout', studentController.logOutAndRedirect);

router.post('/register/submit', studentController.postRegisterStudent);

router.post('/login/submit', studentController.postLoginStudent);


module.exports = router;
