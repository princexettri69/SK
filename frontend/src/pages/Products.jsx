import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Filter, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', 'Water Purifiers', 'Vacuum Cleaners', 'Air Coolers', 'Kitchen Appliances', 'Hardware', 'Interior Decor'];
  
  const staticFallback = [
    {
        _id: '1',
        name: 'KENT GRAND STAR-B',
        category: 'Water Purifiers',
        description: 'Advanced RO+UV+UF+TDS Controller with Double UV Protection.',
        features: ['RO+UV+UF+TDS', 'Double UV', '9L Storage', 'Mineral RO'],
        imageUrl: '/images/products/kent-grand-star-b.jpg',
        price: 24500,
        specifications: { 'Duty Cycle': '100L/day', 'Storage': '9L', 'Mounting': 'Wall' }
    },
    {
        _id: '2',
        name: 'KENT PEARL STAR',
        category: 'Water Purifiers',
        description: 'Auto-flushing RO water purifier with detachable tank.',
        features: ['Auto-Flushing', '11L Tank', 'Digital Display'],
        imageUrl: '/images/products/kent-pearl-star.jpg',
        price: 21000,
        specifications: { 'Storage': '11L', 'Mounting': 'Wall/Table' }
    },
    {
        _id: '10',
        name: 'CG CGCT90MAX Chimney',
        category: 'Kitchen Appliances',
        description: 'Advanced filterless chimney with heat auto clean.',
        features: ['Filterless', 'Heat Clean', 'Gesture Control'],
        imageUrl: '/images/products/cg-cgct90max.jpg',
        price: 15990,
        specifications: { 'Suction': '1600m3/hr', 'Size': '90cm' }
    }
  ];

  const location = useLocation();

  useEffect(() => {
    fetchProducts();
    
    // Check for query params
    const searchParams = new URLSearchParams(location.search);
    const categoryParam = searchParams.get('category');
    if (categoryParam && categories.includes(categoryParam)) {
      setSelectedCategory(categoryParam);
    }
  }, [location]);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, products]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setProducts(staticFallback);
      setError('Note: Displaying demo products because the MongoDB connection failed. Please check your Atlas IP Whitelist.');
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let result = products;
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(lowerTerm) || 
        p.description.toLowerCase().includes(lowerTerm)
      );
    }
    setFilteredProducts(result);
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: '1.5rem', color: 'var(--primary-accent)', fontWeight: 600 }}>Loading Catalog...</div>
    </div>
  );

  return (
    <div className="section animate-fade" style={{ paddingTop: '100px', minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      <div className="container">
        {error && (
          <div style={{ 
            backgroundColor: 'rgba(239, 68, 68, 0.1)', 
            color: '#ef4444', 
            padding: '1rem', 
            borderRadius: '8px', 
            marginBottom: '2rem',
            textAlign: 'center',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={20} />
            <span style={{ fontSize: '0.9rem' }}>{error}</span>
          </div>
        )}
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', textAlign: 'center' }}>Our Products</h1>
        
        {/* Filters and Search */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '3rem',
          flexWrap: 'wrap',
          gap: '1rem',
          background: 'var(--card-bg)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--shadow)'
        }}>
          {/* Category Filter */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', flex: 1 }}>
            <Filter size={24} color="var(--primary-accent)" style={{ marginRight: '0.5rem' }} />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  border: `1px solid ${selectedCategory === cat ? 'var(--primary-accent)' : 'var(--glass-border)'}`,
                  background: selectedCategory === cat ? 'var(--primary-accent)' : 'transparent',
                  color: selectedCategory === cat ? 'white' : 'var(--text-main)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: 'Outfit',
                  fontWeight: 500
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="mobile-full" style={{ position: 'relative', width: '300px' }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.5rem',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)',
                background: 'var(--background)',
                color: 'var(--text-main)',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-4" style={{ gap: '1.25rem' }}>
          {filteredProducts.map((product) => (
            <motion.div 
              key={product._id || product.id} 
              whileHover={{ y: -8 }}
              className="card glass card-hover flex flex-col" 
              style={{ 
                height: '100%', 
                overflow: 'hidden', 
                borderRadius: '1rem',
                border: '1px solid var(--glass-border)',
                background: 'rgba(30, 41, 59, 0.4)'
              }}
            >
              <Link to={`/products/${product._id || product.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div className="image-zoom" style={{ height: '160px', backgroundColor: 'white', position: 'relative' }}>
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '0.5rem' }}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400'; }}
                  />
                </div>
                
                <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <span style={{ 
                        backgroundColor: 'rgba(59, 130, 246, 0.1)', 
                        color: 'var(--primary-accent)', 
                        padding: '0.2rem 0.5rem', 
                        borderRadius: '4px', 
                        fontSize: '0.65rem', 
                        fontWeight: 700, 
                        textTransform: 'uppercase' 
                    }}>
                      {product.category}
                    </span>
                    <h3 style={{ fontSize: '1rem', color: 'white', margin: '0.5rem 0 0 0', lineHeight: '1.3', fontWeight: 600 }}>{product.name}</h3>
                  </div>
                  
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1.25rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.5' }}>
                    {product.description}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-accent)' }}>
                      रू {product.price?.toLocaleString() || 'N/A'} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>NPR</span>
                    </span>
                  </div>

                  <div style={{ marginTop: 'auto' }}>
                    <span className="btn btn-primary" style={{ width: '100%', padding: '0.6rem', fontSize: '0.8rem', justifyContent: 'center', borderRadius: '0.5rem', fontWeight: 600 }}>
                      View Details
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
