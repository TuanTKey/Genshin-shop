const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
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

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/genshin-shop')
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Test route
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Genshin Shop API is running!',
    timestamp: new Date().toISOString()
  });
});

// Health check route for Render
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

// 🔥 SỬA LỖI: Thay thế catch-all route bằng cách này
// Handle undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'API route not found',
    path: req.originalUrl 
  });
});

// Handle non-API routes (for frontend)
app.get('*', (req, res) => {
  res.status(200).json({ 
    message: 'Genshin Shop Backend is running',
    backend: 'https://genshin-shop-backend.onrender.com',
    frontend: 'https://genshin-shop-gs.onrender.com',
    api_docs: 'Visit /api for API information'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
  });
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 MongoDB: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
});
