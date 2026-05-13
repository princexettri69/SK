import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Filter, AlertCircle, Package, ShoppingCart, ArrowRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../components/CartContext';
import { resolveImageUrl } from '../utils/resolveImage';
import toast from 'react-hot-toast';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const location = useLocation();

  useEffect(() => {
    document.title = 'Global Catalog | S.K Trade & Suppliers';
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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)', flexDirection: 'column', gap: '1rem' }}>
      <div className="loader"></div>
      <span style={{ fontWeight: 600, color: 'var(--primary-accent)' }}>Syncing Catalog...</span>
    </div>
  );

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', backgroundColor: 'var(--background)', paddingBottom: '4rem' }}>
      <div className="container">
        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1rem', borderRadius: '12px', marginBottom: '2rem',
            textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
          }}>
            <AlertCircle size={20} />
            <span style={{ fontSize: '0.9rem' }}>{error}</span>
          </div>
        )}

        {/* Page Header */}
        <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: '0.75rem', letterSpacing: '-1px' }}>
            Global Catalog
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)' }}>
            Browse our complete collection of premium home and industrial solutions.
          </p>
        </header>

        {/* Search Bar - always visible */}
        <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '50px',
              border: '1px solid var(--glass-border)', background: 'rgba(30, 41, 59, 0.5)',
              color: 'var(--text-main)', fontSize: '1rem', outline: 'none', transition: 'all 0.3s',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}
          />
        </div>

        {/* Filter Bar */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.4)', padding: '1.25rem', borderRadius: '1.25rem',
          border: '1px solid var(--glass-border)', marginBottom: '2.5rem'
        }}>
          {/* Mobile: collapsible filter */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: (filterOpen || window.innerWidth > 991) ? '1rem' : 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-accent)', fontWeight: 700, fontSize: '0.9rem' }}>
              <Filter size={16} />
              <span>Filter by Category</span>
              {selectedCategory !== 'All' && (
                <span style={{ background: 'var(--primary-accent)', color: 'white', fontSize: '0.65rem', padding: '0.15rem 0.5rem', borderRadius: '20px', fontWeight: 800 }}>
                  {selectedCategory}
                </span>
              )}
            </div>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="show-mobile"
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem' }}
            >
              {filterOpen ? 'Collapse' : 'Expand'} <ChevronDown size={16} style={{ transform: filterOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
            </button>
          </div>

          {/* Desktop: always visible. Mobile: toggleable */}
          <div className={`${filterOpen ? '' : 'hidden-mobile'}`} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', paddingTop: '0' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); if(window.innerWidth <= 991) setFilterOpen(false); }}
                style={{
                  padding: '0.5rem 1.1rem', borderRadius: '50px',
                  border: `1px solid ${selectedCategory === cat ? 'var(--primary-accent)' : 'var(--glass-border)'}`,
                  background: selectedCategory === cat ? 'var(--primary-accent)' : 'transparent',
                  color: selectedCategory === cat ? 'white' : 'var(--text-main)',
                  cursor: 'pointer', transition: 'all 0.25s', fontWeight: 600, fontSize: '0.85rem',
                  whiteSpace: 'nowrap'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div style={{ marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, textAlign: window.innerWidth <= 640 ? 'center' : 'left' }}>
          Showing <span style={{ color: 'var(--primary-accent)' }}>{filteredProducts.length}</span> product{filteredProducts.length !== 1 ? 's' : ''}
          {selectedCategory !== 'All' && <span> in <strong style={{ color: 'white' }}>{selectedCategory}</strong></span>}
        </div>

        {/* Products Grid */}
        <div className="grid grid-4" style={{ gap: '1.25rem' }}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <motion.div
                key={product._id}
                whileHover={{ y: -8, scale: 1.02 }}
                className="card glass card-hover"
                style={{
                  height: '100%', overflow: 'hidden', borderRadius: '1.25rem',
                  border: '1px solid var(--glass-border)', background: 'rgba(30, 41, 59, 0.4)',
                  display: 'flex', flexDirection: 'column', position: 'relative'
                }}
              >
                <Link to={`/products/${product._id}`} style={{ textDecoration: 'none', color: 'inherit', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: '180px', backgroundColor: 'white', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.25rem' }}>
                    <img
                      src={resolveImageUrl(product.imageUrl)} alt={product.name}
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/400'; }}
                    />
                    <button
                      onClick={(e) => handleQuickAdd(e, product)}
                      style={{
                        position: 'absolute', top: '10px', right: '10px', background: 'var(--primary-accent)',
                        border: 'none', borderRadius: '50%', width: '38px', height: '38px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', cursor: 'pointer', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)', zIndex: 5
                      }}
                      title="Add to cart"
                    >
                      <ShoppingCart size={18} />
                    </button>
                  </div>

                  <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ marginBottom: '0.6rem' }}>
                      <span style={{
                        backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary-accent)',
                        padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.65rem',
                        fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px'
                      }}>
                        {product.category}
                      </span>
                      <h3 style={{ fontSize: '1rem', color: 'white', margin: '0.6rem 0 0 0', lineHeight: '1.4', fontWeight: 700 }}>
                        {product.name}
                      </h3>
                    </div>

                    <p style={{
                      color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '1rem',
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                      overflow: 'hidden', lineHeight: '1.6', flex: 1
                    }}>
                      {product.description}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--primary-accent)' }}>
                          रू {product.price?.toLocaleString() || 'N/A'}
                        </span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>NPR (INC. TAX)</span>
                      </div>
                      <div style={{ background: 'rgba(59,130,246,0.1)', padding: '0.5rem', borderRadius: '50%' }}>
                        <ArrowRight size={16} color="var(--primary-accent)" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
              <Package size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
              <h3 style={{ marginBottom: '0.5rem' }}>No products found</h3>
              <p style={{ fontSize: '0.9rem' }}>Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
