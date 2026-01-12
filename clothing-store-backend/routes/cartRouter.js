const express = require('express');
const router = express.Router();
const Cart = require('../models/cart.js');
const Product = require('../models/Product.js');
const { protect, optionalAuth } = require('../middleware/auth.js');
const { v4: uuidv4 } = require('uuid');

// Helper function to get or create cart
const getOrCreateCart = async (userId, sessionId) => {
  let cart;

  if (userId) {
    cart = await Cart.findOne({ user: userId }).populate('items.product');
  } else if (sessionId) {
    cart = await Cart.findOne({ sessionId }).populate('items.product');
  }

  if (!cart) {
    cart = await Cart.create({
      user: userId || null,
      sessionId: userId ? null : sessionId,
      items: []
    });
  }

  return cart;
};

// @route   GET /api/cart
// @desc    Get user's cart (works for logged in and guest users)
// @access  Public (with optional auth)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const userId = req.user?._id;
    const sessionId = req.headers['x-session-id'];

    if (!userId && !sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID required for guest users'
      });
    }

    const cart = await getOrCreateCart(userId, sessionId);

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching cart',
      error: error.message
    });
  }
});

// @route   POST /api/cart/items
// @desc    Add item to cart
// @access  Public (with optional auth)
router.post('/items', optionalAuth, async (req, res) => {
  try {
    const { productId, size, quantity = 1 } = req.body;
    const userId = req.user?._id;
    const sessionId = req.headers['x-session-id'] || uuidv4();

    // Validation
    if (!productId || !size) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and size are required'
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if size is available
    if (!product.sizes.includes(size)) {
      return res.status(400).json({
        success: false,
        message: `Size ${size} is not available for this product`
      });
    }

    // Get or create cart
    const cart = await getOrCreateCart(userId, sessionId);

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product._id.toString() === productId && item.size === size
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        size,
        quantity
      });
    }

    await cart.save();
    await cart.populate('items.product');

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: cart,
      sessionId: !userId ? sessionId : undefined
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding item to cart',
      error: error.message
    });
  }
});

// @route   PUT /api/cart/items/:itemId
// @desc    Update cart item quantity
// @access  Public (with optional auth)
router.put('/items/:itemId', optionalAuth, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const userId = req.user?._id;
    const sessionId = req.headers['x-session-id'];

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Valid quantity is required'
      });
    }

    // Find cart
    let cart;
    if (userId) {
      cart = await Cart.findOne({ user: userId });
    } else if (sessionId) {
      cart = await Cart.findOne({ sessionId });
    }

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Find and update item
    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate('items.product');

    res.status(200).json({
      success: true,
      message: 'Cart item updated',
      data: cart
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating cart item',
      error: error.message
    });
  }
});

// @route   DELETE /api/cart/items/:itemId
// @desc    Remove item from cart
// @access  Public (with optional auth)
router.delete('/items/:itemId', optionalAuth, async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user?._id;
    const sessionId = req.headers['x-session-id'];

    // Find cart
    let cart;
    if (userId) {
      cart = await Cart.findOne({ user: userId });
    } else if (sessionId) {
      cart = await Cart.findOne({ sessionId });
    }

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Remove item using pull
    cart.items.pull(itemId);
    await cart.save();
    await cart.populate('items.product');

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: cart
    });
  } catch (error) {
    console.error('Remove cart item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error removing cart item',
      error: error.message
    });
  }
});

// @route   DELETE /api/cart
// @desc    Clear cart
// @access  Public (with optional auth)
router.delete('/', optionalAuth, async (req, res) => {
  try {
    const userId = req.user?._id;
    const sessionId = req.headers['x-session-id'];

    // Find and delete cart
    let cart;
    if (userId) {
      cart = await Cart.findOneAndDelete({ user: userId });
    } else if (sessionId) {
      cart = await Cart.findOneAndDelete({ sessionId });
    }

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error clearing cart',
      error: error.message
    });
  }
});

module.exports = router;