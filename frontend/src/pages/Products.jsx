import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Filter, AlertCircle } from 'lucide-react';

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
        specifications: { 'Duty Cycle': '100L/day', 'Storage': '9L', 'Mounting': 'Wall' }
    },
    {
        _id: '2',
        name: 'KENT PEARL STAR',
        category: 'Water Purifiers',
        description: 'Auto-flushing RO water purifier with detachable tank.',
        features: ['Auto-Flushing', '11L Tank', 'Digital Display'],
        imageUrl: '/images/products/kent-pearl-star.jpg',
        specifications: { 'Storage': '11L', 'Mounting': 'Wall/Table' }
    },
    {
        _id: '3',
        name: 'KENT WET & DRY VACUUM',
        category: 'Vacuum Cleaners',
        description: 'Powerful 1200W motor for all-surface deep cleaning.',
        features: ['Wet & Dry', 'Blower Function', '20L SS Body'],
        imageUrl: '/images/products/kent-wet-dry-vacuum-cleaner.jpg',
        specifications: { 'Power': '1200W', 'Pressure': '>18KPA' }
    },
    {
        _id: '4',
        name: 'KENT FORCE CYCLONIC',
        category: 'Vacuum Cleaners',
        description: '2000W high power cyclonic vacuum cleaner with HEPA filter.',
        features: ['Cyclonic Tech', '2000W Power', 'HEPA Filter'],
        imageUrl: '/images/products/kent-force-cyclonic-vacuum-cleaner.jpg',
        specifications: { 'Motor': '2000W', 'Filter': 'Washable HEPA' }
    },
    {
        _id: '5',
        name: 'Elica I-SMART SPOT H6',
        category: 'Kitchen Appliances',
        description: 'Premium smart chimney with inverter technology & motion sensor.',
        features: ['Inverter', 'Motion Sensor', 'Baffle Filter'],
        imageUrl: '/images/products/elica-i-smart-spot-h6-bf-ltw-90-nero.jpg',
        specifications: { 'Size': '90cm', 'RPM': '2500' }
    },
    {
        _id: '6',
        name: 'Elica Cooking Range F 6402',
        category: 'Kitchen Appliances',
        description: 'Gas cooking range with built-in oven and rotisserie function.',
        features: ['4 Burners', 'Built-in Oven', 'Auto Ignition'],
        imageUrl: '/images/products/elica-cooking-range-f-6402-zgrh.jpg',
        specifications: { 'Oven': '54 Litres', 'Finish': 'Stainless Steel' }
    },
    {
        _id: '7',
        name: 'KENT AEROCOOL PC 45L',
        category: 'Air Coolers',
        description: 'Efficient personal air cooler with Bacto-Shield honeycomb pads.',
        features: ['Honeycomb Pads', 'Inverter Support', '45L Tank'],
        imageUrl: '/images/products/kent-aerocool-pc-45l.jpg',
        specifications: { 'Capacity': '45L', 'Air Delivery': '2500m3/hr' }
    },
    {
        _id: '8',
        name: 'KENT SMARTCOOL SD 70L',
        category: 'Air Coolers',
        description: 'Large desert air cooler for homes and offices.',
        features: ['70L Tank', 'Ice Chamber', 'Anti-Bacterial Tank'],
        imageUrl: '/images/products/kent-smartcool-sd-70l.jpg',
        specifications: { 'Capacity': '70L', 'Type': 'Desert' }
    },
    {
        _id: '9',
        name: 'Premium Teak Wood Panels',
        category: 'Interior Decor',
        description: 'Elite wall cladding materials for high-end interior finishes.',
        features: ['Natural Teak', 'Termite Resistant', 'Acoustic Benefits'],
        imageUrl: '/images/products/premium-teak-wood-wall-panels.jpg',
        specifications: { 'Material': 'A-Grade Teak', 'Thickness': '12mm' }
    },
    {
        _id: '10',
        name: 'CG CGCT90MAX Chimney',
        category: 'Kitchen Appliances',
        description: 'Advanced filterless chimney with heat auto clean.',
        features: ['Filterless', 'Heat Clean', 'Gesture Control'],
        imageUrl: '/images/products/cg-cgct90max.jpg',
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
      setProducts(staticFallback); // Use fallback for demo
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
            backgroundColor: '#fef2f2', 
            color: '#b91c1c', 
            padding: '1rem', 
            borderRadius: '8px', 
            marginBottom: '2rem',
            textAlign: 'center',
            border: '1px solid #fee2e2',
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
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '800px', margin: '0 auto 3rem auto' }}>
          Explore our wide range of premium hardware, interior decorations, and home appliances. 
          Contact our store for specific facility requirements and installations.
        </p>

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
          <div style={{ position: 'relative', width: '300px' }}>
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
        <div className="grid grid-cols-3">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
              <h3>No products found matching your search criteria.</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ product }) => {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', transition: 'all 0.3s ease' }}>
      <Link to={`/products/${product._id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ 
          height: '250px', 
          overflow: 'hidden', 
          borderBottom: '1px solid var(--glass-border)',
          position: 'relative'
        }}>
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            onError={(e) => {
               e.target.onerror = null; 
               e.target.style.display = 'none';
               if(e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="img-placeholder" style={{ display: 'none', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>No Image Available</div>
        </div>
        
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <span style={{ 
            fontSize: '0.8rem', 
            textTransform: 'uppercase', 
            fontWeight: 600, 
            color: 'var(--primary-accent)',
            letterSpacing: '1px',
            marginBottom: '0.5rem'
          }}>
            {product.category}
          </span>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: 'var(--primary)' }}>{product.name}</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', flex: 1, fontSize: '0.95rem' }}>
            {product.description}
          </p>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {product.features && product.features.slice(0, 3).map((feature, idx) => (
              <span key={idx} style={{ 
                backgroundColor: 'rgba(59, 130, 246, 0.1)', 
                color: 'var(--primary-accent)', 
                padding: '0.25rem 0.5rem', 
                borderRadius: '4px', 
                fontSize: '0.75rem',
                fontWeight: 500
              }}>
                {feature}
              </span>
            ))}
          </div>
          
          <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
             <span className="btn btn-outline" style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem', justifyContent: 'center' }}>View Details</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Products;
