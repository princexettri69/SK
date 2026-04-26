import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2 } from 'lucide-react';
import skLogo from '../assets/sk-logo.png';
import authBg from '../assets/auth-bg.jpg';
import toast from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await login(email, password);
            toast.success('Successfully logged in!');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed. Please check your credentials.');
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
            >
                <div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <img src={skLogo} alt="S.K Trade Logo" style={{ height: '100px', width: 'auto', marginBottom: '1.5rem' }} />
                    </div>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">
                        Welcome Back
                    </h2>
                    <p className="text-center text-sm text-gray-600 mt-2">
                        Enter your credentials to access your account
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
                                placeholder="name@company.com"
                            />
                            <Mail size={18} className="auth-icon" />
                        </div>
                    </div>

                    <div className="auth-input-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <label className="text-sm font-semibold text-gray-700">Password</label>
                            <a href="#" className="text-sm font-medium text-indigo-600 hover:underline">Forgot?</a>
                        </div>
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

                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <input id="remember-me" type="checkbox" style={{ marginRight: '0.75rem', width: '1rem', height: '1rem' }} />
                        <label htmlFor="remember-me" className="text-sm text-gray-600">Keep me signed in</label>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="auth-button"
                    >
                        {isSubmitting ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>Sign In</>
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    New to S.K Trade? <Link to="/signup" className="auth-link">Create an account</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
