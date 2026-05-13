import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Filter, AlertCircle, Package, ShoppingCart, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../components/CartContext';
import { resolveImageUrl } from '../utils/resolveImage';
import toast from 'react-hot-toast';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const location = useLocation();

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [location, categories]);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, products]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/products`),
        fetch(`${import.meta.env.VITE_API_URL}/api/categories`)
      ]);

      if (!productsRes.ok || !categoriesRes.ok) throw new Error('Failed to fetch catalog data');
      
      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();
      
      setProducts(productsData);
      setCategories(['All', ...categoriesData.map(c => c.name)]);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('System synchronization failed. Some assets may not be visible.');
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

  const handleQuickAdd = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    toast.success(`${product.name} added to cart`, {
      icon: <ShoppingCart size={18} color="#3b82f6" />
    });
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
      <div className="loader"></div>
      <span style={{ marginLeft: '1rem', fontWeight: 600, color: 'var(--primary-accent)' }}>Syncing Catalog...</span>
    </div>
  );

  return (
    <div className="section animate-fade" style={{ paddingTop: '100px', minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      <div className="container">
        {error && (
          <div style={{ 
            backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1rem', borderRadius: '8px', marginBottom: '2rem',
            textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
          }}>
            <AlertCircle size={20} />
            <span style={{ fontSize: '0.9rem' }}>{error}</span>
          </div>
        )}
        
        <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-1px' }}>Global Catalog</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Browse our complete collection of premium home and industrial solutions.</p>
        </header>
        
        <div style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem',
          background: 'rgba(30, 41, 59, 0.4)', padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow)'
        }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', flex: 1, alignItems: 'center' }}>
            <Filter size={20} color="var(--primary-accent)" style={{ marginRight: '0.5rem' }} />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.5rem 1.25rem', borderRadius: '50px', border: `1px solid ${selectedCategory === cat ? 'var(--primary-accent)' : 'var(--glass-border)'}`,
                  background: selectedCategory === cat ? 'var(--primary-accent)' : 'transparent', color: selectedCategory === cat ? 'white' : 'var(--text-main)',
                  cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', fontWeight: 600, fontSize: '0.85rem'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="mobile-full" style={{ position: 'relative', width: '320px' }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text" placeholder="Search catalog..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%', padding: '0.85rem 1rem 0.85rem 2.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)',
                background: 'rgba(15, 23, 42, 0.6)', color: 'var(--text-main)', fontSize: '1rem', outline: 'none', transition: 'all 0.3s'
              }}
            />
          </div>
        </div>

        <div className="grid grid-4" style={{ gap: '1.5rem' }}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <motion.div 
                key={product._id} whileHover={{ y: -10, scale: 1.02 }}
                className="card glass card-hover" 
                style={{ height: '100%', overflow: 'hidden', borderRadius: '1.5rem', border: '1px solid var(--glass-border)', background: 'rgba(30, 41, 59, 0.4)', display: 'flex', flexDirection: 'column', position: 'relative' }}
              >
                <Link to={`/products/${product._id}`} style={{ textDecoration: 'none', color: 'inherit', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: '200px', backgroundColor: 'white', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
                    <img 
                      src={resolveImageUrl(product.imageUrl)} alt={product.name} 
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/400'; }}
                    />
                    <button 
                      onClick={(e) => handleQuickAdd(e, product)}
                      style={{ position: 'absolute', top: '10px', right: '10px', background: 'var(--primary-accent)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)', zIndex: 5 }}
                    >
                      <ShoppingCart size={20} />
                    </button>
                  </div>
                  
                  <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ marginBottom: '0.75rem' }}>
                      <span style={{ 
                          backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary-accent)', padding: '0.3rem 0.6rem', 
                          borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px'
                      }}>
                        {product.category}
                      </span>
                      <h3 style={{ fontSize: '1.1rem', color: 'white', margin: '0.75rem 0 0 0', lineHeight: '1.4', fontWeight: 700 }}>{product.name}</h3>
                    </div>
                    
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.6' }}>
                      {product.description}
                    </p>

                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--primary-accent)' }}>
                          रू {product.price?.toLocaleString() || 'N/A'}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>NPR (INC. TAX)</span>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '50%' }}>
                        <ArrowRight size={18} color="var(--primary-accent)" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
              <Package size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
              <h3>No products found in this sector</h3>
              <p>Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
