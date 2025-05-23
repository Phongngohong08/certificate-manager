const express = require('express');
const router = express.Router();
const universityController = require('../controllers/university-controller');
const universityMiddleware = require('../middleware/university-middleware');
const auth = require('../middleware/auth');

let title = "University";
let root = "university";


router.get('/register', function(req, res, next) {
    res.render('register-university', {   title, root,
        logInType: req.user ? req.user.role : "none"
    });
});

router.get('/login', auth, universityMiddleware.redirectToDashboardIfLoggedIn, function (req,res,next) {
    res.render('login-university',  {   title, root,
        logInType: req.user ? req.user.role : "none"
    })
});

router.get('/dashboard', auth, universityMiddleware.authenticateLogin, universityController.getDashboard);

router.get('/issue', auth, universityMiddleware.authenticateLogin, function (req,res,next) {
    res.render('issue-university',  {   title, root,
        logInType: req.user ? req.user.role : "none"
    })
});

router.post("/issue", auth, universityMiddleware.authenticateLogin, universityController.postIssueCertificate);


router.post('/register/submit', universityController.postRegisterUniversity);

router.post('/login/submit', universityController.postLoginUniversity);

router.get('/logout', universityController.logOutAndRedirect);

module.exports = router;
