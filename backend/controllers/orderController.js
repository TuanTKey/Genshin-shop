const Order = require('../models/Order');
const Account = require('../models/Account');

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const { accountId, customerName, customerEmail, customerPhone, paymentMethod, notes } = req.body;
    
    // Check if account exists and is available
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ 
        success: false, 
        error: 'Account not found' 
      });
    }
    
    if (account.status !== 'available') {
      return res.status(400).json({ 
        success: false, 
        error: 'Account is not available for purchase' 
      });
    }

    // Create order
    const order = new Order({
      accountId,
      customerName,
      customerEmail,
      customerPhone,
      totalPrice: account.price,
      paymentMethod,
      notes
    });

    await order.save();

    // Update account status to reserved
    account.status = 'reserved';
    await account.save();

    res.status(201).json({ 
      success: true, 
      data: order,
      message: 'Order created successfully'
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate('accountId')
      .sort({ createdAt: -1 });
    
    res.json({ 
      success: true, 
      count: orders.length,
      data: orders 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Get single order
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('accountId');
    
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        error: 'Order not found' 
      });
    }
    
    res.json({ 
      success: true, 
      data: order 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        error: 'Order not found' 
      });
    }

    order.status = status;
    await order.save();

    // If order is delivered, mark account as sold
    if (status === 'delivered') {
      await Account.findByIdAndUpdate(order.accountId, { status: 'sold' });
    }
    
    // If order is cancelled, mark account as available again
    if (status === 'cancelled') {
      await Account.findByIdAndUpdate(order.accountId, { status: 'available' });
    }

    res.json({ 
      success: true, 
      data: order,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
};