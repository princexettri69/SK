import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import skLogo from '../assets/sk-logo.png';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#0f172a',
      color: 'white',
      padding: '4rem 2rem 2rem 2rem',
      marginTop: 'auto'
    }}>
      <div className="container grid grid-cols-3">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <img src={skLogo} alt="S.K Trade Logo" style={{ height: '50px', width: 'auto' }} />
            <span style={{ fontFamily: 'Outfit', fontSize: '1.5rem', fontWeight: 700 }}>S.K Trade And Suppliers</span>
          </div>
          <p style={{ color: 'var(--secondary)', marginBottom: '1.5rem' }}>
            Your one-stop destination for fully functional interior decorations, hardware, and premium materials.
          </p>
        </div>

        <div>
          <h3 style={{ marginBottom: '1.5rem', color: 'white' }}>Quick Links</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li><Link to="/" style={linkStyle}>Home</Link></li>
            <li><Link to="/products" style={linkStyle}>Our Products</Link></li>
            <li><a href="#facilities" style={linkStyle}>Facilities</a></li>
            <li><a href="#about" style={linkStyle}>About Us</a></li>
          </ul>
        </div>

        <div>
          <h3 style={{ marginBottom: '1.5rem', color: 'white' }} id="contact">Contact Us</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={contactItemStyle}>
              <MapPin size={20} color="var(--primary-accent)" />
              <span>Itahari-6 Dharan Line, Nepal</span>
            </div>
            <div style={contactItemStyle}>
              <Phone size={20} color="var(--primary-accent)" />
              <span>+977 9910425484, 9746859847</span>
            </div>
            <div style={contactItemStyle}>
              <Mail size={20} color="var(--primary-accent)" />
              <span>info@sktrade.com.np</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        textAlign: 'center',
        paddingTop: '2rem',
        marginTop: '2rem',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        color: 'var(--secondary)'
      }}>
        <p>&copy; {new Date().getFullYear()} S.K Trade And Suppliers. All rights reserved.</p>
      </div>
    </footer>
  );
};

const linkStyle = {
  color: 'var(--secondary)',
  textDecoration: 'none',
  transition: 'color 0.3s ease'
};

const contactItemStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '1rem',
  color: 'var(--secondary)'
};

export default Footer;
