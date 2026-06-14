const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            },
            price: {
                type: Number,
                required: true
            },
            variant: {
                size: String,
                unit: String
            }
        }
    ],
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    shippingAddress: {
        province: { type: String, required: true },
        district: { type: String, required: true },
        city: { type: String, required: false },
        address: { type: String, required: true },
        phone: { type: String, required: true }
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['COD', 'eSewa', 'Khalti'],
        default: 'COD'
    },
    taxDetails: {
        vatAmount: { type: Number, default: 0 },
        isTaxInvoice: { type: Boolean, default: false },
        panNumber: { type: String, default: '' }
    },
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    paymentStatus: {
        type: String,
        required: true,
        enum: ['Paid', 'Credit', 'Overdue'],
        default: 'Paid'
    },
    orderType: {
        type: String,
        required: true,
        enum: ['Purchase', 'Service'],
        default: 'Purchase'
    },
    discountApplied: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
