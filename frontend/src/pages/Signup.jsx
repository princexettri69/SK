import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Loader2 } from 'lucide-react';
import skLogo from '../assets/sk-logo.png';
import authBg from '../assets/auth-bg.jpg';
import toast from 'react-hot-toast';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            return toast.error('Passwords do not match');
        }

        if (password.length < 8) {
            return toast.error('Password must be at least 8 characters long');
        }

        setIsSubmitting(true);
        try {
            await register({ name, email, password });
            toast.success('Account created successfully!');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-gradient min-h-screen" style={{ backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.7)), url(${authBg})` }}>
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="auth-card"
                style={{ maxWidth: '500px' }}
            >
                <div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <img src={skLogo} alt="S.K Trade Logo" style={{ height: '100px', width: 'auto', marginBottom: '1.5rem' }} />
                    </div>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">
                        Create Account
                    </h2>
                    <p className="text-center text-sm text-gray-600 mt-2">
                        Enter your details to create a new account
                    </p>
                </div>

                <form className="mt-8" onSubmit={handleSubmit}>
                    <div className="auth-input-group">
                        <label className="text-sm font-semibold text-gray-700">Full Name</label>
                        <div className="auth-input-wrapper">
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="auth-input"
                                placeholder="John Doe"
                            />
                            <User size={18} className="auth-icon" />
                        </div>
                    </div>

                    <div className="auth-input-group">
                        <label className="text-sm font-semibold text-gray-700">Email Address</label>
                        <div className="auth-input-wrapper">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="auth-input"
                                placeholder="name@company.com"
                            />
                            <Mail size={18} className="auth-icon" />
                        </div>
                    </div>

                    <div className="grid-cols-2">
                        <div className="auth-input-group">
                            <label className="text-sm font-semibold text-gray-700">Password</label>
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
                            <label className="text-sm font-semibold text-gray-700">Confirm</label>
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
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                        <input id="terms" type="checkbox" required style={{ marginTop: '0.25rem', marginRight: '0.75rem', width: '1rem', height: '1rem' }} />
                        <label htmlFor="terms" className="text-sm text-gray-600">
                            I agree to the <a href="#" className="auth-link">Terms</a> and <a href="#" className="auth-link">Privacy Policy</a>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="auth-button"
                    >
                        {isSubmitting ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>Create Account</>
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account? <Link to="/login" className="auth-link">Sign in instead</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;
