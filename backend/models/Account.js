const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  adventureRank: { 
    type: Number, 
    required: [true, 'Adventure Rank is required'],
    min: [1, 'AR must be at least 1'],
    max: [60, 'AR cannot exceed 60']
  },
  characters: {
    type: [String],
    default: []
  },
  fiveStars: { 
    type: Number, 
    default: 0,
    min: 0
  },
  fourStars: { 
    type: Number, 
    default: 0,
    min: 0
  },
  primogems: { 
    type: Number, 
    default: 0,
    min: 0
  },
  price: { 
    type: Number, 
    required: [true, 'Price is required'],
    min: [0, 'Price must be positive']
  },
  region: { 
    type: String, 
    enum: ['Asia', 'America', 'Europe'], 
    required: [true, 'Region is required']
  },
  status: { 
    type: String, 
    enum: ['available', 'sold', 'reserved'], 
    default: 'available' 
  },
  description: String,
  images: [String],
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Update timestamp trước khi save
accountSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Account', accountSchema);