import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Truck, CheckCircle, Clock, ChevronRight, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/myorders`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(response.data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
            <div className="loader"></div>
        </div>
    );

    return (
        <div className="section animate-fade" style={{ paddingTop: '120px', minHeight: '100vh', backgroundColor: 'var(--background)' }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                <header style={{ marginBottom: '4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary-accent)', marginBottom: '0.5rem' }}>
                        <Clock size={20} />
                        <span style={{ fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.8rem' }}>Order Timeline</span>
                    </div>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-1.5px' }}>Purchase History</h1>
                </header>

                {orders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '5rem 0' }}>
                        <ShoppingBag size={64} color="var(--glass-border)" style={{ marginBottom: '1.5rem' }} />
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No orders yet</h3>
                        <p style={{ color: 'var(--text-muted)' }}>When you place orders, they will appear here with tracking updates.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {orders.map((order) => (
                            <motion.div 
                                key={order._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="card glass-dark" 
                                style={{ padding: '2rem', borderRadius: '2rem' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, marginBottom: '0.5rem' }}>ORDER #{(order._id || '').slice(-8).toUpperCase()}</div>
                                        <div style={{ fontSize: '1rem', color: 'white', fontWeight: 600 }}>{new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, marginBottom: '0.5rem' }}>VALUATION</div>
                                        <div style={{ fontSize: '1.25rem', color: 'var(--primary-accent)', fontWeight: 900 }}>रू {order.totalPrice?.toLocaleString()}</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem', overflowX: 'auto', paddingBottom: '1rem' }}>
                                    {order.items.map((item, idx) => (
                                        <div key={idx} style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '15px', border: '1px solid var(--glass-border)' }}>
                                            <div style={{ width: '60px', height: '60px', background: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px' }}>
                                                <img src={item.product?.imageUrl} alt={item.product?.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.9rem', fontWeight: 700, maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.product?.name}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Quantity: {item.quantity}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '1.25rem 2rem', borderRadius: '1.5rem', border: '1px solid var(--glass-border)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        {getStatusIcon(order.status)}
                                        <span style={{ fontWeight: 800, color: getStatusColor(order.status), letterSpacing: '1px' }}>{order.status.toUpperCase()}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        <Truck size={16} /> Estimated Delivery: Within 3-5 Business Days
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const getStatusIcon = (status) => {
    switch (status) {
        case 'Delivered': return <CheckCircle size={20} color="#10b981" />;
        case 'Shipped': return <Truck size={20} color="#3b82f6" />;
        default: return <Clock size={20} color="#f59e0b" />;
    }
};

const getStatusColor = (status) => {
    switch (status) {
        case 'Delivered': return '#10b981';
        case 'Shipped': return '#3b82f6';
        case 'Cancelled': return '#ef4444';
        default: return '#f59e0b';
    }
};

export default MyOrders;
