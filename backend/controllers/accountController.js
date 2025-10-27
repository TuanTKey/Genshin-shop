const Account = require('../models/Account');

// Get all accounts
exports.getAllAccounts = async (req, res) => {
  try {
    const { region, minAR, maxPrice, status, search } = req.query;
    
    let filter = {};
    
    if (region) filter.region = region;
    if (minAR) filter.adventureRank = { $gte: parseInt(minAR) };
    if (maxPrice) filter.price = { $lte: parseInt(maxPrice) };
    if (status) filter.status = status;
    if (search) {
      filter.characters = { $regex: search, $options: 'i' };
    }

    const accounts = await Account.find(filter).sort({ createdAt: -1 });
    
    res.json({ 
      success: true, 
      count: accounts.length,
      data: accounts 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Get single account by ID
exports.getAccountById = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    
    if (!account) {
      return res.status(404).json({ 
        success: false, 
        error: 'Account not found' 
      });
    }
    
    res.json({ 
      success: true, 
      data: account 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Create new account
exports.createAccount = async (req, res) => {
  try {
    const account = new Account(req.body);
    await account.save();
    
    res.status(201).json({ 
      success: true, 
      data: account,
      message: 'Account created successfully'
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Update account
exports.updateAccount = async (req, res) => {
  try {
    const account = await Account.findByIdAndUpdate(
      req.params.id, 
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!account) {
      return res.status(404).json({ 
        success: false, 
        error: 'Account not found' 
      });
    }
    
    res.json({ 
      success: true, 
      data: account,
      message: 'Account updated successfully'
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Delete account
exports.deleteAccount = async (req, res) => {
  try {
    const account = await Account.findByIdAndDelete(req.params.id);
    
    if (!account) {
      return res.status(404).json({ 
        success: false, 
        error: 'Account not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Account deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Get statistics
exports.getStats = async (req, res) => {
  try {
    const totalAccounts = await Account.countDocuments();
    const availableAccounts = await Account.countDocuments({ status: 'available' });
    const soldAccounts = await Account.countDocuments({ status: 'sold' });
    
    const avgPrice = await Account.aggregate([
      { $group: { _id: null, avgPrice: { $avg: '$price' } } }
    ]);

    res.json({
      success: true,
      data: {
        total: totalAccounts,
        available: availableAccounts,
        sold: soldAccounts,
        averagePrice: avgPrice[0]?.avgPrice || 0
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};