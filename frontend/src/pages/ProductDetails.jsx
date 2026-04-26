import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Info, Tag, Package, Shield, Mail, MessageCircle } from 'lucide-react';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fallback data for immediate UI feedback if DB is slow
    const staticFallback = [
        {
            _id: '1',
            name: 'KENT GRAND STAR-B',
            category: 'Water Purifiers',
            description: 'Advanced RO+UV+UF+TDS Controller with Double UV Protection. S.K Trade ensures authentic installation and service for all KENT products.',
            features: ['RO+UV+UF+TDS Controller', 'Double UV Protection', 'Zero Water Wastage', 'Mineral RO Technology'],
            imageUrl: '/images/products/kent-grand-star-b.jpg',
            specifications: {
                'Storage Capacity': '9 L',
                'Maximum Duty Cycle': '100 L/day',
                'Power Consumption': '60 W',
                'Mounting': 'Wall Mounting'
            }
        },
        {
            _id: '2',
            name: 'KENT PEARL STAR',
            category: 'Water Purifiers',
            description: 'RO+UV+UF+TDS Controller water purifier with Auto-Flushing System and transparent detachable tank.',
            features: ['Auto-Flushing System', 'Digital Display of Purity', 'Detachable Tank', 'Table Top/Wall Mounting'],
            imageUrl: '/images/products/kent-pearl-star.jpg',
            specifications: {
                'Storage Capacity': '11 L',
                'Max Duty Cycle': '100 L/day',
                'Power Consumption': '60 W',
                'Mounting': 'Wall Mounting / Table Top'
            }
        },
        {
            _id: '3',
            name: 'KENT WET & DRY VACUUM',
            category: 'Vacuum Cleaners',
            description: 'Powerful 1200W motor for all-surface deep cleaning. S.K Trade provides full support and accessories for KENT vacuum cleaners.',
            features: ['Wet & Dry Function', 'Blower Function', '20L Stainless Steel Body', 'High Efficiency Motor'],
            imageUrl: '/images/products/kent-wet-dry-vacuum-cleaner.jpg',
            specifications: {
                'Motor Power': '1200 W',
                'Max Vacuum Pressure': '>18 KPA',
                'Body Material': 'Stainless Steel',
                'Capacity': '20 L'
            }
        },
        {
            _id: '4',
            name: 'KENT FORCE CYCLONIC',
            category: 'Vacuum Cleaners',
            description: '2000W high power cyclonic vacuum cleaner with HEPA filter for a dust-free home.',
            features: ['Cyclonic Tech', '2000W Power', 'HEPA Filter', 'Bagless Design'],
            imageUrl: '/images/products/kent-force-cyclonic-vacuum-cleaner.jpg',
            specifications: {
                'Motor Power': '2000 W',
                'Filter Type': 'Washable HEPA',
                'Bin Capacity': '2.0 L'
            }
        },
        {
            _id: '5',
            name: 'ELICA I-SMART SPOT H6',
            category: 'Kitchen Appliances',
            description: 'Premium smart chimney with inverter technology & motion sensor. Perfect for contemporary Nepalese kitchens.',
            features: ['Inverter Technology', 'Motion Sensor', 'Baffle Filter', 'Capacitive Touch'],
            imageUrl: '/images/products/elica-i-smart-spot-h6-bf-ltw-90-nero.jpg',
            specifications: {
                'Size': '90 cm',
                'Motor RPM (Max)': '2500',
                'Filter': 'Baffle Filter',
                'Finish': 'Black Nero'
            }
        },
        {
            _id: '6',
            name: 'ELICA COOKING RANGE F 6402',
            category: 'Kitchen Appliances',
            description: 'Premium gas cooking range with built-in oven and rotisserie. S.K Trade is the authorized partner for Elica appliances.',
            features: ['4 Burners', 'Built-in Oven', 'Auto Ignition', 'Rotisserie Function'],
            imageUrl: '/images/products/elica-cooking-range-f-6402-zgrh.jpg',
            specifications: {
                'Oven Capacity': '54 Litres',
                'Finish': 'Stainless Steel',
                'Ignition': 'Push Button Auto'
            }
        },
        {
            _id: '7',
            name: 'KENT AEROCOOL PC 45L',
            category: 'Air Coolers',
            description: 'Efficient personal air cooler with Bacto-Shield honeycomb pads for healthy cooling.',
            features: ['Honeycomb Pads', 'Inverter Support', '45L Tank', '4 Way Air Deflection'],
            imageUrl: '/images/products/kent-aerocool-pc-45l.jpg',
            specifications: {
                'Capacity': '45 L',
                'Air Delivery': '2500 m3/hr',
                'Power': '160 W'
            }
        },
        {
            _id: '8',
            name: 'KENT SMARTCOOL SD 70L',
            category: 'Air Coolers',
            description: 'High capacity desert air cooler for homes and offices with anti-bacterial tank technology.',
            features: ['70L Tank', 'Ice Chamber', 'Anti-Bacterial Tank', 'Powerful Air Throw'],
            imageUrl: '/images/products/kent-smartcool-sd-70l.jpg',
            specifications: {
                'Capacity': '70 L',
                'Type': 'Desert',
                'Air Delivery': '3800 m3/hr'
            }
        },
        {
            _id: '9',
            name: 'PREMIUM TEAK WOOD PANELS',
            category: 'Interior Decor',
            description: 'Elite wall cladding materials for high-end interior finishes. S.K Trade specializes in full interior set-ups.',
            features: ['Natural Teak', 'Termite Resistant', 'Acoustic Benefits', 'Premium Finish'],
            imageUrl: '/images/products/premium-teak-wood-wall-panels.jpg',
            specifications: {
                'Material': 'A-Grade Teak',
                'Thickness': '12mm',
                'Size': '8ft x 4ft'
            }
        },
        {
            _id: '10',
            name: 'CG CGCT90MAX CHIMNEY',
            category: 'Kitchen Appliances',
            description: 'Advanced filterless chimney with heat auto clean and gesture control for a hassle-free cooking experience.',
            features: ['Filterless Tech', 'Heat Clean', 'Gesture Control', 'High Suction'],
            imageUrl: '/images/products/cg-cgct90max.jpg',
            specifications: {
                'Suction Power': '1600 m3/hr',
                'Size': '90 cm',
                'Control': 'Motion Sensor & Touch'
            }
        }
    ];

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
                if (!response.ok) throw new Error('Product not found');
                const data = await response.json();
                setProduct(data);
                setLoading(false);
            } catch (err) {
                // Check fallback
                const found = staticFallback.find(p => p._id === id);
                if (found) {
                    setProduct(found);
                    setLoading(false);
                } else {
                    setError('Could not load product details.');
                    setLoading(false);
                }
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-accent)' }}>Loading Details...</div>;
    
    if (error || !product) return (
        <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}>
            <h2>{error || 'Product not found'}</h2>
            <Link to="/products" className="btn btn-primary" style={{ marginTop: '1rem' }}>Back to Products</Link>
        </div>
    );

    return (
        <div className="section animate-fade" style={{ paddingTop: '100px', minHeight: '100vh' }}>
            <div className="container">
                <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--text-muted)', marginBottom: '2rem', fontWeight: 500 }}>
                    <ArrowLeft size={18} /> Back to Products
                </Link>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }} className="mobile-stack">
                    {/* Image Column */}
                    <div style={{ position: 'sticky', top: '100px' }}>
                        <div className="card" style={{ padding: '1rem', overflow: 'hidden', backgroundColor: 'white' }}>
                            <img 
                                src={product.imageUrl} 
                                alt={product.name} 
                                style={{ width: '100%', height: 'auto', borderRadius: '8px', boxShadow: 'var(--shadow)' }} 
                            />
                        </div>
                        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <div style={{ textAlign: 'center', flex: 1 }}>
                                <Shield color="var(--primary-accent)" size={32} />
                                <p style={{ fontSize: '0.8rem', fontWeight: 600, marginTop: '0.5rem' }}>Authentic Product</p>
                            </div>
                            <div style={{ textAlign: 'center', flex: 1 }}>
                                <Package color="var(--primary-accent)" size={32} />
                                <p style={{ fontSize: '0.8rem', fontWeight: 600, marginTop: '0.5rem' }}>Professional Setup</p>
                            </div>
                            <div style={{ textAlign: 'center', flex: 1 }}>
                                <Shield color="var(--primary-accent)" size={32} />
                                <p style={{ fontSize: '0.8rem', fontWeight: 600, marginTop: '0.5rem' }}>Full Warranty</p>
                            </div>
                        </div>
                    </div>

                    {/* Content Column */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <span style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary-accent)', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
                                {product.category}
                            </span>
                        </div>
                        <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>{product.name}</h1>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
                            {product.description}
                        </p>

                        <div style={{ marginBottom: '2.5rem' }}>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Info size={20} color="var(--primary-accent)" /> Key Features
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                {product.features?.map((feature, idx) => (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem', color: 'var(--text-main)' }}>
                                        <CheckCircle size={18} color="var(--primary-accent)" /> {feature}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card glass" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Technical Specifications</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.5rem' }}>
                                        <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{key}</span>
                                        <span style={{ fontWeight: 500 }}>{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <a 
                                href={`https://wa.me/9779705451066?text=${encodeURIComponent(`Hello S.K Trade, I am interested in ${product.name}. Can you provide more details?`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary" 
                                style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', flex: 1, justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                <MessageCircle size={20} /> Enquire via WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
