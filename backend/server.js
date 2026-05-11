const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dns = require('dns');
require('dotenv').config();
const helmet = require('helmet');
const path = require('path');

// Force Google DNS to bypass potential SRV resolution issues on local networks
dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middleware
app.use(helmet({
    contentSecurityPolicy: false,
}));
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('ERROR: MONGODB_URI is not defined in .env file');
    process.exit(1);
}

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('✅ Connected to MongoDB Successfully');
        // Ensure Admin User Exists
        try {
            const User = require('./models/User');
            const adminEmail = 'sktrade@gmail.com';
            const existingAdmin = await User.findOne({ email: adminEmail });
            
            if (existingAdmin) {
                // Delete and recreate to ensure clean state and correct hashing
                await User.deleteOne({ email: adminEmail });
                console.log('🧹 Old admin account removed');
            }
            
            await User.create({
                name: 'S.K Trade Admin',
                email: adminEmail,
                password: 'sktrade2026',
                role: 'admin'
            });
            console.log('👑 Admin account created/reset on startup');
            
        } catch (err) {
            console.error('❌ Failed to ensure admin user:', err.message);
        }
    })
    .catch(err => {
        console.error('❌ Could not connect to MongoDB:', err.message);
    });

// Routes
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/', (req, res) => {
    res.json({ 
        status: 'success', 
        message: 'S.K Trade and Suppliers API is live',
        version: '1.0.0'
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Internal Server Error'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
