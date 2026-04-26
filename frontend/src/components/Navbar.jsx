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
        <img src="/sk-logo.png" alt="S.K Trade Logo" style={{ height: '60px', width: 'auto' }} />
        <Link to="/" style={{ 
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

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.98))',
              backdropFilter: 'blur(15px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2.5rem',
              zIndex: 1000,
              fontSize: '1.5rem',
              fontWeight: 600,
              fontFamily: 'Outfit'
            }}
          >
            <div style={{ position: 'absolute', top: '2rem', right: '2rem' }} onClick={closeMenu}>
              <X size={32} color="white" />
            </div>

            <Link to="/" style={linkStyle(location.pathname === '/')} onClick={closeMenu}>Home</Link>
            <Link to="/about" style={linkStyle(location.pathname === '/about')} onClick={closeMenu}>About Us</Link>
            <Link to="/products" style={linkStyle(location.pathname === '/products')} onClick={closeMenu}>Products</Link>
            
            <div style={{ width: '60px', height: '2px', background: 'rgba(255,255,255,0.1)', margin: '0.5rem 0' }}></div>

            {user ? (
              <>
                <div style={{ color: 'var(--text-main)', fontSize: '1.1rem' }}>Hello, {user.name.split(' ')[0]}</div>
                <button 
                  onClick={handleLogout}
                  className="btn btn-primary"
                  style={{ width: '220px', justifyContent: 'center' }}
                >
                  <LogOut size={18} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={linkStyle(location.pathname === '/login')} onClick={closeMenu}>Login</Link>
                <Link to="/signup" className="btn btn-primary" style={{ width: '220px', justifyContent: 'center' }} onClick={closeMenu}>
                  <LogIn size={18} /> Sign Up
                </Link>
              </>
            )}
          </motion.div>
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
