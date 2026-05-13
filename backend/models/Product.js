const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A product must have a name'],
        trim: true,
        unique: true
    },
    category: {
        type: String,
        required: [true, 'A product must belong to a category'],
        enum: ['Water Purifiers', 'Vacuum Cleaners', 'Air Coolers', 'Kitchen Appliances', 'Hardware', 'Interior Decor']
    },
    description: {
        type: String,
        required: [true, 'A product must have a description']
    },
    price: {
        type: Number,
        required: [true, 'A product must have a price']
    },
    imageUrl: {
        type: String,
        default: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    features: [String],
    specifications: {
        type: Map,
        of: String
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    stock: {
        type: Number,
        required: [true, 'A product must have stock'],
        default: 20
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
