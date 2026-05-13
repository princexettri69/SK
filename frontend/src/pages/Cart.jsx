import React from 'react';
import { useCart } from '../components/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
    const navigate = useNavigate();

    if (cart.length === 0) {
        return (
            <div className="section animate-fade" style={{ paddingTop: '120px', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ marginBottom: '2rem' }}>
                        <ShoppingCart size={80} color="var(--primary-accent)" style={{ opacity: 0.5 }} />
                    </motion.div>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Your cart is empty</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Looks like you haven't added any premium assets to your collection yet.</p>
                    <Link to="/products" className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
                        Browse Products <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="section animate-fade" style={{ paddingTop: '120px', minHeight: '100vh', backgroundColor: 'var(--background)' }}>
            <div className="container">
                <header style={{ marginBottom: '4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary-accent)', marginBottom: '0.5rem' }}>
                        <ShoppingBag size={20} />
                        <span style={{ fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.8rem' }}>Procurement</span>
                    </div>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-1.5px' }}>Shopping Cart</h1>
                </header>

                <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
                    {/* Cart Items */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <AnimatePresence>
                            {cart.map((item) => (
                                <motion.div 
                                    key={item._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="card glass-dark" 
                                    style={{ padding: '1.5rem', display: 'flex', gap: '2rem', alignItems: 'center', borderRadius: '1.5rem' }}
                                >
                                    <div style={{ width: '120px', height: '120px', background: 'white', borderRadius: '1rem', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <img src={item.imageUrl} alt={item.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                    </div>
                                    
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{item.name}</h3>
                                            <button 
                                                onClick={() => removeFromCart(item._id)}
                                                style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem' }}
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>{item.category}</p>
                                        
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                                                <button 
                                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                    style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span style={{ fontWeight: 800, width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                                                <button 
                                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                    style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--primary-accent)' }}>
                                                    रू {(item.price * item.quantity).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Summary */}
                    <div>
                        <div className="card glass-dark" style={{ padding: '2.5rem', borderRadius: '2rem', position: 'sticky', top: '120px' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>Order Summary</h3>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                                    <span>Subtotal</span>
                                    <span>रू {getCartTotal().toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                                    <span>Shipping</span>
                                    <span style={{ color: '#10b981', fontWeight: 700 }}>FREE</span>
                                </div>
                                <div style={{ height: '1px', background: 'var(--glass-border)', margin: '0.5rem 0' }}></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: 900 }}>
                                    <span>Total</span>
                                    <span style={{ color: 'var(--primary-accent)' }}>रू {getCartTotal().toLocaleString()}</span>
                                </div>
                            </div>

                            <button 
                                onClick={() => navigate('/checkout')}
                                className="btn btn-primary" 
                                style={{ width: '100%', padding: '1.25rem', borderRadius: '15px', fontSize: '1.1rem', fontWeight: 800, gap: '0.75rem' }}
                            >
                                Secure Checkout <ArrowRight size={20} />
                            </button>
                            
                            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1.5rem' }}>
                                Guaranteed safe & secure checkout.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
