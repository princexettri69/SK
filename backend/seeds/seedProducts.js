const mongoose = require('mongoose');
const Product = require('../models/Product');
const dns = require('dns');
require('dotenv').config();

// Force Google DNS to bypass potential SRV resolution issues on local networks
dns.setServers(['8.8.8.8', '8.8.4.4','0.0.0.0']);

const products = [
    // WATER PURIFIERS
    {
        name: 'KENT GRAND STAR-B',
        category: 'Water Purifiers',
        description: 'Advanced RO+UV+UF+TDS Controller + Double UV Protection. Suitable for brackish/Tap/Municipal water.',
        features: ['RO+UV+UF+TDS Controller', 'Double UV Protection', 'Zero Water Wastage', 'Display of minerals & purity'],
        imageUrl: '/images/products/kent-grand-star-b.jpg',
        price: 28500,
        specifications: {
            'Storage Capacity': '9 L',
            'Max Duty Cycle': '100L/day',
            'Purification Rate': '20L/hr',
            'Mounting': 'Wall Mounting'
        }
    },
    {
        name: 'KENT PEARL STAR',
        category: 'Water Purifiers',
        description: 'RO+UV+UF+TDS Controller water purifier with Auto-Flushing System and transparent detachable tank.',
        features: ['Auto-Flushing System', 'Digital Display of Purity', 'Detachable Tank', 'Table Top/Wall Mounting'],
        imageUrl: '/images/products/kent-pearl-star.jpg',
        price: 32000,
        specifications: {
            'Storage Capacity': '11 L',
            'Max Duty Cycle': '100 L/day',
            'Power Consumption': '60 W',
            'Mounting': 'Wall Mounting / Table Top'
        }
    },
    {
        name: 'KENT CRYSTAL STAR',
        category: 'Water Purifiers',
        description: 'RO+UV+UF+TDS Controller with UV in-tank. Advanced purification for home.',
        features: ['UV In-tank', 'Zero Water Wastage', 'Mineral RO Technology'],
        imageUrl: '/images/products/kent-crystal-star.jpg',
        price: 29500,
        specifications: {
            'Storage Capacity': '11 L',
            'Max Duty Cycle': '100L/day',
            'Purification Rate': '20L/hr'
        }
    },
    {
        name: 'KENT ELEGANT',
        category: 'Water Purifiers',
        description: 'Compact and efficient RO water purifier with UV in-tank protection.',
        features: ['RO+UF+TDS Controller', 'UV in Tank', 'Elegant Design'],
        imageUrl: '/images/products/kent-elegant.jpg',
        price: 24000,
        specifications: {
            'Storage Capacity': '8 L',
            'Max Duty Cycle': '75 L/day',
            'Mounting': 'Wall Mounting'
        }
    },
    // VACUUM CLEANERS
    {
        name: 'KENT WET & DRY VACUUM CLEANER',
        category: 'Vacuum Cleaners',
        description: 'Powerful 1200W vacuum cleaner for deep cleaning of wet and dry surfaces.',
        features: ['Wet and Dry Function', 'Blower Function', '20L Stainless Steel Body', 'Rubberized Wheels'],
        imageUrl: '/images/products/kent-wet-dry-vacuum-cleaner.jpg',
        price: 15500,
        specifications: {
            'Motor Power': '1200 W',
            'Max Vacuum Pressure': '>18 KPA',
            'Body Material': 'Stainless Steel',
            'Capacity': '20 L'
        }
    },
    {
        name: 'KENT FORCE CYCLONIC VACUUM CLEANER',
        category: 'Vacuum Cleaners',
        description: 'Advanced cyclonic technology with powerful 2000W motor for dust-free home.',
        features: ['Cyclonic Technology', '2000W High Power', 'Advanced HEPA Filter', 'Multiple Accessories'],
        imageUrl: '/images/products/kent-force-cyclonic-vacuum-cleaner.jpg',
        price: 18500,
        specifications: {
            'Motor Power': '2000 W',
            'Filter': 'HEPA',
            'Bag Type': 'Bagless'
        }
    },
    {
        name: 'KENT ZOOM PLUS VACUUM CLEANER',
        category: 'Vacuum Cleaners',
        description: 'Cordless, bagless and multi-functional vacuum cleaner with Advanced Cyclonic Technology.',
        features: ['Cordless & Bagless', 'Multi-Functional', 'Cyclonic Tech', 'Highly efficient HEPA filter'],
        imageUrl: '/images/products/kent-zoom-plus-vacuum-cleaner.jpg',
        price: 21000,
        specifications: {
            'Type': 'Handheld / Reachable',
            'Chargeable': 'Yes',
            'Application': 'Car & Home'
        }
    },
    // KITCHEN CHIMNEYS
    {
        name: 'ELICA I-SMART SPOT H6 BF LTW 90 NERO',
        category: 'Kitchen Appliances',
        description: 'Inverter technology smart chimney with Baffle filter and motion sensor.',
        features: ['Inverter Technology', 'Motion Sensor', 'Capacitive Touch', 'LED Lamps'],
        imageUrl: '/images/products/elica-i-smart-spot-h6-bf-ltw-90-nero.jpg',
        price: 45000,
        specifications: {
            'Size': '90 cm',
            'Motor RPM (Max)': '2500',
            'Filter': 'Baffle',
            'Finish': 'Black'
        }
    },
    {
        name: 'ELICA FL PLUS 900 SPT MAX HAC LTW MS NERO',
        category: 'Kitchen Appliances',
        description: 'Flat series chimney with expanded suction area and heat auto clean technology.',
        features: ['Heat Auto Clean', 'Expanded Suction Area', 'Filterless Technology', '3 Speed Touch'],
        imageUrl: '/images/products/elica-fl-plus-900-spt-max-hac-ltw-ms-nero.jpg',
        price: 38000,
        specifications: {
            'Size': '90 cm',
            'Air Flow': '1600 m3/hr',
            'Finish': 'Black'
        }
    },
    {
        name: 'CG CGCT90MAX',
        category: 'Kitchen Appliances',
        description: 'Flat filterless series chimney with Heat & Auto Clean and motion sensor.',
        features: ['Filterless', 'Touch & Gesture/Motion Control', 'Heat & Auto Clean', 'Bigger Suction Area'],
        imageUrl: '/images/products/cg-cgct90max.jpg',
        price: 32000,
        specifications: {
            'Size': '90 cm',
            'Suction': '1600 m3/hr',
            'Finish': 'Glass & Stainless Steel'
        }
    },
    // COOKING RANGE & OVENS
    {
        name: 'ELICA COOKING RANGE F 6402 ZGRH',
        category: 'Kitchen Appliances',
        description: 'Premium gas cooking range featuring an oven and grill with push button auto ignition.',
        features: ['Push Button Auto Ignition', 'Rotisserie', 'Wire Rack & Enamelled Tray', 'Adjustable Legs'],
        imageUrl: '/images/products/elica-cooking-range-f-6402-zgrh.jpg',
        price: 85000,
        specifications: {
            'Oven Capacity': '54 Litres',
            'Burners': '4 (2 Medium + 1 Small + 1 Triple Ring)',
            'Finish': 'Stainless Steel'
        }
    },
    {
        name: 'ELICA BUILT-IN MICROWAVE EPBI MWO G28',
        category: 'Kitchen Appliances',
        description: 'Premium built-in microwave oven with grill and capacitive touch display.',
        features: ['Capacitive Touch Control', '8 Auto Cooking Programs', 'Microwave + Grill', 'Child Lock'],
        imageUrl: '/images/products/elica-built-in-microwave-epbi-mwo-g28.jpg',
        price: 42000,
        specifications: {
            'Capacity': '28 L',
            'Turntable': '315 mm',
            'Dimension': '595x401x388 mm'
        }
    },
    // AIR COOLERS
    {
        name: 'KENT AEROCOOL PC 45L',
        category: 'Air Coolers',
        description: 'Personal air cooler with Bacto-Shield honeycomb cooling pads.',
        features: ['Bacto-Shield Honeycomb Pads', 'Inverter Compatibility', 'Robust Water Tank', '4 Way Air Deflection'],
        imageUrl: '/images/products/kent-aerocool-pc-45l.jpg',
        price: 12500,
        specifications: {
            'Capacity': '45 L',
            'Air Delivery': '2500 m3/hr',
            'Cooling Pad': 'Honeycomb'
        }
    },
    {
        name: 'KENT SMARTCOOL SD 70L',
        category: 'Air Coolers',
        description: 'High capacity desert cooler for large spaces with anti-bacterial tank.',
        features: ['Anti-Bacterial Tank', 'Honeycomb Pad', 'Ice Chamber', 'Superior Air Delivery'],
        imageUrl: '/images/products/kent-smartcool-sd-70l.jpg',
        price: 18500,
        specifications: {
            'Capacity': '70 L',
            'Air Delivery': '3800 m3/hr',
            'Type': 'Desert'
        }
    },
    // HARDWARE & INTERIOR
    {
        name: 'PREMIUM TEAK WOOD WALL PANELS',
        category: 'Interior Decor',
        description: 'Elegant teak wood wall cladding for professional interior finish.',
        features: ['Natural Teak Finish', 'Termite Resistant', 'Easy to Install', 'Acoustic Benefits'],
        imageUrl: '/images/products/premium-teak-wood-wall-panels.jpg',
        price: 4500,
        specifications: {
            'Material': 'Grade A Teak',
            'Size': '8ft x 4ft'
        }
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
