import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, LogIn, ShoppingCart, Clock } from 'lucide-react';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
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
    <nav className={`${scrolled ? 'scrolled' : ''} glass`} style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 2rem',
      height: '80px',
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 1000,
      boxSizing: 'border-box'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', zIndex: 1001 }}>
        <img src="/sk-logo.png" alt="S.K Trade And Suppliers Logo" className="brand-logo" style={{ height: '60px', width: 'auto' }} />
        <Link to="/" className="brand-text" style={{ 
          textDecoration: 'none', 
          color: 'var(--text-main)', 
          fontFamily: 'Outfit', 
          fontSize: '1.5rem', 
          fontWeight: 700 
        }} onClick={closeMenu}>
          S.K Trade And Suppliers
        </Link>
      </div>

      {/* Desktop Menu */}
      <div style={{ display: 'flex', gap: '1.75rem', alignItems: 'center' }} className="nav-links desktop-only">
        <NavLink to="/" current={location.pathname === '/'}>Home</NavLink>
        <NavLink to="/about" current={location.pathname === '/about'}>About</NavLink>
        <NavLink to="/products" current={location.pathname === '/products'}>Products</NavLink>
        {user?.role === 'admin' && <NavLink to="/admin" current={location.pathname === '/admin'}>Admin</NavLink>}
        
        <Link to="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center', color: location.pathname === '/cart' ? 'var(--primary-accent)' : 'var(--text-main)' }}>
          <ShoppingCart size={22} />
          {getCartCount() > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{
                position: 'absolute', top: '-8px', right: '-10px', backgroundColor: 'var(--primary-accent)',
                color: 'white', fontSize: '0.65rem', fontWeight: 900, borderRadius: '50%',
                width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid var(--background)'
              }}
            >
              {getCartCount()}
            </motion.span>
          )}
        </Link>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginLeft: '0.5rem' }}>
            <Link to="/my-orders" style={{ color: location.pathname === '/my-orders' ? 'var(--primary-accent)' : 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>
              <Clock size={16} /> Orders
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)', fontWeight: 600, fontSize: '0.9rem' }}>
              <User size={16} />
              <span>{user.name.split(' ')[0]}</span>
            </div>
            <button onClick={handleLogout} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
              Logout
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '0.5rem' }}>
            <Link to="/login" style={linkStyle(location.pathname === '/login')}>Login</Link>
            <Link to="/signup" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              Sign Up
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', zIndex: 1001 }}>
        <Link to="/cart" className="show-mobile" style={{ position: 'relative', color: 'var(--text-main)' }}>
          <ShoppingCart size={24} />
          {getCartCount() > 0 && (
            <span style={{
                position: 'absolute', top: '-8px', right: '-10px', backgroundColor: 'var(--primary-accent)',
                color: 'white', fontSize: '0.65rem', fontWeight: 900, borderRadius: '50%',
                width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid var(--background)'
            }}>
              {getCartCount()}
            </span>
          )}
        </Link>
        <div className="mobile-toggle" style={{ cursor: 'pointer', color: 'var(--text-main)' }} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </div>
      </div>

      {/* Mobile Menu Popup Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={closeMenu}
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(2, 6, 23, 0.95)', backdropFilter: 'blur(12px)', zIndex: 1000 }}
            />
            
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                position: 'fixed', top: 0, right: 0, width: '80%', maxWidth: '350px', height: '100vh', 
                background: 'var(--card-bg)', backdropFilter: 'blur(20px)', borderLeft: '1px solid var(--glass-border)',
                padding: '5rem 2rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', zIndex: 1001,
                boxShadow: '-10px 0 50px rgba(0,0,0,0.5)'
              }}
            >
              <button onClick={closeMenu} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}>
                <X size={32} />
              </button>

              <Link to="/" style={mobileLinkStyle(location.pathname === '/')} onClick={closeMenu}>Home</Link>
              <Link to="/about" style={mobileLinkStyle(location.pathname === '/about')} onClick={closeMenu}>About Us</Link>
              <Link to="/products" style={mobileLinkStyle(location.pathname === '/products')} onClick={closeMenu}>Products Catalog</Link>
              {user && <Link to="/my-orders" style={mobileLinkStyle(location.pathname === '/my-orders')} onClick={closeMenu}>My Orders</Link>}
              {user?.role === 'admin' && <Link to="/admin" style={mobileLinkStyle(location.pathname === '/admin')} onClick={closeMenu}>Admin Control Panel</Link>}
              
              <div style={{ height: '1px', background: 'var(--glass-border)', margin: '1rem 0' }}></div>

              {user ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-main)' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{user.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.role}</div>
                    </div>
                  </div>
                  <button onClick={handleLogout} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <Link to="/login" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }} onClick={closeMenu}>Login</Link>
                  <Link to="/signup" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={closeMenu}>Sign Up</Link>
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
  fontWeight: current ? 700 : 500,
  transition: 'all 0.3s ease',
  fontFamily: 'Inter, sans-serif',
  fontSize: '0.95rem'
});

const mobileLinkStyle = (current) => ({
  textDecoration: 'none',
  color: current ? 'var(--primary-accent)' : 'var(--text-main)',
  fontWeight: 700,
  padding: '1rem',
  borderRadius: '12px',
  background: current ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
  fontSize: '1.1rem',
  transition: 'all 0.2s'
});

export default Navbar;
