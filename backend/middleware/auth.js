// Mock auth middleware - Không cần MongoDB
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Mock: Luôn cho phép nếu có token, nếu không vẫn cho qua
    if (!token) {
      console.log('⚠️ No token provided, using mock user');
      // Vẫn cho phép truy cập với mock user
      req.user = {
        id: '1',
        name: 'Demo User',
        email: 'demo@example.com',
        role: 'user',
        isActive: true
      };
      return next();
    }

    // Mock token verification - luôn thành công
    console.log('✅ Mock token verified');
    
    // Mock user data
    req.user = {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com', 
      role: 'admin',
      isActive: true
    };
    
    next();
  } catch (error) {
    console.log('⚠️ Mock auth error, but allowing access');
    // Vẫn cho phép truy cập ngay cả khi có lỗi
    req.user = {
      id: '1',
      name: 'Demo User',
      email: 'demo@example.com',
      role: 'user',
      isActive: true
    };
    next();
  }
};

// Mock authorize - Luôn cho phép truy cập
exports.authorize = (...roles) => {
  return (req, res, next) => {
    console.log(`🎯 Mock authorize for roles: ${roles}`);
    // Luôn cho phép truy cập, không check role
    next();
  };
};
