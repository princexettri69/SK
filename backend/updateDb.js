require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const Product = require('./models/Product');
    const products = await Product.find({ imageUrl: /^\/images\/products\/17/ });
    for (let p of products) {
        p.imageUrl = p.imageUrl.replace('/images/products/', '/uploads/');
        await p.save();
    }
    console.log('Reverted ' + products.length + ' products');
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
