import React from 'react';
import { motion } from 'framer-motion';
import { Award, CheckCircle, Users, Box } from 'lucide-react';

// Brand Logos
// Album Images (Sitework)
import work1 from '../assets/home-hero.jpg';
import work2 from '../assets/home-gallery-1.jpg';
import work3 from '../assets/home-gallery-2.avif';
import work4 from '../assets/home-gallery-3.jpg';

const About = () => {
    React.useEffect(() => {
        document.title = "About Us | S.K Trade & Suppliers";
    }, []);

    const brands = [
        { name: 'KENT RO', logo: '/images/brands/brand-kent.png' },
        { name: 'ELICA', logo: '/images/brands/brand-elica.png' },
        { name: 'Shikhar Ply', logo: '/images/brands/brand-shikhar.jpg' },
        { name: 'GLEN India', logo: '/images/brands/brand-glen.jpg' },
        { name: 'CG Group', logo: '/images/brands/brand-cg.png' },
    ];

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
                        About S.K Trade & Suppliers
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
                                S.K Trade & Suppliers has been the cornerstone of hardware and interior solutions for years. We pride ourselves on representing the world's most trusted brands, ensuring that every home in our region has access to durable, high-tech, and aesthetic solutions.
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

            {/* Brands Collaboration Section */}
            <section className="section" style={{ backgroundColor: '#0f172a' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: 'clamp(1.75rem, 6vw, 2.5rem)', marginBottom: '1rem' }}>Our Brand Collaborations</h2>
                        <p style={{ color: 'var(--text-muted)' }}>We represent the best in the industry to bring you quality you can trust.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                        {brands.map((brand, i) => (
                            <motion.div 
                                key={i}
                                whileHover={{ scale: 1.05 }}
                                style={{ 
                                    backgroundColor: 'white', 
                                    padding: '1rem', 
                                    borderRadius: '1rem', 
                                    width: 'clamp(140px, 20vw, 180px)', 
                                    height: 'clamp(80px, 12vw, 100px)', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                                }}
                            >
                                <img src={brand.logo} alt={brand.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                            </motion.div>
                        ))}
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

export default About;
