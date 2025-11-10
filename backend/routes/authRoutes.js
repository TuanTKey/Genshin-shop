const express = require('express');
const router = express.Router();

// Mock users database
const mockUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: '2', 
    name: 'Demo Customer',
    email: 'user@example.com',
    password: 'user123',
    role: 'user',
    status: 'active',
    createdAt: new Date().toISOString()
  }
];

// Mock register - ĐÃ SỬA ĐỂ NHẬN fullName
router.post('/register', (req, res) => {
  const { fullName, username, email, password, phone } = req.body;
  console.log('👤 Mock register - Data received:', req.body);
  
  // 🔥 FIX: Dùng fullName hoặc username làm name
  const userName = fullName || username || 'User';
  
  // Check if email exists
  if (mockUsers.find(u => u.email === email)) {
    return res.status(400).json({
      success: false,
      error: 'Email đã tồn tại'
    });
  }
  
  const newUser = {
    id: 'user-' + Date.now(),
    name: userName,
    email,
    password,
    phone: phone || '',
    role: 'user',
    status: 'active',
    createdAt: new Date().toISOString()
  };
  
  mockUsers.push(newUser);
  
  console.log('✅ User registered successfully:', newUser.email);
  
  res.json({
    success: true,
    message: 'Đăng ký thành công!',
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      status: newUser.status
    }
  });
});

// Mock login - ĐÃ SỬA ĐỂ LOG CHI TIẾT
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log('🔐 Mock login attempt:', email);
  
  const user = mockUsers.find(u => u.email === email && u.password === password);
  
  if (user) {
    console.log('✅ Login successful for:', email);
    res.json({
      success: true,
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } else {
    console.log('❌ Login failed for:', email);
    res.status(401).json({
      success: false,
      error: 'Email hoặc mật khẩu không đúng'
    });
  }
});

// Mock get current user
router.get('/me', (req, res) => {
  // Mock authentication - giả sử user đã đăng nhập
  const user = mockUsers[0]; // Lấy user đầu tiên
  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    }
  });
});

// Mock update profile - ĐÃ SỬA ĐỂ NHẬN fullName
router.put('/profile', (req, res) => {
  const { fullName, email, phone } = req.body;
  console.log('📝 Mock update profile:', { fullName, email, phone });
  
  // Giả sử update user đầu tiên
  if (mockUsers[0]) {
    mockUsers[0].name = fullName || mockUsers[0].name;
    mockUsers[0].email = email || mockUsers[0].email;
    mockUsers[0].phone = phone || mockUsers[0].phone;
  }
  
  res.json({
    success: true,
    message: 'Cập nhật thông tin thành công',
    user: mockUsers[0] ? {
      id: mockUsers[0].id,
      name: mockUsers[0].name,
      email: mockUsers[0].email,
      phone: mockUsers[0].phone,
      role: mockUsers[0].role,
      status: mockUsers[0].status
    } : null
  });
});

// Mock change password
router.put('/change-password', (req, res) => {
  const { currentPassword, newPassword } = req.body;
  console.log('🔑 Mock change password');
  
  // Giả sử user đầu tiên
  if (mockUsers[0] && mockUsers[0].password === currentPassword) {
    mockUsers[0].password = newPassword;
    res.json({
      success: true,
      message: 'Đổi mật khẩu thành công'
    });
  } else {
    res.status(400).json({
      success: false,
      error: 'Mật khẩu hiện tại không đúng'
    });
  }
});

// Mock get all users (admin only)
router.get('/users', (req, res) => {
  console.log('👥 Mock get all users (admin)');
  
  const users = mockUsers.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt
  }));
  
  res.json({
    success: true,
    users: users
  });
});

// Mock toggle user status (admin only)
router.put('/users/:id/toggle-status', (req, res) => {
  const userId = req.params.id;
  console.log('🔄 Mock toggle user status:', userId);
  
  const user = mockUsers.find(u => u.id === userId);
  if (user) {
    user.status = user.status === 'active' ? 'inactive' : 'active';
    res.json({
      success: true,
      message: `Đã ${user.status === 'active' ? 'kích hoạt' : 'vô hiệu hóa'} user`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status
      }
    });
  } else {
    res.status(404).json({
      success: false,
      error: 'User không tồn tại'
    });
  }
});

module.exports = router;
