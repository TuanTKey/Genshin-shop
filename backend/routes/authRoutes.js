const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || 'genshin-shop-jwt-secret-2024';

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// Middleware to verify token
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Token is invalid.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Token is invalid.'
    });
  }
};

// Register with real database
router.post('/register', async (req, res) => {
  try {
    const { fullName, username, email, password, phone } = req.body;
    
    console.log('👤 REAL DATABASE - Register attempt:', { username, email });

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email hoặc username đã tồn tại'
      });
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      password,
      fullName,
      phone: phone || '',
      role: 'user',
      isActive: true
    });

    // Save to database
    await newUser.save();
    
    console.log('✅ REAL DATABASE - User registered successfully:', newUser.email);

    // Generate token
    const token = generateToken(newUser._id);

    // Return response
    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công!',
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.fullName,
        phone: newUser.phone,
        role: newUser.role,
        isActive: newUser.isActive,
        createdAt: newUser.createdAt
      }
    });

  } catch (error) {
    console.error('❌ REAL DATABASE - Register error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: errors.join(', ')
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Email hoặc username đã tồn tại'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Lỗi server, vui lòng thử lại sau'
    });
  }
});

// Login with real database
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log('🔐 REAL DATABASE - Login attempt:', username);

    // Find user by username or email
    const user = await User.findOne({
      $or: [{ email: username }, { username: username }]
    }).select('+password');

    if (!user) {
      console.log('❌ REAL DATABASE - User not found:', username);
      return res.status(401).json({
        success: false,
        error: 'Email hoặc mật khẩu không đúng'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Tài khoản đã bị vô hiệu hóa'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      console.log('❌ REAL DATABASE - Invalid password for:', username);
      return res.status(401).json({
        success: false,
        error: 'Email hoặc mật khẩu không đúng'
      });
    }

    console.log('✅ REAL DATABASE - Login successful for:', user.email);

    // Generate token
    const token = generateToken(user._id);

    // Return response
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('❌ REAL DATABASE - Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Lỗi server, vui lòng thử lại sau'
    });
  }
});

// Get current user profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    console.log('📊 REAL DATABASE - Get user profile:', req.user.email);
    
    res.json({
      success: true,
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        fullName: req.user.fullName,
        phone: req.user.phone,
        role: req.user.role,
        isActive: req.user.isActive,
        createdAt: req.user.createdAt
      }
    });
  } catch (error) {
    console.error('❌ REAL DATABASE - Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Lỗi server'
    });
  }
});

// Update profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { fullName, email, phone } = req.body;
    
    console.log('📝 REAL DATABASE - Update profile:', { fullName, email, phone });

    // Check if email is already taken by another user
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'Email đã được sử dụng'
        });
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        fullName: fullName || req.user.fullName,
        email: email || req.user.email,
        phone: phone || req.user.phone
      },
      { new: true, runValidators: true }
    );

    console.log('✅ REAL DATABASE - Profile updated successfully');

    res.json({
      success: true,
      message: 'Cập nhật thông tin thành công',
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        phone: updatedUser.phone,
        role: updatedUser.role,
        isActive: updatedUser.isActive,
        createdAt: updatedUser.createdAt
      }
    });

  } catch (error) {
    console.error('❌ REAL DATABASE - Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Lỗi server'
    });
  }
});

// Change password
router.put('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    console.log('🔑 REAL DATABASE - Change password attempt');

    // Get user with password
    const user = await User.findById(req.user._id).select('+password');

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        error: 'Mật khẩu hiện tại không đúng'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    console.log('✅ REAL DATABASE - Password changed successfully');

    res.json({
      success: true,
      message: 'Đổi mật khẩu thành công'
    });

  } catch (error) {
    console.error('❌ REAL DATABASE - Change password error:', error);
    res.status(500).json({
      success: false,
      error: 'Lỗi server'
    });
  }
});

// Get all users (admin only)
router.get('/users', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin only.'
      });
    }

    console.log('👥 REAL DATABASE - Get all users (admin)');

    const users = await User.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      users: users.map(user => ({
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt
      }))
    });

  } catch (error) {
    console.error('❌ REAL DATABASE - Get users error:', error);
    res.status(500).json({
      success: false,
      error: 'Lỗi server'
    });
  }
});

// Toggle user status (admin only)
router.put('/users/:id/toggle-status', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin only.'
      });
    }

    const userId = req.params.id;
    console.log('🔄 REAL DATABASE - Toggle user status:', userId);

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User không tồn tại'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `Đã ${user.isActive ? 'kích hoạt' : 'vô hiệu hóa'} user`,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('❌ REAL DATABASE - Toggle status error:', error);
    res.status(500).json({
      success: false,
      error: 'Lỗi server'
    });
  }
});

module.exports = router;
