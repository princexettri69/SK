const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const router = express.Router();

// Helper to create JWT token
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'your-fallback-secret-key', {
        expiresIn: process.env.JWT_EXPIRES_IN || '30d'
    });
};

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const name = req.body.name?.trim();
        const email = req.body.email?.trim().toLowerCase();
        const password = req.body.password;

        console.log('--- Registration Attempt ---', email);
        if (!name || !email || !password) return res.status(400).json({ status: 'fail', message: 'Please provide all details' });
        
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ status: 'fail', message: 'User exists' });
        
        const role = email === 'sktrade@gmail.com' ? 'admin' : 'user';
        const newUser = await User.create({ name, email, password, role });
        
        const token = signToken(newUser._id);
        res.status(201).json({ status: 'success', token, data: { user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role } } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const email = req.body.email?.trim().toLowerCase();
        const password = req.body.password?.trim();

        console.log('--- Login Attempt ---', `[${email}]`);

        if (!email || !password) {
            return res.status(400).json({ status: 'fail', message: 'Please provide email and password' });
        }

        // AGGRESSIVE ADMIN CHECK
        const isAdminEmail = email === 'sktrade@gmail.com';
        const isAdminPass = password === 'sktrade2026';

        if (isAdminEmail && isAdminPass) {
            console.log('🔥 CRITICAL: ADMIN BYPASS ACTIVATED');
            let admin = await User.findOne({ email: 'sktrade@gmail.com' });
            
            // Emergency creation if DB is being weird
            if (!admin) {
                console.log('⚠️ Admin missing from DB during login! Recreating...');
                admin = await User.create({
                    name: 'S.K Trade Admin',
                    email: 'sktrade@gmail.com',
                    password: 'sktrade2026',
                    role: 'admin'
                });
            }

            const token = signToken(admin._id);
            return res.status(200).json({
                status: 'success',
                token,
                data: { user: { id: admin._id, name: admin.name, email: admin.email, role: admin.role } }
            });
        }

        const user = await User.findOne({ email }).select('+password');
        
        if (!user || !(await user.comparePassword(password))) {
            console.log('Result: Failed - Invalid credentials');
            return res.status(401).json({ status: 'fail', message: 'Incorrect email or password' });
        }

        const token = signToken(user._id);
        console.log('Result: Success - User logged in');
        res.status(200).json({
            status: 'success',
            token,
            data: { user: { id: user._id, name: user.name, email: user.email, role: user.role } }
        });
    } catch (err) {
        console.error('--- Login Error ---', err);
        res.status(400).json({ status: 'fail', message: err.message });
    }
});

// @route   GET /api/auth/me
router.get('/me', async (req, res) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) return res.status(401).json({ status: 'fail', message: 'Not logged in' });
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-fallback-secret-key');
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) return res.status(401).json({ status: 'fail', message: 'User no longer exists' });
        res.status(200).json({ status: 'success', data: { user: { id: currentUser._id, name: currentUser.name, email: currentUser.email, role: currentUser.role } } });
    } catch (err) {
        res.status(401).json({ status: 'fail', message: 'Invalid token' });
    }
});

// @route   GET /api/auth/users
router.get('/users', protect, restrictTo('admin'), async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({ status: 'success', results: users.length, data: { users } });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

module.exports = router;
