const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - Yêu cầu đăng nhập
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: 'Vui lòng đăng nhập để tiếp tục' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_change_this');

    // Get user from token
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: 'User không tồn tại' 
      });
    }

    if (!user.isActive) {
      return res.status(401).json({ 
        success: false, 
        error: 'Tài khoản đã bị khóa' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      error: 'Token không hợp lệ hoặc đã hết hạn' 
    });
  }
};

// Authorize roles - Chỉ admin mới truy cập
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        error: 'Bạn không có quyền truy cập' 
      });
    }
    next();
  };
};