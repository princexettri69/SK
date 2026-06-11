require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const Category = require('./models/Category');
    const Product = require('./models/Product');

    // 1. Create Plywood category if it doesn't exist
    let category = await Category.findOne({ name: 'Plywood' });
    if (!category) {
        category = await Category.create({
            name: 'Plywood',
            description: 'High quality plywood for all your interior and furniture needs.',
            imageUrl: '' // user can update later
        });
        console.log('Category "Plywood" created.');
    } else {
        console.log('Category "Plywood" already exists.');
    }

    const sizes = ['18mm', '12mm', '10mm', '6mm'];
    const productsToAdd = [
        { name: 'Shikhar Ply', price: 3000 },
        { name: 'Ultra Ply', price: 2500 },
        { name: 'Classic Ply', price: 2000 }
    ];

    for (let p of productsToAdd) {
        const existing = await Product.findOne({ name: p.name });
        if (!existing) {
            await Product.create({
                name: p.name,
                category: 'Plywood',
                description: `Premium quality ${p.name} available in multiple thicknesses for durable furniture and interior woodwork.`,
                price: p.price,
                stock: 100,
                features: sizes.map(size => `Available in ${size} thickness`),
                specifications: {
                    Brand: p.name.split(' ')[0],
                    Material: 'Wood',
                    'Available Sizes': sizes.join(', ')
                }
            });
            console.log(`Product "${p.name}" created successfully.`);
        } else {
            console.log(`Product "${p.name}" already exists.`);
        }
    }

    console.log('Finished adding plywood products.');
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
