import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, LogIn } from 'lucide-react';
import { useAuth } from './AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  return (
    <nav className={scrolled ? 'scrolled' : ''} style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 2rem',
      backgroundColor: scrolled ? 'var(--glass)' : 'transparent',
      backdropFilter: scrolled ? 'blur(10px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--glass-border)' : 'none',
      height: '80px',
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 1000,
      boxSizing: 'border-box'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', zIndex: 1001 }}>
        <img src="/sk-logo.png" alt="S.K Trade Logo" className="brand-logo" style={{ height: '60px', width: 'auto' }} />
        <Link to="/" className="brand-text" style={{ 
          textDecoration: 'none', 
          color: 'var(--text-main)', 
          fontFamily: 'Outfit', 
          fontSize: '1.5rem', 
          fontWeight: 700 
        }} onClick={closeMenu}>
          S.K Trade
        </Link>
      </div>

      {/* Desktop Menu */}
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }} className="nav-links desktop-only">
        <NavLink to="/" current={location.pathname === '/'}>Home</NavLink>
        <NavLink to="/about" current={location.pathname === '/about'}>About Us</NavLink>
        <NavLink to="/products" current={location.pathname === '/products'}>Our Products</NavLink>
        
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginLeft: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', fontWeight: 600 }}>
              <User size={18} />
              <span>{user.name.split(' ')[0]}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="btn btn-secondary" 
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '1rem' }}>
            <Link to="/login" style={linkStyle(location.pathname === '/login')}>Login</Link>
            <Link to="/signup" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LogIn size={16} />
              Sign Up
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Toggle */}
      <div className="mobile-toggle" style={{ zIndex: 1001, cursor: 'pointer' }} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </div>

      {/* Mobile Menu Popup Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(8px)',
                zIndex: 1000
              }}
            />
            
            {/* Popup Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              style={{
                position: 'fixed',
                top: '15%',
                left: '5%',
                right: '5%',
                background: 'rgba(30, 41, 59, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '2rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '3rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2rem',
                zIndex: 1001,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
              }}
            >
              <button 
                onClick={closeMenu}
                style={{ 
                  position: 'absolute', 
                  top: '1.5rem', 
                  right: '1.5rem',
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  padding: '0.5rem',
                  cursor: 'pointer',
                  color: 'white'
                }}
              >
                <X size={24} />
              </button>

              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <img src="/sk-logo.png" alt="S.K Trade" style={{ height: '50px', marginBottom: '1rem' }} />
                <div style={{ height: '2px', width: '40px', background: 'var(--primary-accent)', margin: '0 auto' }}></div>
              </div>

              <Link to="/" style={linkStyle(location.pathname === '/')} onClick={closeMenu}>Home</Link>
              <Link to="/about" style={linkStyle(location.pathname === '/about')} onClick={closeMenu}>About Us</Link>
              <Link to="/products" style={linkStyle(location.pathname === '/products')} onClick={closeMenu}>Products Catalog</Link>
              
              <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)', margin: '1rem 0' }}></div>

              {user ? (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Logged in as <span style={{ color: 'white', fontWeight: 600 }}>{user.name}</span></div>
                  <button 
                    onClick={handleLogout}
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center', borderRadius: '1rem' }}
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              ) : (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <Link to="/login" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', borderRadius: '1rem' }} onClick={closeMenu}>
                    Login
                  </Link>
                  <Link to="/signup" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', borderRadius: '1rem' }} onClick={closeMenu}>
                    <LogIn size={18} /> Sign Up
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

const NavLink = ({ to, current, children }) => (
  <Link to={to} style={linkStyle(current)}>
    {children}
  </Link>
);

const linkStyle = (current) => ({
  textDecoration: 'none',
  color: current ? 'var(--primary-accent)' : 'var(--text-main)',
  fontWeight: current ? 600 : 500,
  transition: 'color 0.3s ease',
  fontFamily: 'Inter, sans-serif'
});

export default Navbar;
