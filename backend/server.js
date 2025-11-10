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

// 🔥 XÓA dòng này - Frontend được serve riêng
// app.use(express.static(path.join(__dirname, '../frontend/build')));

// MongoDB Connection - SỬA deprecated options
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

// 🔥 XÓA hoặc SỬA catch-all route này
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    res.status(404).json({ error: 'API route not found' });
  } else {
    res.status(200).json({ 
      message: 'Backend server is running. Frontend is served separately.',
      backend: 'https://genshin-shop-backend.onrender.com',
      frontend: 'https://genshin-shop-gs.onrender.com'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
  });
});

// Start server - ĐỂ RENDER TỰ ĐỘNG SET PORT
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
