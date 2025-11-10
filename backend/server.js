const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

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

// MongoDB Connection - FIXED
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://shop_ghenshin_db_user:tuan1311@cluster0.8vfcbgu.mongodb.net/genshin-shop?retryWrites=true&w=majority';

console.log('🔗 Connecting to MongoDB...');

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
  console.log('📊 Database:', mongoose.connection.db.databaseName);
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

// MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('📡 MongoDB event: Connected');
});

mongoose.connection.on('error', (err) => {
  console.error('📡 MongoDB event: Error', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('📡 MongoDB event: Disconnected');
});

// Test route
app.get('/api', (req, res) => {
  res.json({ 
    success: true,
    message: 'Genshin Shop API is running!',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({ 
    status: 'OK', 
    service: 'backend',
    mongodb: dbStatus,
    timestamp: new Date().toISOString()
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

// Handle 404 for all routes
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    res.status(404).json({ 
      success: false, 
      error: 'API endpoint not found',
      path: req.originalUrl
    });
  } else {
    res.json({
      message: 'Genshin Shop Backend Server',
      frontend: 'https://genshin-shop-frontend.onrender.com',
      api_endpoints: {
        health: '/api/health',
        auth: '/api/auth',
        accounts: '/api/accounts',
        orders: '/api/orders'
      },
      mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ 
    success: false, 
    error: 'Internal Server Error'
  });
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 MongoDB readyState: ${mongoose.connection.readyState}`);
});
