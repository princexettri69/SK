import React, { useState, useEffect } from 'react';
import { ArrowRight, Wrench, PaintBucket, Home as HomeIcon, ShieldCheck, Star, Award, Zap, Heart } from 'lucide-react';
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
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  useEffect(() => {
    document.title = "S.K Trade & Suppliers | Premium Hardware & Interior";
    fetchFeatured();
  }, []);

  const fetchFeatured = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        // Just take the first 3 as featured for demo purposes
        setFeaturedProducts(data.slice(0, 3));
    } catch (err) {
        console.error(err);
        setFeaturedProducts([]);
    } finally {
        setLoadingFeatured(false);
    }
  };

  useEffect(() => {
    let timer;
    if (isHovered) {
      timer = setInterval(() => {
        setIndex((prev) => (prev + 1) % images.length);
      }, 2000);
    }
    return () => clearInterval(timer);
  }, [isHovered]);

  const handleContactSubmit = (e) => {
    e.preventDefault();
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
        
        <div className="container grid grid-2" style={{ alignItems: 'center', minHeight: '80vh' }}>
          <div style={{ zIndex: 10 }}>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <span style={{ 
                    color: 'var(--primary-accent)', 
                    fontWeight: 700, 
                    fontSize: '0.9rem', 
                    letterSpacing: '3px', 
                    textTransform: 'uppercase',
                    marginBottom: '1rem',
                    display: 'block'
                }}>
                    ESTABLISHED 2026
                </span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="hero-text" 
              style={{ fontSize: '4.5rem', marginBottom: '1.5rem', background: 'linear-gradient(to right, #ffffff, var(--primary-accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.1 }}
            >
              Transform Your Living Spaces
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="hero-subtext"
              style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '600px' }}
            >
              S.K Trade and Suppliers provides premium hardware, interior decor, kitchen appliances, and advanced water purification solutions for modern homes.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="hero-buttons" 
              style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
            >
              <Link to="/products" className="btn btn-primary" style={{ padding: '1.25rem 2.5rem', fontSize: '1.1rem', borderRadius: '50px' }}>
                Explore Catalog <ArrowRight size={20} />
              </Link>
              <Link to="/about" className="btn btn-outline" style={{ padding: '1.25rem 2.5rem', fontSize: '1.1rem', borderRadius: '50px' }}>
                Learn More
              </Link>
            </motion.div>
          </div>

          <div 
            style={{ perspective: '1500px', zIndex: 10, position: 'relative', height: '450px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <AnimatePresence mode="wait">
              <motion.div 
                key={index}
                initial={{ rotateY: 90, opacity: 0, scale: 0.9 }}
                animate={{ rotateY: 0, opacity: 1, scale: 1 }}
                exit={{ rotateY: -90, opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                style={{ transformStyle: 'preserve-3d', width: '100%', position: 'absolute', display: 'flex', justifyContent: 'center' }}
              >
                <motion.div
                  animate={{ 
                    rotateY: isHovered ? [-15, 15, -15] : [-5, 5, -5],
                    rotateX: isHovered ? [5, -5, 5] : [2, -2, 2],
                    y: isHovered ? [0, -20, 0] : [0, -10, 0]
                  }}
                  transition={{ duration: isHovered ? 4 : 6, repeat: Infinity, ease: "easeInOut" }}
                  style={{ width: '100%' }}
                >
                  <img 
                    src={images[index]} 
                    alt="Modern Interior" 
                    style={{ 
                      width: '100%', borderRadius: '2rem', 
                      boxShadow: isHovered ? '0 60px 100px -30px rgba(0,0,0,0.9), 0px 0px 80px -10px rgba(59, 130, 246, 0.4)' : '0 40px 80px -20px rgba(0,0,0,0.8)',
                      border: '1px solid rgba(255,255,255,0.1)', aspectRatio: '16/10', objectFit: 'cover'
                    }} 
                  />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {!loadingFeatured && featuredProducts.length > 0 && (
        <section className="section" style={{ backgroundColor: 'var(--background)' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-accent)', marginBottom: '0.5rem' }}>
                            <Star size={18} fill="var(--primary-accent)" />
                            <span style={{ fontWeight: 700, fontSize: '0.8rem', letterSpacing: '2px' }}>TOP PICKS</span>
                        </div>
                        <h2 style={{ fontSize: '3rem' }}>Featured Collections</h2>
                    </div>
                    <Link to="/products" className="btn btn-outline">Explore All Items</Link>
                </div>

                <div className="grid grid-3">
                    {featuredProducts.map(product => (
                        <motion.div key={product._id} whileHover={{ y: -10 }} className="card glass" style={{ padding: '1.5rem', borderRadius: '1.5rem' }}>
                            <div style={{ height: '200px', background: 'white', borderRadius: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                                <img src={product.imageUrl} alt={product.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{product.name}</h3>
                            <p style={{ color: 'var(--primary-accent)', fontWeight: 800, fontSize: '1.25rem', marginBottom: '1rem' }}>रू {product.price?.toLocaleString()} NPR</p>
                            <Link to={`/products/${product._id}`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                                View Product
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
      )}

      {/* Why Choose Us Section */}
      <section className="section" style={{ background: 'rgba(30, 41, 59, 0.4)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h2 style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>Excellence in Service</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem' }}>
                We combine industry-leading products with expert consultation to provide a seamless home transformation experience.
            </p>
          </div>

          <div className="grid grid-3">
            <ServiceCard 
                icon={<Award size={32} />} 
                title="Premium Quality" 
                desc="We only deal with authorized world-class brands like KENT, Elica, and Shikhar Ply to ensure longevity." 
            />
            <ServiceCard 
                icon={<Zap size={32} />} 
                title="Expert Installation" 
                desc="Our certified technicians ensure that every appliance and hardware piece is installed with precision." 
            />
            <ServiceCard 
                icon={<Heart size={32} />} 
                title="After-Sales Care" 
                desc="Authorized service center status means we provide genuine spare parts and rapid maintenance support." 
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section" style={{ backgroundColor: 'var(--background)' }}>
        <div className="container">
          <div className="grid grid-2" style={{ gap: '5rem' }}>
            <div>
                <h2 style={{ fontSize: '3.5rem', marginBottom: '2rem' }}>Ready to <span style={{ color: 'var(--primary-accent)' }}>Elevate</span> Your Home?</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '3rem' }}>
                    Contact our specialists for a free consultation and project estimation.
                </p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                    <ContactInfo icon={<HomeIcon size={24} />} title="Experience Center" detail="Dharan Line, Itahari - 6, Nepal" />
                    <ContactInfo icon={<PaintBucket size={24} />} title="Customer Support" detail="+977 9810425484, 8746859847" />
                    <ContactInfo icon={<ShieldCheck size={24} />} title="Email Inquiry" detail="info@sktrade.com.np" />
                </div>
            </div>

            <div className="card glass" style={{ padding: '3.5rem', borderRadius: '2rem' }}>
                <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="grid grid-2" style={{ gap: '1rem' }}>
                        <input name="name" type="text" placeholder="Full Name" style={inputStyle} required />
                        <input name="email" type="email" placeholder="Email Address" style={inputStyle} required />
                    </div>
                    <input name="subject" type="text" placeholder="How can we help?" style={inputStyle} required />
                    <textarea name="message" placeholder="Project Details" rows="5" style={inputStyle} required></textarea>
                    <button type="submit" className="btn btn-primary" style={{ padding: '1.25rem', borderRadius: '12px', fontSize: '1rem', fontWeight: 700 }}>
                        Send Inquiry
                    </button>
                </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const ServiceCard = ({ icon, title, desc }) => (
    <motion.div whileHover={{ y: -10 }} className="card glass" style={{ padding: '3rem', borderRadius: '2rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', padding: '1.5rem', borderRadius: '1.5rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary-accent)', marginBottom: '2rem' }}>
            {icon}
        </div>
        <h3 style={{ fontSize: '1.75rem', marginBottom: '1.25rem' }}>{title}</h3>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>{desc}</p>
    </motion.div>
);

const ContactInfo = ({ icon, title, detail }) => (
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary-accent)' }}>
            {icon}
        </div>
        <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{title}</h4>
            <p style={{ color: 'var(--text-muted)' }}>{detail}</p>
        </div>
    </div>
);

const inputStyle = {
    padding: '1rem 1.25rem',
    borderRadius: '12px',
    border: '1px solid var(--glass-border)',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    color: 'var(--text-main)',
    outline: 'none',
    fontSize: '1rem',
    transition: 'all 0.3s'
};

export default Home;
