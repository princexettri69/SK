import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Info, Shield, MessageCircle, ShoppingCart, Plus, Minus, CheckCircle2 } from 'lucide-react';
import { useCart } from '../components/CartContext';
import { motion } from 'framer-motion';
import { resolveImageUrl } from '../utils/resolveImage';
import toast from 'react-hot-toast';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
                if (!response.ok) throw new Error('Product not found');
                const data = await response.json();
                setProduct(data);
                if (data.variants && data.variants.length > 0) {
                    setSelectedVariant(data.variants[0]);
                }
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Could not load product details.');
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (product.variants && product.variants.length > 0 && !selectedVariant) {
            toast.error('Please select a variant');
            return;
        }
        
        const itemToAdd = {
            ...product,
            price: selectedVariant ? selectedVariant.price : product.price,
            selectedVariant: selectedVariant
        };
        
        addToCart(itemToAdd, quantity);
        toast.success(`${quantity} ${product.name}${selectedVariant ? ` (${selectedVariant.size})` : ''} added to cart`, {
            icon: <ShoppingCart size={20} color="#3b82f6" />,
            duration: 3000
        });
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
            <div className="loader"></div>
        </div>
    );
    
    if (error || !product) return (
        <div className="container" style={{ paddingTop: '150px', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '2rem' }}>{error || 'Asset not found in registry.'}</h2>
            <Link to="/products" className="btn btn-primary">Back to Catalog</Link>
        </div>
    );

    return (
        <div className="section animate-fade" style={{ paddingTop: '120px', minHeight: '100vh', background: 'var(--background)' }}>
            <div className="container">
                <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'var(--text-muted)', marginBottom: '3rem', fontWeight: 600, transition: '0.3s' }}>
                    <ArrowLeft size={18} /> BACK TO CATALOG
                </Link>

                <div className="grid grid-2 mobile-stack" style={{ alignItems: 'start', gap: '3rem' }}>
                    {/* Image Perspective */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="sticky-desktop"
                    >
                        <div className="card glass-dark" style={{ padding: '2rem', borderRadius: '2.5rem', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '500px' }}>
                            <img 
                                src={resolveImageUrl(product.imageUrl)} 
                                alt={product.name} 
                                style={{ width: '100%', maxHeight: '450px', objectFit: 'contain' }} 
                            />
                        </div>
                    </motion.div>

                    {/* Information Cluster */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <span style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary-accent)', padding: '0.4rem 1.25rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                {product.category}
                            </span>
                        </div>
                        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-1.5px', color: 'white', lineHeight: '1.1' }}>{product.name}</h1>
                        
                        <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
                            {product.isCatalogOnly ? (
                                <span style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-muted)' }}>
                                    In-Store / Request Quote
                                </span>
                            ) : (
                                <>
                                    <span style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--primary-accent)' }}>
                                        रू {selectedVariant ? selectedVariant.price.toLocaleString() : product.price?.toLocaleString()}
                                    </span>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '1px' }}>
                                        NPR (INC. TAXES) {selectedVariant && selectedVariant.unit ? ` / ${selectedVariant.unit}` : ''}
                                    </span>
                                </>
                            )}
                        </div>

                        <p style={{ fontSize: '1.15rem', lineHeight: '1.8', color: 'var(--text-muted)', marginBottom: '3rem' }}>
                            {product.description}
                        </p>

                        {/* Order Configuration */}
                        {!product.isCatalogOnly ? (
                            <div className="card glass-dark" style={{ padding: '2rem', borderRadius: '2rem', marginBottom: '3rem', border: '1px solid var(--glass-border)' }}>
                                <h4 style={{ marginBottom: '1.5rem', fontWeight: 800, fontSize: '0.9rem', color: 'white', textTransform: 'uppercase', letterSpacing: '1px' }}>Configuration</h4>
                                
                                {product.variants && product.variants.length > 0 && (
                                    <div style={{ marginBottom: '2rem' }}>
                                        <h5 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Select Size</h5>
                                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                            {product.variants.map((variant, idx) => (
                                                <button 
                                                    key={idx}
                                                    onClick={() => setSelectedVariant(variant)}
                                                    style={{
                                                        padding: '0.75rem 1.5rem',
                                                        borderRadius: '12px',
                                                        background: selectedVariant === variant ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.05)',
                                                        border: `1px solid ${selectedVariant === variant ? '#3b82f6' : 'var(--glass-border)'}`,
                                                        color: selectedVariant === variant ? '#3b82f6' : 'white',
                                                        fontWeight: 700,
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s'
                                                    }}
                                                >
                                                    {variant.size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.75rem 1.5rem', borderRadius: '15px', border: '1px solid var(--glass-border)' }}>
                                        <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><Minus size={20} /></button>
                                        <span style={{ fontWeight: 900, fontSize: '1.25rem', width: '30px', textAlign: 'center' }}>{quantity}</span>
                                        <button onClick={() => setQuantity(q => q + 1)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><Plus size={20} /></button>
                                    </div>
                                    
                                    <div style={{ flex: 1, display: 'flex', gap: '1rem' }}>
                                        <button 
                                            onClick={handleAddToCart}
                                            className="btn btn-primary" 
                                            style={{ flex: 1, padding: '1.25rem', borderRadius: '15px', fontWeight: 800, fontSize: '1.1rem', gap: '0.75rem' }}
                                        >
                                            <ShoppingCart size={22} /> Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="card glass-dark" style={{ padding: '2rem', borderRadius: '2rem', marginBottom: '3rem', border: '1px solid var(--glass-border)', textAlign: 'center' }}>
                                <h4 style={{ marginBottom: '1rem', fontWeight: 800, fontSize: '1.2rem', color: 'white' }}>In-Store Catalog Item</h4>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                                    This item is available for bulk and custom orders directly through our experience center. Please contact our support team for a detailed quote.
                                </p>
                            </div>
                        )}

                        {product.features && product.features.length > 0 && (
                            <div style={{ marginBottom: '3rem' }}>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 800 }}>
                                    <Info size={22} color="var(--primary-accent)" /> Technical Highlights
                                </h3>
                                <div className="grid grid-2" style={{ gap: '1.25rem' }}>
                                    {product.features.map((feature, idx) => (
                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem', color: 'white', fontWeight: 500 }}>
                                            <CheckCircle2 size={18} color="#10b981" /> {feature}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {product.specifications && Object.keys(product.specifications).length > 0 && (
                            <div className="card glass-dark" style={{ padding: '2.5rem', borderRadius: '2.5rem', marginBottom: '3rem' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>Technical Datasheet</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    {Object.entries(product.specifications).map(([key, value]) => (
                                        <div key={key} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem' }}>
                                            <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{key}</span>
                                            <span style={{ fontWeight: 700, color: 'white' }}>{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <a 
                                href={`https://wa.me/9779705451066?text=${encodeURIComponent(`Hello S.K Trade And Suppliers, I am interested in ${product.name}. Can you provide more details?`)}`}
                                target="_blank" rel="noopener noreferrer"
                                className="btn btn-outline" 
                                style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '0.75rem', borderRadius: '15px', color: '#25D366', borderColor: '#25D366' }}
                            >
                                <MessageCircle size={22} /> Enquire via WhatsApp
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
