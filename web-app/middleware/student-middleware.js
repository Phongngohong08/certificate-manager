function authenticateLogin(req, res, next) {
    // Chỉ cho phép student đã xác thực JWT
    if (req.user && (req.user.role === "student" || req.user.user_type === "student")) return next();
    return res.status(401).json({ error: "Unauthorized access: Login first" });
}

function redirectToDashboardIfLoggedIn(req, res, next) {
    // Nếu đã đăng nhập (JWT), chuyển hướng dashboard
    if (req.user && (req.user.role === "student" || req.user.user_type === "student")) return res.redirect('/student/dashboard');
    return next();
}

// Không cần export auth nữa, chỉ export các middleware đã clean
module.exports = { redirectToDashboardIfLoggedIn, authenticateLogin };