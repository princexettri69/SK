import React, { useState, useEffect } from 'react';
import { ArrowRight, Wrench, PaintBucket, Home as HomeIcon, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import heroImage1 from '../assets/home-hero.jpg';
import heroImage2 from '../assets/home-gallery-1.jpg';
import heroImage3 from '../assets/home-gallery-2.avif';
import heroImage4 from '../assets/home-gallery-3.jpg';

const images = [heroImage1, heroImage2, heroImage3, heroImage4];

const Home = () => {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    document.title = "S.K Trade & Suppliers | Premium Hardware & Interior";
  }, []);

  useEffect(() => {
    let timer;
    if (isHovered) {
      timer = setInterval(() => {
        setIndex((prev) => (prev + 1) % images.length);
      }, 2000);
    }
    return () => clearInterval(timer);
  }, [isHovered]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    console.log("Contact form submitted:", data);
    import('react-hot-toast').then(({ toast }) => {
        toast.success("Message sent successfully! We'll get back to you soon.");
    });
    e.target.reset();
  };

  return (
    <div className="animate-fade">
      {/* Hero Section */}
      <section className="hero-gradient" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '80px', overflow: 'hidden' }}>
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        
        <div className="container content-wrapper" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div style={{ textAlign: 'left', zIndex: 10 }}>
            <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem', background: 'linear-gradient(to right, var(--primary), var(--primary-accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.1 }}>
              Transform Your Spaces
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '600px' }}>
              S.K Trade and Suppliers provides premium hardware, interior decor, kitchen appliances, and advanced water purification solutions.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link to="/products" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                Explore Products <ArrowRight size={20} />
              </Link>
              <Link to="/about" className="btn btn-outline" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                About Us
              </Link>
            </div>
          </div>

          <div 
            style={{ perspective: '1500px', zIndex: 10, position: 'relative', height: '450px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setIsHovered(false)}
          >
            <AnimatePresence mode="wait">
              <motion.div 
                key={index}
                initial={{ rotateY: 90, opacity: 0, scale: 0.9 }}
                animate={{ 
                    rotateY: 0,
                    opacity: 1,
                    scale: 1
                }}
                exit={{ rotateY: -90, opacity: 0, scale: 0.9 }}
                transition={{ 
                    duration: 0.8,
                    ease: "easeInOut"
                }}
                style={{ 
                  transformStyle: 'preserve-3d', 
                  width: '100%', 
                  position: 'absolute',
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                {/* Floating animation wrapper */}
                <motion.div
                  animate={{ 
                    rotateY: isHovered ? [-15, 15, -15] : [-5, 5, -5],
                    rotateX: isHovered ? [5, -5, 5] : [2, -2, 2],
                    y: isHovered ? [0, -20, 0] : [0, -10, 0],
                    scale: isHovered ? 1.05 : 1
                  }}
                  transition={{ 
                    duration: isHovered ? 4 : 6, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  style={{ width: '100%' }}
                >
                  <img 
                    src={images[index]} 
                    alt={`Modern Interior ${index + 1}`} 
                    style={{ 
                      width: '100%', 
                      borderRadius: '1.5rem', 
                      boxShadow: isHovered 
                        ? '0 60px 100px -30px rgba(0,0,0,0.9), 0px 0px 80px -10px rgba(96, 165, 250, 0.4)'
                        : '0 40px 80px -20px rgba(0,0,0,0.8), -30px 0px 60px -15px rgba(96, 165, 250, 0.3)',
                      border: isHovered ? '2px solid rgba(96, 165, 250, 0.5)' : '1px solid rgba(255,255,255,0.1)',
                      aspectRatio: '16/10',
                      objectFit: 'cover',
                      transition: 'all 0.5s ease'
                    }} 
                  />
                </motion.div>
              </motion.div>
            </AnimatePresence>
            
            {/* Hover progress bar indicator */}
            <div style={{ 
                position: 'absolute', 
                bottom: '-25px', 
                width: '100%',
                height: '4px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '2px',
                overflow: 'hidden',
                opacity: isHovered ? 1 : 0,
                transition: 'opacity 0.3s'
            }}>
                <AnimatePresence mode="popLayout">
                    {isHovered && (
                        <motion.div 
                            key={index}
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 2, ease: "linear" }}
                            style={{ 
                                height: '100%', 
                                backgroundColor: 'var(--primary-accent)',
                                boxShadow: '0 0 10px var(--primary-accent)'
                            }}
                        />
                    )}
                </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section id="facilities" className="section" style={{ backgroundColor: 'var(--background)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Why Choose Us?</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
              We don't just supply materials; we provide end-to-end facilities to ensure your interior decoration a complete success.
            </p>
          </div>

          <div className="grid grid-cols-3">
            <FacilityCard 
              icon={<HomeIcon size={40} color="var(--primary-accent)" />}
              title="Full Interior Setup"
              desc="Comprehensive interior decor materials, from wall paneling to lighting, all in one place."
            />
            <FacilityCard 
              icon={<Wrench size={40} color="var(--primary-accent)" />}
              title="Premium Hardware"
              desc="Durable, industrial-grade hardware and bathroom fittings sourced from top manufacturers."
            />
            <FacilityCard 
              icon={<ShieldCheck size={40} color="var(--primary-accent)" />}
              title="Trusted Appliances"
              desc="Authorized sellers of KENT purifiers and Elica kitchen appliances with assured warranty."
            />
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="section" style={{ backgroundColor: 'var(--card-bg)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
            <div>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Our Categories</h2>
              <p style={{ color: 'var(--text-muted)' }}>Diverse products for your home and office.</p>
            </div>
            <Link to="/products" className="btn btn-outline desktop-only">View All</Link>
          </div>

          <div className="grid grid-cols-3">
            {['Water Purifiers', 'Kitchen Appliances', 'Hardware'].map((category, index) => (
              <div key={index} className="card" style={{ padding: '2rem', textAlign: 'center', cursor: 'pointer' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>{category}</h3>
                <Link to={`/products?category=${category}`} style={{ color: 'var(--primary-accent)', textDecoration: 'none', fontWeight: 600 }}>
                  Browse Category &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Partner Ticker */}
      <section style={{ backgroundColor: '#0f172a', padding: '3rem 0', overflow: 'hidden', borderY: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container">
          <p style={{ textAlign: 'center', color: 'var(--primary-accent)', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '2rem' }}>
            Authorized Partner of World Class Brands
          </p>
          <div style={{ display: 'flex', gap: '4rem', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', opacity: 0.8 }}>
            {['CG Group', 'GLEN India', 'ELICA', 'KENT RO', 'Shikhar Ply'].map((brand) => (
              <span key={brand} style={{ color: 'white', fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Outfit', letterSpacing: '1px' }}>
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Product Diversity Section */}
      <section className="section" style={{ background: 'linear-gradient(to bottom, var(--background), #1e293b)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>1000+ Choices for <span style={{ color: 'var(--primary-accent)' }}>Your Dream Home</span></h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2rem' }}>
                From the structural elegance of <strong>Shikhar Ply</strong> and premium doors to the high-tech efficiency of <strong>KENT RO</strong> and <strong>Elica</strong> kitchen appliances. We bring you a curated collection of everything related to real estate interior.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={diversityCardStyle}>
                  <h4 style={{ color: 'white' }}>Interior Fittings</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Premium door hinges, handles, and modular fitting hardware.</p>
                </div>
                <div style={diversityCardStyle}>
                  <h4 style={{ color: 'white' }}>Formica & Surfaces</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Over 500+ textures and colors from top-tier brands.</p>
                </div>
                <div style={diversityCardStyle}>
                  <h4 style={{ color: 'white' }}>Kitchen Solutions</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Chimneys, stoves, and hobs from GLEN and Elica.</p>
                </div>
                <div style={diversityCardStyle}>
                  <h4 style={{ color: 'white' }}>Water Purification</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Authorized sales and service for KENT water purifiers.</p>
                </div>
              </div>
            </div>
            
            <div style={{ position: 'relative' }}>
                <div style={{ 
                    padding: '3rem', 
                    borderRadius: '2rem', 
                    backgroundColor: 'rgba(59, 130, 246, 0.1)', 
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    textAlign: 'center'
                }}>
                    <h1 style={{ fontSize: '5rem', color: 'var(--primary-accent)', marginBottom: '0' }}>1000+</h1>
                    <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>Product Varieties</p>
                    <hr style={{ margin: '1.5rem auto', width: '50px', borderColor: 'var(--primary-accent)' }} />
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Everything you need for your interior projects, under one roof.</p>
                </div>
                {/* Decorative blobs */}
                <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary-accent)', opacity: 0.2, filter: 'blur(20px)' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section" style={{ backgroundColor: 'var(--card-bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Get In Touch</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
              Have a project in mind? Contact us for expert advice and high-quality materials.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '4rem' }} className="mobile-stack">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={contactCardStyle}>
                    <HomeIcon size={24} color="var(--primary-accent)" />
                    <div>
                        <h4 style={{ marginBottom: '0.25rem' }}>Visit Our Store</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Dharan Line, Itahari - 6, Nepal</p>
                    </div>
                </div>
                <div style={contactCardStyle}>
                    <PaintBucket size={24} color="var(--primary-accent)" />
                    <div>
                        <h4 style={{ marginBottom: '0.25rem' }}>Call Us</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>+977 9810425484, 8746859847</p>
                    </div>
                </div>
                <div style={contactCardStyle}>
                    <ShieldCheck size={24} color="var(--primary-accent)" />
                    <div>
                        <h4 style={{ marginBottom: '0.25rem' }}>Email Us</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>info@sktrade.com.np</p>
                    </div>
                </div>
            </div>

          <div className="card glass" style={{ padding: '2.5rem' }}>
                <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <input name="name" type="text" placeholder="Your Name" style={inputStyle} required />
                        <input name="email" type="email" placeholder="Your Email" style={inputStyle} required />
                    </div>
                    <input name="subject" type="text" placeholder="Subject" style={inputStyle} required />
                    <textarea name="message" placeholder="Your Message" rows="5" style={inputStyle} required></textarea>
                    <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '1rem 3rem' }}>
                        Send Message
                    </button>
                </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const FacilityCard = ({ icon, title, desc }) => (
  <div className="card glass" style={{ padding: '2.5rem', textAlign: 'center' }}>
    <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', backgroundColor: 'rgba(59, 130, 246, 0.1)', marginBottom: '1.5rem' }}>
      {icon}
    </div>
    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{title}</h3>
    <p style={{ color: 'var(--text-muted)' }}>{desc}</p>
  </div>
);

const contactCardStyle = {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
    padding: '1.5rem',
    backgroundColor: 'var(--background)',
    borderRadius: '12px',
    border: '1px solid var(--glass-border)',
    boxShadow: 'var(--shadow)'
};

const diversityCardStyle = {
    padding: '1.25rem',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.05)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
};

const inputStyle = {
    padding: '0.8rem 1rem',
    borderRadius: '8px',
    border: '1px solid var(--glass-border)',
    backgroundColor: 'var(--background)',
    color: 'var(--text-main)',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.3s'
};

export default Home;
