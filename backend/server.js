const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

require('dotenv').config();

const app = express();

// CORS Configuration
app.use(cors({
  origin: [
    'https://genshin-shop-frontend.onrender.com',
    'https://genshin-shop-gs.onrender.com',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection - SỬA deprecated options
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/genshin-shop')
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Test route
app.get('/api', (req, res) => {
  res.json({ message: 'Genshin Shop API is running!' });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    service: 'backend',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Import routes
const accountRoutes = require('./routes/accountRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');

// Use routes
app.use('/api/accounts', accountRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

// 🔥 FIX LỖI: Sửa catch-all route thành đúng cú pháp
// Handle React Router routes - chỉ serve frontend cho các route không phải API
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    // Nếu là API route không tồn tại, trả về 404
    return res.status(404).json({ 
      success: false, 
      error: 'API endpoint not found',
      path: req.path 
    });
  }
  
  // Nếu không phải API route, trả về thông báo backend đang chạy
  res.json({
    message: 'Genshin Shop Backend Server is running',
    frontend: 'https://genshin-shop-frontend.onrender.com',
    api: 'Use /api for API endpoints'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    error: err.message || 'Internal Server Error' 
  });
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
