const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// CORS - cho phép tất cả domain trong lúc fix
app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json());

// Routes cơ bản trước
app.get('/api', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Genshin Shop API is running!',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    service: 'backend',
    timestamp: new Date().toISOString()
  });
});

// Kết nối MongoDB (dùng URI từ render.yaml)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://shop_ghenshin_db_user:tuan1311@cluster0.8vfcbgu.mongodb.net/genshin-shop?appName=Cluster0';

mongoose.connect(MONGODB_URI)
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 MongoDB URI: ${MONGODB_URI.includes('@') ? 'Using Atlas' : 'Using local'}`);
});
