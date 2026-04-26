const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Helper to create JWT token
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'your-fallback-secret-key', {
        expiresIn: process.env.JWT_EXPIRES_IN || '30d'
    });
};

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log('--- Registration Attempt ---');
        console.log('Data:', { name, email, password: '***' });

        if (!name || !email || !password) {
            return res.status(400).json({ status: 'fail', message: 'Please provide name, email and password' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('Result: Failed - User exists');
            return res.status(400).json({ status: 'fail', message: 'User already exists with this email' });
        }

        const newUser = await User.create({
            name,
            email,
            password
        });

        console.log('Result: Success - User created');
        const token = signToken(newUser._id);

        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: {
                    id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role
                }
            }
        });
    } catch (err) {
        console.error('--- Registration Error ---');
        console.error(err);
        
        let message = 'Registration failed. Please try again.';
        if (err.code === 11000) {
            message = 'This email is already registered. Please login or use another email.';
        } else if (err.name === 'ValidationError') {
            message = Object.values(err.errors).map(val => val.message).join('. ');
        } else if (err.message) {
            message = err.message;
        }

        res.status(400).json({
            status: 'fail',
            message: message
        });
    }
});

// @route   POST /api/auth/login
// @desc    Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('--- Login Attempt ---', email);

        // 1) Check if email and password exist
        if (!email || !password) {
            return res.status(400).json({ status: 'fail', message: 'Please provide email and password' });
        }

        // 2) Check if user exists && password is correct
        const user = await User.findOne({ email }).select('+password');
        
        if (!user || !(await user.comparePassword(password, user.password))) {
            console.log('Result: Failed - Invalid credentials');
            return res.status(401).json({ status: 'fail', message: 'Incorrect email or password' });
        }

        // 3) If everything ok, send token to client
        const token = signToken(user._id);

        console.log('Result: Success - User logged in');
        res.status(200).json({
            status: 'success',
            token,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        });
    } catch (err) {
        console.error('--- Login Error ---', err);
        res.status(400).json({
            status: 'fail',
            message: err.message || 'Login failed'
        });
    }
});

// @route   GET /api/auth/me
// @desc    Get current user profile (using token)
router.get('/me', async (req, res) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ status: 'fail', message: 'You are not logged in' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-fallback-secret-key');
        const currentUser = await User.findById(decoded.id);

        if (!currentUser) {
            return res.status(401).json({ status: 'fail', message: 'The user belonging to this token no longer exists' });
        }

        res.status(200).json({
            status: 'success',
            data: {
                user: {
                    id: currentUser._id,
                    name: currentUser.name,
                    email: currentUser.email,
                    role: currentUser.role
                }
            }
        });
    } catch (err) {
        res.status(401).json({
            status: 'fail',
            message: 'Invalid token or session expired'
        });
    }
});

module.exports = router;
