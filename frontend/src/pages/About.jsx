import React from 'react';
import { motion } from 'framer-motion';
import { Award, CheckCircle, Users, Box, ShieldCheck } from 'lucide-react';

// Brand Logos
// Album Images (Sitework)
import work1 from '../assets/home-hero.jpg';
import work2 from '../assets/home-gallery-1.jpg';
import work3 from '../assets/home-gallery-2.avif';
import work4 from '../assets/home-gallery-3.jpg';
import brandKent from '../assets/brand-kent.png';
import brandCg from '../assets/brand-cg.png';
import brandGlen from '../assets/brand-glen.jpg';
import brandShikhar from '../assets/brand-shikhar.jpg';
import brandElica from '../assets/brand-elica.png';

const About = () => {
    React.useEffect(() => {
        document.title = "About Us | S.K Trade And Suppliers";
    }, []);


    const album = [work1, work2, work3, work4];

    return (
        <div className="animate-fade">
            {/* Header Section */}
            <section className="hero-gradient" style={{ paddingTop: '120px', paddingBottom: '3rem', textAlign: 'center' }}>
                <div className="container">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', marginBottom: '1.5rem', background: 'linear-gradient(to right, #60a5fa, #f8fafc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.2 }}
                    >
                        About S.K Trade And Suppliers
                    </motion.h1>
                    <p style={{ maxWidth: '800px', margin: '0 auto', color: 'var(--text-muted)', fontSize: 'clamp(1rem, 4vw, 1.2rem)' }}>
                        Leading authorized distributor and solutions provider for premium interior, hardware, and home appliances in Itahari, Nepal.
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <section className="section">
                <div className="container">
                    <div className="mobile-stack" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'center' }}>
                        <div>
                            <h2 style={{ fontSize: 'clamp(1.75rem, 6vw, 2.5rem)', marginBottom: '1.5rem' }}>Decades of Excellence in Quality & Trust</h2>
                            <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)', lineHeight: '1.8' }}>
                                Established in 2073 BS, S.K Trade And Suppliers has been the cornerstone of hardware and interior solutions for years. We pride ourselves on representing the world's most trusted brands, ensuring that every home in our region has access to durable, high-tech, and aesthetic solutions.
                            </p>
                            <div className="grid grid-2" style={{ gap: '1rem', marginBottom: '2rem' }}>
                                <div style={statStyle}>
                                    <Award size={24} color="var(--primary-accent)" />
                                    <div>
                                        <h4 style={{ color: 'white', fontSize: '0.95rem' }}>Authorized</h4>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Genuine Brand Partner</p>
                                    </div>
                                </div>
                                <div style={statStyle}>
                                    <Users size={24} color="var(--primary-accent)" />
                                    <div>
                                        <h4 style={{ color: 'white', fontSize: '0.95rem' }}>5000+</h4>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Happy Customers</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card glass" style={{ height: 'clamp(250px, 40vw, 400px)', overflow: 'hidden', borderRadius: '1.5rem' }}>
                            <img src={work1} alt="About Us" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Authorized Brands Section */}
            <section className="section" style={{ backgroundColor: 'var(--background)' }}>
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
                    
                    <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                        <BrandCard 
                            name="KENT" 
                            tagline="Water Purifiers & Appliances" 
                            desc="Certified dealer providing KENT water purifiers, air coolers, induction cooktops, and a wide range of premium appliances."
                            color="#0ea5e9"
                            imgSrc={brandKent}
                        />
                        <BrandCard 
                            name="CG & More" 
                            tagline="Home Appliances" 
                            desc="Authorized retailer for CG home appliances. We also offer premium kitchen chimneys and stoves from top brands like Kent and Elica."
                            color="#ef4444"
                            imgSrc={brandCg}
                        />
                        <BrandCard 
                            name="Glen" 
                            tagline="Premium Kitchen Appliances" 
                            desc="Exclusive partner for Glen's advanced kitchen chimneys, premium built-in hobs, dishwashers, ovens, and more."
                            color="#f59e0b"
                            imgSrc={brandGlen}
                        />
                        <BrandCard 
                            name="Shikhar Plywood" 
                            tagline="Plywood & Doors" 
                            desc="Premium supplier of Shikhar plywood, durable doors, and high-quality hardware products."
                            color="#10b981"
                            imgSrc={brandShikhar}
                        />
                        <BrandCard 
                            name="Elica" 
                            tagline="Premium Chimneys" 
                            desc="We sell premium Elica kitchen chimneys, providing state-of-the-art ventilation and sleek designs for modern kitchens."
                            color="#8b5cf6"
                            imgSrc={brandElica}
                        />
                    </div>
                </div>
            </section>

            {/* Sitework Album Site Section */}
            <section className="section">
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: 'clamp(1.75rem, 6vw, 2.5rem)', marginBottom: '1rem' }}>Our Sitework Album</h2>
                        <p style={{ color: 'var(--text-muted)' }}>A glimpse into the premium projects and interiors we've supplied and consulted.</p>
                    </div>
                    
                    <div className="grid grid-4" style={{ gap: '1.25rem' }}>
                        {album.map((img, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                whileHover={{ y: -10 }}
                                transition={{ duration: 0.5 }}
                                className="card glass"
                                style={{ height: 'clamp(200px, 25vw, 250px)', cursor: 'pointer', position: 'relative', overflow: 'hidden', borderRadius: '1rem' }}
                            >
                                <img src={img} alt={`Work ${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{ 
                                    position: 'absolute', 
                                    bottom: 0, left: 0, right: 0, 
                                    padding: '1rem', 
                                    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                                    color: 'white',
                                    fontSize: '0.8rem',
                                    fontWeight: 600
                                }}>
                                    Completed Project #{i + 1}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

const statStyle = {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    padding: '1.5rem',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.05)'
};

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

export default About;
