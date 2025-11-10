const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware cực kỳ đơn giản
app.use(cors());
app.use(express.json());

// Route TEST - không cần MongoDB
app.get('/api', (req, res) => {
  res.json({ 
    success: true, 
    message: '🚀 Backend is WORKING!',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'genshin-shop-backend',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Route đăng ký/đăng nhập TEST
app.post('/api/auth/register', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Register endpoint is working',
    data: req.body 
  });
});

app.post('/api/auth/login', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Login endpoint is working', 
    token: 'test-jwt-token',
    user: { id: 1, email: req.body.email }
  });
});

// Kết nối MongoDB (bỏ qua nếu lỗi)
const MONGODB_URI = 'mongodb+srv://shop_ghenshin_db_user:tuan1311@cluster0.8vfcbgu.mongodb.net/genshin-shop?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => {
    console.log('⚠️ MongoDB connection failed, but server still runs');
    console.log(err.message);
  });

// Khởi động server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🎉 SERVER IS RUNNING on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});
