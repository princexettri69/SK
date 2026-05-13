const mongoose = require('mongoose');
const Product = require('../models/Product');
const dns = require('dns');
require('dotenv').config();

// Force Google DNS to bypass potential SRV resolution issues on local networks
dns.setServers(['8.8.8.8', '8.8.4.4','0.0.0.0']);

const products = [
    // --- WATER PURIFIERS ---
    {
        name: 'KENT GRAND STAR-B',
        category: 'Water Purifiers',
        description: 'Advanced RO+UV+UF+TDS Controller + Double UV Protection. Suitable for brackish/Tap/Municipal water.',
        features: ['RO+UV+UF+TDS Controller', 'Double UV Protection', 'Zero Water Wastage', 'Display of minerals & purity'],
        imageUrl: '/images/products/kent-grand-star-b.jpg',
        price: 28500,
        stock: 25,
        specifications: { 'Storage Capacity': '9 L', 'Purification Rate': '20L/hr', 'Mounting': 'Wall Mounting' }
    },
    {
        name: 'KENT PEARL STAR',
        category: 'Water Purifiers',
        description: 'RO+UV+UF+TDS Controller water purifier with Auto-Flushing System and transparent detachable tank.',
        features: ['Auto-Flushing System', 'Digital Display of Purity', 'Detachable Tank', 'Table Top/Wall Mounting'],
        imageUrl: '/images/products/kent-pearl-star.jpg',
        price: 32000,
        stock: 15,
        specifications: { 'Storage Capacity': '11 L', 'Max Duty Cycle': '100 L/day', 'Power Consumption': '60 W' }
    },
    {
        name: 'KENT CRYSTAL STAR',
        category: 'Water Purifiers',
        description: 'RO+UV+UF+TDS Controller with UV in-tank. Advanced purification for home.',
        features: ['UV In-tank', 'Zero Water Wastage', 'Mineral RO Technology'],
        imageUrl: '/images/products/kent-crystal-star.jpg',
        price: 29500,
        stock: 18,
        specifications: { 'Storage Capacity': '11 L', 'Purification Rate': '20L/hr' }
    },
    {
        name: 'KENT ELEGANT',
        category: 'Water Purifiers',
        description: 'Compact and efficient RO water purifier with UV in-tank protection.',
        features: ['RO+UF+TDS Controller', 'UV in Tank', 'Elegant Design'],
        imageUrl: '/images/products/kent-elegant.jpg',
        price: 24000,
        stock: 30,
        specifications: { 'Storage Capacity': '8 L', 'Max Duty Cycle': '75 L/day' }
    },

    // --- VACUUM CLEANERS ---
    {
        name: 'KENT WET & DRY VACUUM CLEANER',
        category: 'Vacuum Cleaners',
        description: 'Powerful 1200W vacuum cleaner for deep cleaning of wet and dry surfaces.',
        features: ['Wet and Dry Function', 'Blower Function', '20L Stainless Steel Body'],
        imageUrl: '/images/products/kent-wet-dry-vacuum-cleaner.jpg',
        price: 15500,
        stock: 40,
        specifications: { 'Motor Power': '1200 W', 'Capacity': '20 L', 'Body': 'Stainless Steel' }
    },
    {
        name: 'KENT FORCE CYCLONIC',
        category: 'Vacuum Cleaners',
        description: 'Advanced cyclonic technology with powerful 2000W motor for dust-free home.',
        features: ['Cyclonic Technology', '2000W High Power', 'Advanced HEPA Filter'],
        imageUrl: '/images/products/kent-force-cyclonic-vacuum-cleaner.jpg',
        price: 18500,
        stock: 22,
        specifications: { 'Motor Power': '2000 W', 'Filter': 'HEPA', 'Bag Type': 'Bagless' }
    },
    {
        name: 'KENT ZOOM PLUS',
        category: 'Vacuum Cleaners',
        description: 'Portable handheld vacuum cleaner for cars and quick home cleanups.',
        features: ['Cordless Design', 'Lightweight', 'Washable Filter'],
        imageUrl: '/images/products/kent-zoom-plus-vacuum-cleaner.jpg',
        price: 7500,
        stock: 50,
        specifications: { 'Weight': '1.2kg', 'Battery': 'Lithium-ion' }
    },

    // --- AIR COOLERS ---
    {
        name: 'KENT AEROCOOL PC 45L',
        category: 'Air Coolers',
        description: 'Personal air cooler with Bacto-Shield honeycomb cooling pads.',
        features: ['Bacto-Shield Honeycomb Pads', 'Inverter Compatibility', '4 Way Air Deflection'],
        imageUrl: '/images/products/kent-aerocool-pc-45l.jpg',
        price: 12500,
        stock: 35,
        specifications: { 'Capacity': '45 L', 'Air Delivery': '2500 m3/hr', 'Cooling Pad': 'Honeycomb' }
    },
    {
        name: 'KENT SMARTCOOL SD 70L',
        category: 'Air Coolers',
        description: 'High capacity desert cooler for large spaces with anti-bacterial tank.',
        features: ['Anti-Bacterial Tank', 'Honeycomb Pad', 'Ice Chamber'],
        imageUrl: '/images/products/kent-smartcool-sd-70l.jpg',
        price: 18500,
        stock: 20,
        specifications: { 'Capacity': '70 L', 'Air Delivery': '3800 m3/hr', 'Type': 'Desert' }
    },

    // --- KITCHEN APPLIANCES ---
    {
        name: 'ELICA I-SMART CHIMNEY',
        category: 'Kitchen Appliances',
        description: 'Inverter technology smart chimney with Baffle filter and motion sensor.',
        features: ['Inverter Technology', 'Motion Sensor', 'Capacitive Touch'],
        imageUrl: '/images/products/elica-i-smart-spot-h6-bf-ltw-90-nero.jpg',
        price: 45000,
        stock: 10,
        specifications: { 'Size': '90 cm', 'Suction': '1200 m3/hr', 'Filter': 'Baffle' }
    },
    {
        name: 'ELICA COOKING RANGE',
        category: 'Kitchen Appliances',
        description: 'Premium gas cooking range featuring an oven and grill with push button auto ignition.',
        features: ['Push Button Auto Ignition', 'Rotisserie', 'Wire Rack & Enamelled Tray'],
        imageUrl: '/images/products/elica-cooking-range-f-6402-zgrh.jpg',
        price: 85000,
        stock: 5,
        specifications: { 'Oven Capacity': '54 Litres', 'Burners': '4' }
    },
    {
        name: 'CG FILTERLESS CHIMNEY',
        category: 'Kitchen Appliances',
        description: 'Designer toughened glass hob with brass burners and auto ignition.',
        features: ['Toughened Glass', 'Brass Burners', 'Auto Ignition'],
        imageUrl: '/images/products/cg-cgct90max.jpg',
        price: 18000,
        stock: 25,
        specifications: { 'Burners': '3', 'Ignition': 'Battery Operated' }
    },
    {
        name: 'ELICA MICROWAVE OVEN',
        category: 'Kitchen Appliances',
        description: 'Fast and safe induction cooktop with Indian menu presets.',
        features: ['Touch Control', 'Preset Menu', 'Overheat Protection'],
        imageUrl: '/images/products/elica-built-in-microwave-epbi-mwo-g28.jpg',
        price: 6500,
        stock: 45,
        specifications: { 'Power': '2000W', 'Surface': 'Ceramic Glass' }
    },
    {
        name: 'ELICA FLAT CHIMNEY',
        category: 'Kitchen Appliances',
        description: 'Flat series chimney with expanded suction area and heat auto clean technology.',
        features: ['Heat Auto Clean', 'Expanded Suction Area', 'Filterless Technology'],
        imageUrl: '/images/products/elica-fl-plus-900-spt-max-hac-ltw-ms-nero.jpg',
        price: 38000,
        stock: 12,
        specifications: { 'Size': '90 cm', 'Air Flow': '1600 m3/hr' }
    },

    // --- INTERIOR DECOR ---
    {
        name: 'PREMIUM TEAK WALL PANELS',
        category: 'Interior Decor',
        description: 'Elegant teak wood wall cladding for professional interior finish.',
        features: ['Natural Teak Finish', 'Termite Resistant', 'Easy to Install'],
        imageUrl: '/images/products/premium-teak-wood-wall-panels.jpg',
        price: 4500,
        stock: 100,
        specifications: { 'Material': 'Grade A Teak', 'Size': '8ft x 4ft' }
    }
];

const seedDB = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI;
        if (!MONGODB_URI) {
            console.error('ERROR: MONGODB_URI is not defined in .env file');
            process.exit(1);
        }
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');
        
        await Product.deleteMany({});
        await Product.insertMany(products);
        
        console.log('Database seeded successfully with all products from images!');
        process.exit();
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedDB();
