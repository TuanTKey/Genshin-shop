const mongoose = require('mongoose');
const User = require('./models/User');

// 🔥 SỬA: Dùng MongoDB URI trực tiếp thay vì từ .env
const MONGODB_URI = 'mongodb+srv://shop_ghenshin_db_user:tuan1311@cluster0.8vfcbgu.mongodb.net/genshin-shop?retryWrites=true&w=majority';

const createAdminUser = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB');

    // Check if admin exists
    const adminExists = await User.findOne({ username: 'admin' });
    if (adminExists) {
      console.log('⚠️  Admin user already exists');
      process.exit();
    }

    // Create admin user
    const admin = new User({
      username: 'admin',
      email: 'admin@genshinshop.com',
      password: 'admin123', // Sẽ được hash tự động
      fullName: 'Administrator',
      role: 'admin'
    });

    await admin.save();

    console.log('✅ Admin user created successfully');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('⚠️  Please change the password after first login!');

    process.exit();
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdminUser();
