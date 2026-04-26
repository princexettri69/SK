import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, LogIn } from 'lucide-react';
import { useAuth } from './AuthContext';
import skLogo from '../assets/sk-logo.png';

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
        <img src={skLogo} alt="S.K Trade Logo" style={{ height: '60px', width: 'auto' }} />
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

      {/* Mobile Menu */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'var(--background)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2rem',
          zIndex: 1000,
          fontSize: '1.25rem'
        }}>
          <Link to="/" style={linkStyle(location.pathname === '/')} onClick={closeMenu}>Home</Link>
          <Link to="/about" style={linkStyle(location.pathname === '/about')} onClick={closeMenu}>About Us</Link>
          <Link to="/products" style={linkStyle(location.pathname === '/products')} onClick={closeMenu}>Products</Link>
          
          {user ? (
            <>
              <div style={{ color: 'var(--text-main)', fontWeight: 600 }}>Hello, {user.name}</div>
              <button 
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{ width: '200px' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={linkStyle(location.pathname === '/login')} onClick={closeMenu}>Login</Link>
              <Link to="/signup" className="btn btn-primary" style={{ width: '200px', textAlign: 'center' }} onClick={closeMenu}>Sign Up</Link>
            </>
          )}
          <a href="#contact" className="btn btn-outline" onClick={closeMenu}>Contact Us</a>
        </div>
      )}
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
