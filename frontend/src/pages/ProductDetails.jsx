import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Info, Package, Shield, MessageCircle } from 'lucide-react';

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
            price: 24500,
            specifications: {
                'Storage Capacity': '9 L',
                'Maximum Duty Cycle': '100 L/day',
                'Power Consumption': '60 W',
                'Mounting': 'Wall Mounting'
            }
        },
        {
            _id: '10',
            name: 'CG CGCT90MAX CHIMNEY',
            category: 'Kitchen Appliances',
            description: 'Advanced filterless chimney with heat auto clean and gesture control for a hassle-free cooking experience.',
            features: ['Filterless Tech', 'Heat Clean', 'Gesture Control', 'High Suction'],
            imageUrl: '/images/products/cg-cgct90max.jpg',
            price: 15990,
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

                <div className="grid grid-2" style={{ alignItems: 'start' }}>
                    {/* Image Column */}
                    <div className="sticky-desktop">
                        <div className="card" style={{ padding: '1rem', overflow: 'hidden', backgroundColor: 'white' }}>
                            <img 
                                src={product.imageUrl} 
                                alt={product.name} 
                                style={{ width: '100%', height: 'auto', borderRadius: '8px', boxShadow: 'var(--shadow)' }} 
                            />
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
                        
                        <div style={{ marginBottom: '1.5rem' }}>
                            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary-accent)' }}>
                                रू {product.price?.toLocaleString() || 'N/A'} <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>(NPR)</span>
                            </span>
                        </div>

                        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
                            {product.description}
                        </p>

                        <div style={{ marginBottom: '2.5rem' }}>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Info size={20} color="var(--primary-accent)" /> Key Features
                            </h3>
                            <div className="grid grid-2" style={{ gap: '1rem' }}>
                                {product.features?.map((feature, idx) => (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem', color: 'var(--text-main)' }}>
                                        <Shield size={18} color="var(--primary-accent)" /> {feature}
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
