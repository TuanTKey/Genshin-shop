const mongoose = require('mongoose');
const Account = require('./models/Account');
require('dotenv').config();

const sampleAccounts = [
  {
    adventureRank: 55,
    characters: ['Zhongli', 'Raiden Shogun', 'Kazuha', 'Nahida', 'Hu Tao'],
    fiveStars: 8,
    fourStars: 25,
    primogems: 15000,
    price: 2500000,
    region: 'Asia',
    status: 'available',
    description: 'Tài khoản mạnh với nhiều nhân vật 5 sao meta'
  },
  {
    adventureRank: 45,
    characters: ['Hu Tao', 'Yelan', 'Ayaka', 'Venti'],
    fiveStars: 6,
    fourStars: 18,
    primogems: 8000,
    price: 1800000,
    region: 'Asia',
    status: 'available',
    description: 'Tài khoản DPS tốt'
  },
  {
    adventureRank: 60,
    characters: ['Neuvillette', 'Furina', 'Arlecchino', 'Xianyun', 'Navia'],
    fiveStars: 12,
    fourStars: 30,
    primogems: 25000,
    price: 4500000,
    region: 'America',
    status: 'available',
    description: 'Tài khoản end-game với đội hình hoàn chỉnh'
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB');

    // Xóa data cũ
    await Account.deleteMany({});
    console.log('Cleared old data');

    // Thêm data mới
    await Account.insertMany(sampleAccounts);
    console.log('✅ Sample accounts added successfully');

    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();