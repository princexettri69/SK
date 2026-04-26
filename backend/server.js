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
    contentSecurityPolicy: false, // Disable for easier initial deployment, can be hardened later
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
    .then(() => console.log('✅ Connected to MongoDB Successfully'))
    .catch(err => {
        console.error('❌ Could not connect to MongoDB:', err.message);
    });

// Routes
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

// Health check / Production Root
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
