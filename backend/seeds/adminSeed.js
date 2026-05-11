const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const adminEmail = 'sktrade@gmail.com';
        const adminPassword = 'sktrade2026';

        // Check if user already exists
        const existingUser = await User.findOne({ email: adminEmail });
        if (existingUser) {
            console.log('Admin user already exists. Updating role to admin...');
            existingUser.role = 'admin';
            existingUser.password = adminPassword; // This will trigger the pre-save hook for hashing
            await existingUser.save();
            console.log('Admin user updated successfully');
        } else {
            const newAdmin = new User({
                name: 'S.K Trade Admin',
                email: adminEmail,
                password: adminPassword,
                role: 'admin'
            });
            await newAdmin.save();
            console.log('Admin user created successfully');
        }

        mongoose.connection.close();
    } catch (err) {
        console.error('Error creating admin user:', err);
        process.exit(1);
    }
};

createAdmin();
