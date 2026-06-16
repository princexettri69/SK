const express = require('express');
const router = express.Router();
const Query = require('../models/Query');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// @route   POST /api/queries
// @desc    Submit a new contact query
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const newQuery = new Query({
            name,
            email,
            subject,
            message
        });

        const savedQuery = await newQuery.save();
        res.status(201).json({ success: true, data: savedQuery });
    } catch (err) {
        console.error('Error saving query:', err);
        res.status(500).json({ message: 'Server error while saving query' });
    }
});

// @route   GET /api/queries
// @desc    Get all queries
// @access  Private (Admin only)
router.get('/', protect, restrictTo('admin'), async (req, res) => {
    try {
        const queries = await Query.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: queries.length, data: queries });
    } catch (err) {
        console.error('Error fetching queries:', err);
        res.status(500).json({ message: 'Server error while fetching queries' });
    }
});

module.exports = router;
