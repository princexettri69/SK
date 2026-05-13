const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Get all orders (Admin only)
router.get('/', protect, restrictTo('admin'), async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'name email').populate('items.product', 'name price imageUrl').sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get user orders
router.get('/myorders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate('items.product', 'name price imageUrl').sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single order
router.get('/:id', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email').populate('items.product', 'name price imageUrl');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        
        // Check if order belongs to user or user is admin
        if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const Product = require('../models/Product');

// Create order
router.post('/', protect, async (req, res) => {
    try {
        let { items, shippingAddress, totalPrice } = req.body;
        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }
        
        // Loyalty Program: 10% discount if spend more than 5000 in a single purchase
        let discountApplied = 0;
        if (totalPrice > 5000) {
            discountApplied = totalPrice * 0.1;
            totalPrice = totalPrice - discountApplied;
            console.log(`🎁 Loyalty Program: Applied 10% discount (-${discountApplied}) to order for user ${req.user.name}`);
        }
        
        const order = new Order({
            user: req.user._id,
            items,
            shippingAddress,
            totalPrice,
            discountApplied
        });
        
        const createdOrder = await order.save();
        
        // Update stock and check for low stock notifications
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (product) {
                product.stock -= item.quantity;
                await product.save();
                
                // Low stock notification (< 10)
                if (product.stock < 10) {
                    console.log(`⚠️ LOW STOCK ALERT: Product "${product.name}" (ID: ${product._id}) is down to ${product.stock} units!`);
                    // In a real app, you would send an email or push notification to the admin here
                }
            }
        }
        
        res.status(201).json(createdOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update order status (Admin only)
router.patch('/:id/status', protect, restrictTo('admin'), async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        
        order.status = req.body.status;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
