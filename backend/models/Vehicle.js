const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    make: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    vin: {
        type: String,
        unique: true
    },
    lastServiceDate: {
        type: Date
    },
    usageLevel: {
        type: Number,
        min: 1,
        max: 10,
        default: 5,
        description: 'Scale of 1-10 representing how heavily the vehicle is used'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;
