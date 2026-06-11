import React, { useState } from 'react';
import { useCart } from '../components/CartContext';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ShieldCheck, MapPin, Phone, CreditCard, Lock, ArrowRight, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const Checkout = () => {
    const { cart, getCartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [shippingAddress, setShippingAddress] = useState({
        address: '',
        city: '',
        phone: ''
    });

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please login to place an order');
            return navigate('/login');
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const orderData = {
                items: cart.map(item => ({
                    product: item._id,
                    quantity: item.quantity,
                    price: item.price,
                    variant: item.selectedVariant ? { size: item.selectedVariant.size, unit: item.selectedVariant.unit } : undefined
                })),
                shippingAddress,
                totalPrice: getCartTotal()
            };

            await axios.post(`${import.meta.env.VITE_API_URL}/api/orders`, orderData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success('Order placed successfully!');
            clearCart();
            navigate('/my-orders');
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="section animate-fade" style={{ paddingTop: '120px', minHeight: '100vh', backgroundColor: 'var(--background)' }}>
            <div className="container" style={{ maxWidth: '1000px' }}>
                <button onClick={() => navigate('/cart')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '2rem', fontWeight: 600 }}>
                    <ChevronLeft size={20} /> Back to Cart
                </button>

                <header style={{ marginBottom: '3rem', textAlign: window.innerWidth <= 768 ? 'center' : 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: window.innerWidth <= 768 ? 'center' : 'flex-start', gap: '0.75rem', color: '#10b981', marginBottom: '0.5rem' }}>
                        <ShieldCheck size={20} />
                        <span style={{ fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.8rem' }}>Secure Transaction</span>
                    </div>
                    <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 3rem)', fontWeight: 900, letterSpacing: '-1px' }}>Finalize Order</h1>
                </header>

                <div className="mobile-stack" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3rem' }}>
                    {/* Shipping Form */}
                    <div>
                        <div className="card glass-dark" style={{ padding: 'clamp(1.5rem, 5vw, 2.5rem)', borderRadius: '2rem' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <MapPin size={24} color="var(--primary-accent)" /> Shipping Intelligence
                            </h3>
                            <form onSubmit={handlePlaceOrder} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <CheckoutInput 
                                    label="Complete Street Address" 
                                    value={shippingAddress.address} 
                                    onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})} 
                                    placeholder="House no., Street, Ward" 
                                    required 
                                />
                                <div className="grid grid-2" style={{ gap: '1.5rem' }}>
                                    <CheckoutInput 
                                        label="City / Region" 
                                        value={shippingAddress.city} 
                                        onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})} 
                                        placeholder="Itahari, Sunsari" 
                                        required 
                                    />
                                    <CheckoutInput 
                                        label="Contact Number" 
                                        value={shippingAddress.phone} 
                                        onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})} 
                                        placeholder="+977 98..." 
                                        required 
                                    />
                                </div>

                                <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '15px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                        <CreditCard size={20} color="var(--primary-accent)" />
                                        <h4 style={{ fontWeight: 700 }}>Payment Method</h4>
                                    </div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Cash on Delivery (Pay when you receive your premium products).</p>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="btn btn-primary" 
                                    style={{ padding: '1.25rem', marginTop: '1.5rem', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 800, justifyContent: 'center' }}
                                >
                                    {loading ? 'Processing...' : 'Place Secure Order'} <ArrowRight size={20} />
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div>
                        <div className="card glass-dark" style={{ padding: '2rem', borderRadius: '2rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>Review Items</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                                {cart.map(item => (
                                    <div key={item._id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <div style={{ width: '50px', height: '50px', background: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}>
                                            <img src={resolveImageUrl(item.imageUrl)} alt={item.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                        </div>
                                        <div style={{ flex: 1, overflow: 'hidden' }}>
                                            <div style={{ fontSize: '0.9rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {item.name} {item.selectedVariant && <span style={{ color: '#3b82f6', fontSize: '0.8rem' }}>({item.selectedVariant.size})</span>}
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Qty: {item.quantity}</div>
                                        </div>
                                        <div style={{ fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>रू {(item.price * item.quantity).toLocaleString()}</div>
                                    </div>
                                ))}
                            </div>
                            
                            <div style={{ height: '1px', background: 'var(--glass-border)', marginBottom: '1.5rem' }}></div>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 900, flexWrap: 'wrap', gap: '0.5rem' }}>
                                <span>Total NPR</span>
                                <span style={{ color: 'var(--primary-accent)' }}>{getCartTotal().toLocaleString()}</span>
                            </div>

                            <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.75rem', fontWeight: 700 }}>
                                <Lock size={14} /> 256-BIT SSL ENCRYPTION
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CheckoutInput = ({ label, ...props }) => (
    <div style={{ width: '100%' }}>
        <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>{label}</label>
        <input 
            {...props} 
            style={{ 
                width: '100%', padding: '1rem', borderRadius: '12px', background: 'rgba(15, 23, 42, 0.6)', 
                border: '1px solid var(--glass-border)', color: 'white', outline: 'none', transition: 'all 0.3s'
            }} 
        />
    </div>
);

export default Checkout;
