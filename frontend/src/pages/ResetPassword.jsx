import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Lock, Loader2, KeyRound } from 'lucide-react';
import skLogo from '../assets/sk-logo.png';
import authBg from '../assets/auth-bg.jpg';
import toast from 'react-hot-toast';

const ResetPassword = () => {
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return toast.error('Passwords do not match');
        }
        if (code.length !== 6) {
            return toast.error('Please enter the 6-digit code');
        }

        setIsSubmitting(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/resetPassword`, { code, password });
            toast.success('Password reset successful! You are now logged in.');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid code or expired.');
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
                        <img src={skLogo} alt="S.K Trade And Suppliers Logo" style={{ height: '80px', width: 'auto', marginBottom: '1.5rem' }} />
                    </div>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">
                        Reset Password
                    </h2>
                    <p className="text-center text-sm text-gray-600 mt-2">
                        Enter the 6-digit code sent to your email and your new password.
                    </p>
                </div>

                <form className="mt-8" onSubmit={handleSubmit}>
                    <div className="auth-input-group">
                        <label className="text-sm font-semibold text-gray-700">6-Digit Code</label>
                        <div className="auth-input-wrapper">
                            <input
                                type="text"
                                required
                                maxLength="6"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="auth-input"
                                placeholder="123456"
                                style={{ letterSpacing: '0.5rem', textAlign: 'center', fontWeight: 800, fontSize: '1.25rem' }}
                            />
                            <KeyRound size={18} className="auth-icon" />
                        </div>
                    </div>

                    <div className="auth-input-group">
                        <label className="text-sm font-semibold text-gray-700">New Password</label>
                        <div className="auth-input-wrapper">
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="auth-input"
                                placeholder="••••••••"
                            />
                            <Lock size={18} className="auth-icon" />
                        </div>
                    </div>

                    <div className="auth-input-group">
                        <label className="text-sm font-semibold text-gray-700">Confirm New Password</label>
                        <div className="auth-input-wrapper">
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="auth-input"
                                placeholder="••••••••"
                            />
                            <Lock size={18} className="auth-icon" />
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
                            <>Reset Password</>
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    Remembered your password? <Link to="/login" className="auth-link">Back to Login</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default ResetPassword;
