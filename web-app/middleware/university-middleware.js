const auth = require('./auth');



// Middleware xác thực cho University sử dụng JWT
// Nếu chưa xác thực hoặc không phải university, trả về lỗi
function authenticateLogin(req, res, next) {
    // Kiểm tra xem user đã xác thực JWT và có đúng loại university không
    if (req.user && req.user.user_type === "university") {
        console.log("[Middleware] University đã xác thực JWT, cho phép truy cập.");
        return next();
    }
    console.log("[Middleware] Truy cập bị từ chối: Chưa đăng nhập hoặc không phải university.");
    return res.status(401).json({ error: "Bạn chưa đăng nhập hoặc không có quyền truy cập!" });
}

// Nếu đã đăng nhập (JWT) thì chuyển hướng về dashboard, ngược lại cho phép tiếp tục
function redirectToDashboardIfLoggedIn(req, res, next) {
    if (req.user && req.user.user_type === "university") {
        console.log("[Middleware] University đã đăng nhập, chuyển hướng về dashboard.");
        return res.redirect('/university/dashboard');
    }
    // Nếu chưa đăng nhập thì cho phép tiếp tục
    next();
}

module.exports = { authenticateLogin, redirectToDashboardIfLoggedIn, auth };



