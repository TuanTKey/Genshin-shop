const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  accountId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Account', 
    required: true 
  },
  customerName: { 
    type: String, 
    required: [true, 'Customer name is required'],
    trim: true
  },
  customerEmail: { 
    type: String, 
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  customerPhone: { 
    type: String,
    trim: true
  },
  totalPrice: { 
    type: Number, 
    required: true,
    min: 0
  },
  status: { 
    type: String, 
    enum: ['pending', 'paid', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  paymentMethod: {
    type: String,
    enum: ['bank_transfer', 'momo', 'zalopay', 'card'],
    default: 'bank_transfer'
  },
  notes: String,
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Order', orderSchema);