const express = require('express');
const router = express.Router();
const Order = require('../models/order.js');
const Cart = require('../models/cart.js');

const { protect } = require('../middleware/auth.js');
const sendEmail = require('../config/email.js');
const { orderConfirmationEmail } = require('../utils/emailTemplates.js');

// @route   POST /api/orders/checkout
// @desc    Create order from cart (mock checkout)
// @access  Private
router.post('/checkout', protect, async (req, res) => {
  try {
    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Prepare order items with current product details
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      size: item.size,
      quantity: item.quantity
    }));

    // Calculate total price
    const totalPrice = orderItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalPrice,
      orderDate: new Date()
    });

    // Populate product details for the response
    await order.populate('items.product');

    // Clear user's cart
    await Cart.findOneAndDelete({ user: req.user._id });

    // Send confirmation email
    try {
      const emailHtml = orderConfirmationEmail(order, req.user);
      await sendEmail({
        to: req.user.email,
        subject: `Order Confirmation - Order #${order._id}`,
        html: emailHtml
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the order if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during checkout',
      error: error.message
    });
  }
});

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const orders = await Order.find({ user: req.user._id })
      .populate('items.product')
      .sort({ orderDate: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Order.countDocuments({ user: req.user._id });

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching orders',
      error: error.message
    });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Make sure order belongs to user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);

    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error fetching order',
      error: error.message
    });
  }
});

module.exports = router;