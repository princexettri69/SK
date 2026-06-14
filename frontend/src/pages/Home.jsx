import React, { useState, useEffect } from 'react';
import { ArrowRight, Wrench, PaintBucket, Home as HomeIcon, ShieldCheck, Star, Award, Zap, Heart, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { resolveImageUrl } from '../utils/resolveImage';
import heroImage1 from '../assets/home-hero.jpg';
import heroImage2 from '../assets/home-gallery-1.jpg';
import heroImage3 from '../assets/home-gallery-2.avif';
import heroImage4 from '../assets/home-gallery-3.jpg';
import brandKent from '../assets/brand-kent.png';
import brandCg from '../assets/brand-cg.png';
import brandGlen from '../assets/brand-glen.jpg';

const images = [heroImage1, heroImage2, heroImage3, heroImage4];

const Home = () => {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  useEffect(() => {
    document.title = "S.K Trade And Suppliers | Premium Hardware & Interior";
    fetchFeatured();
  }, []);

  const fetchFeatured = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
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

        <div className="container" style={{ width: '100%' }}>
          <div className="mobile-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center', minHeight: '80vh' }}>
            {/* Text Content */}
            <div style={{ zIndex: 10 }}>
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <span style={{
                  color: 'var(--primary-accent)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  marginBottom: '1rem',
                  display: 'block'
                }}>
                  ESTABLISHED 2016 AD
                </span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="hero-text"
                style={{
                  fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
                  marginBottom: '1.5rem',
                  background: 'linear-gradient(to right, #ffffff, var(--primary-accent))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1.1
                }}
              >
                Transform Your Living Spaces
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="hero-subtext"
                style={{ fontSize: 'clamp(1rem, 4vw, 1.2rem)', color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '600px' }}
              >
                S.K Trade And Suppliers provides premium hardware, interior decor, kitchen appliances, and advanced water purification solutions for modern homes.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="hero-buttons"
                style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
              >
                <Link to="/products" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1rem', borderRadius: '50px' }}>
                  Explore Catalog <ArrowRight size={20} />
                </Link>
                <Link to="/about" className="btn btn-outline" style={{ padding: '1rem 2rem', fontSize: '1rem', borderRadius: '50px' }}>
                  Learn More
                </Link>
              </motion.div>
            </div>

            {/* Hero Image */}
            <div
              style={{ perspective: '1500px', zIndex: 10, position: 'relative', height: 'clamp(250px, 50vw, 450px)', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
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
                        width: '100%', borderRadius: '1.5rem',
                        boxShadow: isHovered ? '0 60px 100px -30px rgba(0,0,0,0.9), 0px 0px 80px -10px rgba(59, 130, 246, 0.4)' : '0 40px 80px -20px rgba(0,0,0,0.8)',
                        border: '1px solid rgba(255,255,255,0.1)', aspectRatio: '16/10', objectFit: 'cover'
                      }}
                    />
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Complete Interior & Hardware Solutions Section */}
      <section className="section" style={{ backgroundColor: 'var(--background)' }}>
        <div className="container">
          <div className="mobile-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', inset: '-20px', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), transparent)', borderRadius: '2rem', zIndex: 0 }}></div>
              <img src={images[1]} alt="Modern Interior Decor" style={{ width: '100%', borderRadius: '1.5rem', position: 'relative', zIndex: 1, boxShadow: '0 20px 40px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)' }} />
            </div>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-accent)', marginBottom: '1rem', padding: '0.5rem 1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '100px' }}>
                <PaintBucket size={18} />
                <span style={{ fontWeight: 800, fontSize: '0.8rem', letterSpacing: '2px' }}>END-TO-END SOLUTIONS</span>
              </div>
              <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '1.5rem', lineHeight: 1.1 }}>
                Fully Furnished <span style={{ color: 'var(--primary-accent)' }}>Interior Decor</span> & Hardware
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '1.5rem', lineHeight: 1.7 }}>
                Building a new home? We provide comprehensive interior decoration services and supply <strong>every single hardware item</strong> required to make your dream house a reality. From concept to execution, we handle it all.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2.5rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-main)', fontWeight: 500, fontSize: '1.05rem' }}>
                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.5rem', borderRadius: '50%' }}><ShieldCheck size={20} /></div>
                  Complete Interior Design & Execution
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-main)', fontWeight: 500, fontSize: '1.05rem' }}>
                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.5rem', borderRadius: '50%' }}><Wrench size={20} /></div>
                  Premium Grade Architectural Hardware
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-main)', fontWeight: 500, fontSize: '1.05rem' }}>
                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.5rem', borderRadius: '50%' }}><HomeIcon size={20} /></div>
                  Modular Kitchens & Appliances Setup
                </li>
              </ul>
              <a href="#contact" className="btn btn-primary" style={{ padding: '1rem 2rem', borderRadius: '12px', fontSize: '1.05rem' }}>
                Start Your Project <ArrowRight size={20} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {!loadingFeatured && featuredProducts.length > 0 && (
        <section className="section" style={{ backgroundColor: 'var(--background)' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div className="mobile-center" style={{ flex: 1, minWidth: '300px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-accent)', marginBottom: '0.5rem' }}>
                  <Star size={18} fill="var(--primary-accent)" />
                  <span style={{ fontWeight: 700, fontSize: '0.8rem', letterSpacing: '2px' }}>TOP PICKS</span>
                </div>
                <h2 style={{ fontSize: 'clamp(1.75rem, 6vw, 3rem)' }}>Featured Collections</h2>
              </div>
              <Link to="/products" className="btn btn-outline mobile-full">Explore All Items</Link>
            </div>

            <div className="grid grid-3">
              {featuredProducts.map(product => (
                <motion.div key={product._id} whileHover={{ y: -8 }} className="card glass" style={{ padding: '1.5rem', borderRadius: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: '200px', background: 'white', borderRadius: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <img src={resolveImageUrl(product.imageUrl)} alt={product.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{product.name}</h3>
                  <p style={{ color: 'var(--primary-accent)', fontWeight: 800, fontSize: '1.25rem', marginBottom: '1.5rem', marginTop: 'auto' }}>रू {product.price?.toLocaleString()} NPR</p>
                  <Link to={`/products/${product._id}`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    View Product
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Authorized Brands Section */}
      <section className="section" style={{ backgroundColor: 'var(--background)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-accent)', marginBottom: '1rem', padding: '0.5rem 1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '100px' }}>
              <ShieldCheck size={18} />
              <span style={{ fontWeight: 800, fontSize: '0.8rem', letterSpacing: '2px' }}>OFFICIAL PARTNERS</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.75rem, 6vw, 3rem)', marginBottom: '1rem' }}>Authorized Premium Dealer</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto', fontSize: '1.1rem' }}>
              We are officially certified and trusted partners for Nepal's leading home appliance and hardware brands, ensuring 100% genuine products and warranty support.
            </p>
          </div>

          <div className="grid grid-3" style={{ gap: '2rem' }}>
            <BrandCard
              name="KENT"
              tagline="Water Purifiers"
              desc="Certified dealer for authentic KENT RO and UV water purification systems, bringing the purest drinking water to your family."
              color="#0ea5e9"
              imgSrc={brandKent}
            />
            <BrandCard
              name="CG"
              tagline="Home Appliances"
              desc="Authorized retailer for Chaudhary Group's premium line of electronics, bringing cutting-edge technology to your living space."
              color="#ef4444"
              imgSrc={brandCg}
            />
            <BrandCard
              name="Glen"
              tagline="Kitchen Chimneys"
              desc="Exclusive partner for Glen's advanced, silent, and high-suction kitchen chimneys and premium built-in hobs."
              color="#f59e0b"
              imgSrc={brandGlen}
            />
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section" style={{ background: 'rgba(30, 41, 59, 0.4)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: 'clamp(1.75rem, 6vw, 3.5rem)', marginBottom: '1.5rem' }}>Excellence in Service</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto', fontSize: 'clamp(0.95rem, 4vw, 1.1rem)' }}>
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
          <div className="mobile-stack" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem' }}>
            <div>
              <h2 style={{ fontSize: 'clamp(1.75rem, 6vw, 3.5rem)', marginBottom: '1.5rem' }}>
                Ready to <span style={{ color: 'var(--primary-accent)' }}>Elevate</span> Your Home?
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(0.95rem, 4vw, 1.2rem)', marginBottom: '2.5rem' }}>
                Contact our specialists for a free consultation and project estimation.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <ContactInfo icon={<HomeIcon size={24} />} title="Experience Center" detail="Dharan Line, Itahari - 6, Nepal" />
                <ContactInfo icon={<PaintBucket size={24} />} title="Customer Support" detail="+977 9810425484, 9705451066" />
                <ContactInfo icon={<ShieldCheck size={24} />} title="Email Inquiry" detail="xettriprince150@gmail.com" />
              </div>

              <div style={{ marginTop: '2.5rem' }}>
                <div style={{ width: '100%', height: '220px', borderRadius: '1rem', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                  <iframe
                    title="S.K Trade And Suppliers Location"
                    src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=Itahari,%20Nepal+(S.K%20Trade%20And%20Suppliers)&amp;t=&amp;z=15&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
                <a href="https://maps.app.goo.gl/bhAEpYuq3QhA6J2PA" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-accent)', fontWeight: 700, marginTop: '1rem', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={(e) => e.currentTarget.style.color = 'white'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--primary-accent)'}>
                  <MapPin size={18} /> Open Directions in Google Maps <ArrowRight size={16} />
                </a>
              </div>
            </div>

            <div className="card glass" style={{ padding: 'clamp(1.5rem, 5vw, 3.5rem)', borderRadius: '2rem' }}>
              <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <input name="name" type="text" placeholder="Full Name" style={inputStyle} required />
                  <input name="email" type="email" placeholder="Email Address" style={inputStyle} required />
                </div>
                <input name="subject" type="text" placeholder="How can we help?" style={inputStyle} required />
                <textarea name="message" placeholder="Project Details" rows="5" style={{ ...inputStyle, resize: 'vertical' }} required></textarea>
                <button type="submit" className="btn btn-primary" style={{ padding: '1.25rem', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, justifyContent: 'center' }}>
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
  <motion.div whileHover={{ y: -8 }} className="card glass" style={{ padding: '2.5rem', borderRadius: '2rem', textAlign: 'center' }}>
    <div style={{ display: 'inline-flex', padding: '1.25rem', borderRadius: '1.25rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary-accent)', marginBottom: '1.5rem' }}>
      {icon}
    </div>
    <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>{title}</h3>
    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '0.95rem' }}>{desc}</p>
  </motion.div>
);

const BrandCard = ({ name, tagline, desc, color, imgSrc }) => (
  <motion.div whileHover={{ y: -5 }} className="card glass-light" style={{ padding: '2.5rem 2rem', borderRadius: '1.5rem', borderTop: `4px solid ${color}`, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <div style={{ height: '70px', width: '100%', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'white', padding: '0.75rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
      {imgSrc ? (
        <img src={imgSrc} alt={`${name} Logo`} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
      ) : (
        <h3 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>{name}</h3>
      )}
    </div>
    <span style={{ color: color, fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.5rem', display: 'block', background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.75rem', borderRadius: '100px' }}>{tagline}</span>
    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>{desc}</p>
  </motion.div>
);

const ContactInfo = ({ icon, title, detail }) => (
  <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
    <div style={{ padding: '0.875rem', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary-accent)', flexShrink: 0 }}>
      {icon}
    </div>
    <div>
      <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{title}</h4>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>{detail}</p>
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
  transition: 'all 0.3s',
  width: '100%',
};

export default Home;
