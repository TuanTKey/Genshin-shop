const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes (Cần đăng nhập)
router.get('/me', protect, authController.getCurrentUser);
router.put('/profile', protect, authController.updateProfile);
router.put('/change-password', protect, authController.changePassword);

// Admin only routes
router.get('/users', protect, authorize('admin'), authController.getAllUsers);
router.put('/users/:id/toggle-status', protect, authorize('admin'), authController.toggleUserStatus);

module.exports = router;