require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const Category = require('./models/Category');
    const categories = await Category.find({ imageUrl: { $regex: '^/uploads/' } });
    for (let c of categories) {
        c.imageUrl = c.imageUrl.replace('/uploads/', '/images/products/');
        await c.save();
    }
    console.log('Updated ' + categories.length + ' categories');
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
