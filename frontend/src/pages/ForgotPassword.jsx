import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import skLogo from '../assets/sk-logo.png';
import authBg from '../assets/auth-bg.jpg';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/forgotPassword`, { email });
            toast.success('Reset code sent to your email!');
            navigate('/reset-password');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-gradient min-h-screen" style={{ backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.7)), url(${authBg})` }}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="auth-card"
            >
                <div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <img src={skLogo} alt="S.K Trade Logo" style={{ height: '80px', width: 'auto', marginBottom: '1.5rem' }} />
                    </div>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">
                        Forgot Password?
                    </h2>
                    <p className="text-center text-sm text-gray-600 mt-2">
                        Enter your email and we'll send you a 6-digit reset code.
                    </p>
                </div>

                <form className="mt-8" onSubmit={handleSubmit}>
                    <div className="auth-input-group">
                        <label className="text-sm font-semibold text-gray-700">Email Address</label>
                        <div className="auth-input-wrapper">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="auth-input"
                                placeholder="your@email.com"
                            />
                            <Mail size={18} className="auth-icon" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="auth-button"
                    >
                        {isSubmitting ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>Send Reset Code</>
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-accent)', textDecoration: 'none', fontWeight: 600 }}>
                        <ArrowLeft size={16} /> Back to Login
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
