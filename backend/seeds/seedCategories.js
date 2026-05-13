const mongoose = require('mongoose');
const Category = require('../models/Category');
require('dotenv').config();

const categories = [
    { name: 'Water Purifiers', description: 'Advanced RO+UV+UF water purification systems.' },
    { name: 'Vacuum Cleaners', description: 'Powerful cleaning solutions for home and office.' },
    { name: 'Air Coolers', description: 'Efficient cooling solutions for every space.' },
    { name: 'Kitchen Appliances', description: 'Modern appliances for a smart kitchen.' },
    { name: 'Hardware', description: 'Durable hardware for all your needs.' },
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
