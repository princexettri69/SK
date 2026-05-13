const mongoose = require('mongoose');
const Category = require('../models/Category');
const dns = require('dns');
require('dotenv').config();

// Force Google DNS to bypass potential SRV resolution issues on local networks
dns.setServers(['8.8.8.8', '8.8.4.4','0.0.0.0']);

const categories = [
    { name: 'Water Purifiers', description: 'Advanced RO+UV+UF water purification systems.' },
    { name: 'Vacuum Cleaners', description: 'Powerful cleaning solutions for home and office.' },
    { name: 'Air Coolers', description: 'Efficient cooling solutions for every space.' },
    { name: 'Kitchen Appliances', description: 'Modern appliances for a smart kitchen.' },
    { name: 'Interior Decor', description: 'Premium decor to beautify your living space.' }
];

const seedCategories = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI;
        if (!MONGODB_URI) {
            console.error('ERROR: MONGODB_URI is not defined in .env file');
            process.exit(1);
        }
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB for category seeding...');
        
        await Category.deleteMany({});
        await Category.insertMany(categories);
        
        console.log('Categories seeded successfully!');
        process.exit();
    } catch (err) {
        console.error('Error seeding categories:', err);
        process.exit(1);
    }
};

seedCategories();
