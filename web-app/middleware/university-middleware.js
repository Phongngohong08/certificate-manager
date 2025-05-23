// Middleware xác thực cho University sử dụng JWT
// Nếu chưa xác thực hoặc không phải university, trả về lỗi
function authenticateLogin(req, res, next) {
    // Chỉ cho phép university đã xác thực JWT
    if (req.user && (req.user.role === "university" || req.user.user_type === "university")) {
        return next();
    }
    return res.status(401).json({ error: "Bạn chưa đăng nhập hoặc không có quyền truy cập!" });
}

// Nếu đã đăng nhập (JWT) thì chuyển hướng về dashboard, ngược lại cho phép tiếp tục
function redirectToDashboardIfLoggedIn(req, res, next) {
    if (req.user && (req.user.role === "university" || req.user.user_type === "university")) return res.redirect('/university/dashboard');
    return next();
}

// Không cần export auth nữa, chỉ export các middleware đã clean
module.exports = { authenticateLogin, redirectToDashboardIfLoggedIn };



