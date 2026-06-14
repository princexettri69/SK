import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { resolveImageUrl } from '../utils/resolveImage';
import { 
  Users, 
  Package, 
  Plus, 
  Trash2, 
  LayoutDashboard, 
  Search,
  Terminal as TerminalIcon,
  Activity,
  ShieldCheck,
  Database,
  ShoppingBag,
  Layers,
  Edit,
  X,
  Save,
  Clock,
  MapPin,
  Phone,
  ArrowRight,
  Menu,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 991);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 991);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  
  const [uploading, setUploading] = useState(false);
  const [logs, setLogs] = useState([]);

  const [newProduct, setNewProduct] = useState({ name: '', category: '', description: '', price: '', stock: '', imageUrl: '', features: '', specifications: '', variants: [], isCatalogOnly: false });

  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    imageUrl: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [usersRes, productsRes, categoriesRes, ordersRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/auth/users`, config),
        axios.get(`${import.meta.env.VITE_API_URL}/api/products`),
        axios.get(`${import.meta.env.VITE_API_URL}/api/categories`),
        axios.get(`${import.meta.env.VITE_API_URL}/api/orders`, config)
      ]);

      setUsers(usersRes.data.data.users);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
      if (ordersRes.data.length > orders.length && orders.length > 0) {
        addLog(`New procurement request detected: ${ordersRes.data[0]._id.slice(-6)}`, 'warning');
      }
      setOrders(ordersRes.data);
      
      if (categoriesRes.data.length > 0 && !newProduct.category) {
        setNewProduct(prev => ({ ...prev, category: categoriesRes.data[0].name }));
      }
    } catch (err) {
      console.error(err);
      toast.error('Sync failed');
      addLog('Failed to sync system data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addLog = (msg, type = 'info') => {
    setLogs(prev => [{ id: Date.now(), type, msg, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 50));
  };

  const handleImageUpload = async (file) => {
    if (!file) return null;
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data.imageUrl;
    } catch (err) {
      toast.error('Image upload failed');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Confirm product decommissioning?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Product removed');
      addLog(`Product purged: ${id}`, 'warning');
      fetchData();
    } catch (err) {
      toast.error('Decommissioning failed');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const productData = {
        ...newProduct,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock) || 20,
        isCatalogOnly: Boolean(newProduct.isCatalogOnly),
        features: typeof newProduct.features === 'string' ? newProduct.features.split(',').map(f => f.trim()).filter(f => f) : newProduct.features,
        specifications: typeof newProduct.specifications === 'string' ? newProduct.specifications.split(',').reduce((acc, curr) => {
          const [key, val] = curr.split(':').map(s => s.trim());
          if (key && val) acc[key] = val;
          return acc;
        }, {}) : newProduct.specifications
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/api/products`, productData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Asset deployed');
      addLog(`New asset: ${newProduct.name}`, 'success');
      setNewProduct({ name: '', category: categories[0]?.name || '', description: '', price: '', stock: '', imageUrl: '', features: '', specifications: '', variants: [], isCatalogOnly: false });
      setActiveTab('products');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Deployment failed');
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const productData = {
        ...editingProduct,
        price: Number(editingProduct.price),
        stock: Number(editingProduct.stock) || 0,
        isCatalogOnly: Boolean(editingProduct.isCatalogOnly),
        features: typeof editingProduct.features === 'string' ? editingProduct.features.split(',').map(f => f.trim()).filter(f => f) : editingProduct.features,
        specifications: typeof editingProduct.specifications === 'string' ? editingProduct.specifications.split(',').reduce((acc, curr) => {
          const [key, val] = curr.split(':').map(s => s.trim());
          if (key && val) acc[key] = val;
          return acc;
        }, {}) : editingProduct.specifications
      };

      await axios.patch(`${import.meta.env.VITE_API_URL}/api/products/${editingProduct._id}`, productData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Asset updated');
      setEditingProduct(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL}/api/categories`, newCategory, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Sector added');
      setNewCategory({ name: '', description: '', imageUrl: '' });
      fetchData();
    } catch (err) {
      toast.error('Sector creation failed');
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/categories/${editingCategory._id}`, editingCategory, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Sector updated');
      setEditingCategory(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Category update failed');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this sector? This may affect products.')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Sector removed');
      fetchData();
    } catch (err) {
      toast.error('Deletion failed');
    }
  };

  const handleVariantChange = (index, field, value, isEditing) => {
    const setter = isEditing ? setEditingProduct : setNewProduct;
    setter(prev => {
      const newVariants = [...(prev.variants || [])];
      if (field === 'price') value = Number(value) || 0;
      newVariants[index] = { ...newVariants[index], [field]: value };
      return { ...prev, variants: newVariants };
    });
  };
  const addVariant = (isEditing) => {
    const setter = isEditing ? setEditingProduct : setNewProduct;
    setter(prev => ({ ...prev, variants: [...(prev.variants || []), { size: '', price: '', unit: '' }] }));
  };
  const removeVariant = (index, isEditing) => {
    const setter = isEditing ? setEditingProduct : setNewProduct;
    setter(prev => {
      const newVariants = [...(prev.variants || [])];
      newVariants.splice(index, 1);
      return { ...prev, variants: newVariants };
    });
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/orders/${orderId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Order status updated');
      fetchData();
    } catch (err) {
      toast.error('Status update failed');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrders = orders.filter(o => 
    o.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
      <div className="loader"></div>
      <span style={{ marginLeft: '1rem', fontWeight: 600, color: 'var(--primary-accent)' }}>Initializing Control Panel...</span>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000 }}
            className="show-mobile"
          />
        )}
      </AnimatePresence>

      <div style={{ 
        width: '280px',
        minWidth: '280px',
        background: 'rgba(15, 23, 42, 0.95)', 
        borderRight: '1px solid var(--glass-border)',
        display: 'flex',
        flexDirection: 'column',
        position: isMobile ? 'fixed' : 'sticky',
        top: '80px',
        height: 'calc(100vh - 80px)',
        zIndex: 999,
        transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        left: isMobile ? (sidebarOpen ? 0 : '-280px') : 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ background: 'linear-gradient(135deg, var(--primary-accent), #2563eb)', padding: '0.6rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)' }}>
            <LayoutDashboard color="white" size={24} />
          </div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 900, letterSpacing: '-0.5px', color: 'white', margin: 0 }}>SK Admin</h2>
          {isMobile && (
            <button 
              onClick={() => setSidebarOpen(false)} 
              style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        <div className="custom-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          <SidebarLink icon={<LayoutDashboard size={20} />} label="Overview" active={activeTab === 'overview'} onClick={() => { setActiveTab('overview'); setSidebarOpen(false); }} />
          <SidebarLink icon={<Package size={20} />} label="Inventory" active={activeTab === 'products'} onClick={() => { setActiveTab('products'); setSidebarOpen(false); }} />
          <SidebarLink icon={<Layers size={20} />} label="Categories" active={activeTab === 'categories'} onClick={() => { setActiveTab('categories'); setSidebarOpen(false); }} />
          <SidebarLink icon={<ShoppingBag size={20} />} label="Orders" active={activeTab === 'orders'} onClick={() => { setActiveTab('orders'); setSidebarOpen(false); }} />
          <SidebarLink icon={<Users size={20} />} label="Customers" active={activeTab === 'users'} onClick={() => { setActiveTab('users'); setSidebarOpen(false); }} />
        </div>

        <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.85rem 1rem', borderRadius: '12px', border: 'none', background: 'rgba(255,255,255,0.03)', color: '#94a3b8', cursor: 'pointer', width: '100%', textAlign: 'left', fontWeight: 600, fontSize: '0.95rem', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background='rgba(255,255,255,0.08)'} onMouseOut={(e) => e.currentTarget.style.background='rgba(255,255,255,0.03)'}>
            <ExternalLink size={20} /> Back to Store
          </button>
        </div>
      </div>

      <div style={{ flex: 1, padding: 'clamp(1rem, 5vw, 3rem)', minWidth: 0 }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {isMobile && (
              <button 
                onClick={() => setSidebarOpen(true)}
                style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', cursor: 'pointer', display: 'flex' }}
              >
                <Menu size={24} />
              </button>
            )}
            <div>
              <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.25rem)', fontWeight: 900, textTransform: 'capitalize' }}>{activeTab}</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }} className="hidden-mobile">Enterprise Resource Management</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '0.5rem 1rem', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="hidden-mobile" style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', lineHeight: '1.2' }}>{user?.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--primary-accent)', fontWeight: 600 }}>Master Administrator</div>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-accent), #1e40af)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem', color: 'white', boxShadow: '0 4px 10px rgba(59,130,246,0.3)' }}>
              {user?.name?.charAt(0)}
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              <div className="grid grid-4" style={{ gap: '1.5rem' }}>
                <StatCard icon={<Package color="#3b82f6" />} label="Total Inventory" value={products.length} detail={`${products.length} items`} />
                <StatCard icon={<ShoppingBag color="#10b981" />} label="Recent Orders" value={orders.length} detail="System synchronized" />
                <StatCard icon={<Users color="#f59e0b" />} label="Total Users" value={users.length} detail="Active registry" />
                <StatCard icon={<Layers color="#8b5cf6" />} label="Categories" value={categories.length} detail="Sectorized catalog" />
              </div>
              
              <div className="card glass-dark" style={{ padding: '2.5rem', borderRadius: '24px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Activity size={20} color="#3b82f6" /> System Performance
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <MetricRow label="Database Sync" value="Optimal" progress={98} color="#10b981" />
                  <MetricRow label="Asset Health" value="Stable" progress={100} color="#3b82f6" />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card glass-dark" style={{ padding: '0', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
              <div style={{ padding: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>User Registry</h3>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', background: 'rgba(255,255,255,0.05)', padding: '0.4rem 1rem', borderRadius: '100px' }}>{filteredUsers.length} Users</span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.02)', textAlign: 'left' }}>
                      <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 800, letterSpacing: '0.5px' }}>USER</th>
                      <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 800, letterSpacing: '0.5px' }}>ROLE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s ease', cursor: 'default' }} onMouseOver={(e) => e.currentTarget.style.background='rgba(255,255,255,0.02)'} onMouseOut={(e) => e.currentTarget.style.background='transparent'}>
                        <td style={{ padding: '1.5rem 2rem' }}>
                          <div style={{ fontWeight: 700, color: 'white', marginBottom: '0.2rem' }}>{u.name}</div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{u.email}</div>
                        </td>
                        <td style={{ padding: '1.5rem 2rem' }}>
                          <span style={{ 
                            padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 900, letterSpacing: '0.5px',
                            background: u.role === 'admin' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255,255,255,0.05)',
                            color: u.role === 'admin' ? '#3b82f6' : '#94a3b8',
                            border: u.role === 'admin' ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid rgba(255,255,255,0.1)'
                          }}>{u.role.toUpperCase()}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'products' && (
            <motion.div key="products" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
                  <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  <input 
                    type="text" placeholder="Filter assets..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ padding: '1rem 1rem 1rem 3rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(15, 23, 42, 0.6)', color: 'white', width: '100%', outline: 'none' }} 
                  />
                </div>
                <button onClick={() => { setActiveTab('add-product'); setSidebarOpen(false); }} className="btn btn-primary" style={{ borderRadius: '12px', padding: '0.85rem 1.5rem' }}>
                  <Plus size={20} /> New Asset
                </button>
              </div>

              <div style={{ overflowX: 'auto', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }} className="card glass-dark">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.02)', textAlign: 'left' }}>
                      <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 800, letterSpacing: '0.5px' }}>IMAGE</th>
                      <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 800, letterSpacing: '0.5px' }}>DETAILS</th>
                      <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 800, letterSpacing: '0.5px' }}>VALUATION</th>
                      <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 800, letterSpacing: '0.5px' }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p) => (
                      <tr key={p._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s ease' }} onMouseOver={(e) => e.currentTarget.style.background='rgba(255,255,255,0.02)'} onMouseOut={(e) => e.currentTarget.style.background='transparent'}>
                        <td style={{ padding: '1rem 2rem' }}>
                          <img src={resolveImageUrl(p.imageUrl)} alt={p.name} style={{ width: '50px', height: '50px', objectFit: 'contain', background: 'white', borderRadius: '12px', padding: '6px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />
                        </td>
                        <td style={{ padding: '1rem 2rem' }}>
                          <div style={{ fontWeight: 700, color: 'white', marginBottom: '0.2rem' }}>{p.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', background: 'rgba(255,255,255,0.05)', display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '10px' }}>{p.category}</div>
                        </td>
                        <td style={{ padding: '1rem 2rem' }}>
                          <div style={{ fontWeight: 800, color: 'var(--primary-accent)', fontSize: '0.95rem' }}>रू {p.price.toLocaleString()}</div>
                        </td>
                        <td style={{ padding: '1rem 2rem' }}>
                          <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button onClick={() => setEditingProduct(p)} style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', padding: '0.5rem 0.85rem', borderRadius: '10px', color: '#3b82f6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.8rem', transition: 'all 0.2s' }}><Edit size={14} /> Edit</button>
                            <button onClick={() => handleDeleteProduct(p._id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', padding: '0.5rem 0.85rem', borderRadius: '10px', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.8rem', transition: 'all 0.2s' }}><Trash2 size={14} /> Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'categories' && (
            <motion.div key="categories" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Sectors</h3>
                <button onClick={() => { setActiveTab('add-category'); setSidebarOpen(false); }} className="btn btn-primary" style={{ borderRadius: '12px' }}>
                  <Plus size={20} /> New Sector
                </button>
              </div>

              <div className="grid grid-3" style={{ gap: '1.5rem' }}>
                {categories.map((c) => (
                  <div key={c._id} className="card glass-dark" style={{ padding: '1.5rem', borderRadius: '20px' }}>
                    <div style={{ height: '100px', borderRadius: '12px', background: 'white', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                      <img src={resolveImageUrl(c.imageUrl)} alt={c.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    </div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem' }}>{c.name}</h4>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                      <button onClick={() => setEditingCategory(c)} style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: '1px solid #3b82f6', color: '#3b82f6', background: 'transparent', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => handleDeleteCategory(c._id)} style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card glass-dark" style={{ padding: '0', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
              <div style={{ padding: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.01)' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Order Ledger</h3>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.02)', textAlign: 'left' }}>
                      <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 800, letterSpacing: '0.5px' }}>ORDER ID</th>
                      <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 800, letterSpacing: '0.5px' }}>CUSTOMER</th>
                      <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 800, letterSpacing: '0.5px' }}>TOTAL</th>
                      <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 800, letterSpacing: '0.5px' }}>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((o) => (
                      <tr key={o._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s ease' }} onMouseOver={(e) => e.currentTarget.style.background='rgba(255,255,255,0.02)'} onMouseOut={(e) => e.currentTarget.style.background='transparent'}>
                        <td style={{ padding: '1.5rem 2rem', fontWeight: 800, fontSize: '0.85rem', color: 'white' }}>
                          <span style={{ color: '#64748b', marginRight: '4px' }}>#</span>{o._id.slice(-8).toUpperCase()}
                        </td>
                        <td style={{ padding: '1.5rem 2rem' }}>
                          <div style={{ fontWeight: 700, color: 'white', marginBottom: '0.2rem' }}>{o.user?.name || 'Guest'}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{o.shippingAddress?.phone}</div>
                        </td>
                        <td style={{ padding: '1.5rem 2rem', fontWeight: 800, color: 'var(--primary-accent)' }}>रू {o.totalPrice.toLocaleString()}</td>
                        <td style={{ padding: '1.5rem 2rem' }}>
                          <select 
                            value={o.status} 
                            onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)}
                            style={{ 
                              padding: '0.5rem 1rem', borderRadius: '12px', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.5px', textTransform: 'uppercase',
                              background: o.status === 'Delivered' ? 'rgba(16, 185, 129, 0.15)' : o.status === 'Pending' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(59, 130, 246, 0.15)', 
                              border: o.status === 'Delivered' ? '1px solid rgba(16, 185, 129, 0.3)' : o.status === 'Pending' ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(59, 130, 246, 0.3)',
                              color: o.status === 'Delivered' ? '#10b981' : o.status === 'Pending' ? '#f59e0b' : '#3b82f6',
                              outline: 'none', cursor: 'pointer', appearance: 'none'
                            }}
                          >
                            <option value="Pending" style={{ background: '#0f172a', color: 'white' }}>PENDING</option>
                            <option value="Processing" style={{ background: '#0f172a', color: 'white' }}>PROCESSING</option>
                            <option value="Shipped" style={{ background: '#0f172a', color: 'white' }}>SHIPPED</option>
                            <option value="Delivered" style={{ background: '#0f172a', color: 'white' }}>DELIVERED</option>
                            <option value="Cancelled" style={{ background: '#0f172a', color: 'white' }}>CANCELLED</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'add-product' && (
            <motion.div key="add-product" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card glass-dark" style={{ padding: '3rem', borderRadius: '24px' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2.5rem', color: 'var(--primary-accent)' }}>Deploy New Product</h3>
              <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <AdminInput label="Product Name" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} placeholder="e.g. Premium Drill Machine" required />
                <div className="grid grid-3" style={{ gap: '2rem' }}>
                  <AdminInput label="Price (NPR)" type="number" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} placeholder="e.g. 5000" required />
                  <AdminInput label="Stock Quantity" type="number" value={newProduct.stock} onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})} placeholder="e.g. 20" required />
                  
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Item Type</label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', cursor: 'pointer', color: 'white' }}>
                      <input type="checkbox" checked={newProduct.isCatalogOnly} onChange={(e) => setNewProduct({...newProduct, isCatalogOnly: e.target.checked})} style={{ width: '20px', height: '20px', accentColor: 'var(--primary-accent)' }} />
                      <span style={{ fontWeight: 600 }}>Catalog Only (In-Store/Quote)</span>
                    </label>
                  </div>

                  <div style={{ width: '100%' }}>
                    <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.85rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Sector</label>
                    <select 
                      value={newProduct.category} 
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      style={{ width: '100%', padding: '1.1rem', borderRadius: '16px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }}
                    >
                      {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
                
                <AdminFilePicker label="Product Image" value={newProduct.imageUrl} uploading={uploading} onChange={async (file) => {
                  const url = await handleImageUpload(file);
                  if (url) setNewProduct(prev => ({...prev, imageUrl: url}));
                }} />

                <AdminInput label="Product Description" textarea value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} placeholder="Detailed overview of the product..." required />
                
                <div className="grid grid-2" style={{ gap: '2rem' }}>
                  <AdminInput label="Features (Comma separated)" textarea value={newProduct.features} onChange={(e) => setNewProduct({...newProduct, features: e.target.value})} placeholder="Waterproof, Weather resistant, Premium Wood, High Durability" />
                  <AdminInput label="Specifications (Key:Value, comma separated)" textarea value={newProduct.specifications} onChange={(e) => setNewProduct({...newProduct, specifications: e.target.value})} placeholder="Power: 20V, Weight: 1.5kg, Color: Yellow" />
                </div>

                <VariantsEditor 
                  variants={newProduct.variants} 
                  onChange={(idx, field, val) => handleVariantChange(idx, field, val, false)}
                  onAdd={() => addVariant(false)}
                  onRemove={(idx) => removeVariant(idx, false)}
                />

                <button type="submit" disabled={uploading} className="btn btn-primary" style={{ padding: '1.25rem', borderRadius: '16px', fontWeight: 800, opacity: uploading ? 0.7 : 1 }}>
                  {uploading ? 'Processing Image...' : 'Deploy Product'}
                </button>
              </form>
            </motion.div>
          )}

          {activeTab === 'add-category' && (
            <motion.div key="add-category" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card glass-dark" style={{ padding: '3rem', borderRadius: '24px' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2.5rem' }}>New Sector</h3>
              <form onSubmit={handleAddCategory} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <AdminInput label="Sector Name" value={newCategory.name} onChange={(e) => setNewCategory({...newCategory, name: e.target.value})} required />
                <AdminFilePicker label="Sector Image" value={newCategory.imageUrl} uploading={uploading} onChange={async (file) => {
                  const url = await handleImageUpload(file);
                  if (url) setNewCategory({...newCategory, imageUrl: url});
                }} />
                <AdminInput label="Overview" textarea value={newCategory.description} onChange={(e) => setNewCategory({...newCategory, description: e.target.value})} required />
                <button type="submit" className="btn btn-primary" style={{ padding: '1.25rem', borderRadius: '16px', fontWeight: 800 }}>Formalize</button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="card glass-dark" style={{ marginTop: '3rem', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <TerminalIcon size={18} color="#3b82f6" /> System Terminal
          </h3>
          <div style={{ height: '150px', overflowY: 'auto', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '1.25rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>
            {logs.map(log => (
              <div key={log.id} style={{ marginBottom: '0.5rem', color: log.type === 'error' ? '#ef4444' : log.type === 'warning' ? '#f59e0b' : log.type === 'success' ? '#10b981' : '#94a3b8' }}>
                [{log.time}] {log.type.toUpperCase()}: {log.msg}
              </div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {editingProduct && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingProduct(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="card glass-dark" style={{ width: '100%', maxWidth: '700px', position: 'relative', zIndex: 2001, maxHeight: '90vh', overflowY: 'auto', padding: '3rem', borderRadius: '32px' }}>
              <button onClick={() => setEditingProduct(null)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: 'white' }}><X size={28} /></button>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2.5rem' }}>Update Asset</h3>
              <form onSubmit={handleUpdateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <AdminInput label="Product Name" value={editingProduct.name} onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} required />
                <div className="grid grid-2" style={{ gap: '2rem' }}>
                  <AdminInput label="Price (NPR)" type="number" value={editingProduct.price} onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})} required />
                  <AdminInput label="Stock Quantity" type="number" value={editingProduct.stock || ''} onChange={(e) => setEditingProduct({...editingProduct, stock: e.target.value})} required />
                  
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Item Type</label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', cursor: 'pointer', color: 'white' }}>
                      <input type="checkbox" checked={editingProduct.isCatalogOnly || false} onChange={(e) => setEditingProduct({...editingProduct, isCatalogOnly: e.target.checked})} style={{ width: '20px', height: '20px', accentColor: 'var(--primary-accent)' }} />
                      <span style={{ fontWeight: 600 }}>Catalog Only (In-Store/Quote)</span>
                    </label>
                  </div>
                </div>
                
                <AdminFilePicker label="Update Image" value={editingProduct.imageUrl} uploading={uploading} onChange={async (file) => {
                  const url = await handleImageUpload(file);
                  if (url) setEditingProduct(prev => ({...prev, imageUrl: url}));
                }} />

                <AdminInput label="Description" textarea value={editingProduct.description} onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})} required />
                
                <div className="grid grid-2" style={{ gap: '2rem' }}>
                  <AdminInput label="Features (Comma separated)" textarea value={typeof editingProduct.features === 'string' ? editingProduct.features : editingProduct.features?.join(', ')} onChange={(e) => setEditingProduct({...editingProduct, features: e.target.value})} />
                  <AdminInput label="Specifications (Key:Value, comma separated)" textarea value={typeof editingProduct.specifications === 'string' ? editingProduct.specifications : (editingProduct.specifications ? Object.entries(editingProduct.specifications).map(([k,v]) => `${k}:${v}`).join(', ') : '')} onChange={(e) => setEditingProduct({...editingProduct, specifications: e.target.value})} />
                </div>

                <VariantsEditor 
                  variants={editingProduct.variants} 
                  onChange={(idx, field, val) => handleVariantChange(idx, field, val, true)}
                  onAdd={() => addVariant(true)}
                  onRemove={(idx) => removeVariant(idx, true)}
                />

                <button type="submit" disabled={uploading} className="btn btn-primary" style={{ padding: '1rem', fontWeight: 700, opacity: uploading ? 0.7 : 1 }}>
                  <Save size={18} /> {uploading ? 'Processing Image...' : 'Save Changes'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingCategory && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingCategory(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="card glass-dark" style={{ width: '100%', maxWidth: '500px', position: 'relative', zIndex: 2001, padding: '3rem', borderRadius: '32px' }}>
              <button onClick={() => setEditingCategory(null)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: 'white' }}><X size={28} /></button>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2.5rem' }}>Edit Sector</h3>
              <form onSubmit={handleUpdateCategory} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <AdminInput label="Name" value={editingCategory.name} onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})} required />
                <AdminInput label="Description" textarea value={editingCategory.description} onChange={(e) => setEditingCategory({...editingCategory, description: e.target.value})} required />
                <AdminFilePicker label="Update Image" value={editingCategory.imageUrl} uploading={uploading} onChange={async (file) => {
                  const url = await handleImageUpload(file);
                  if (url) setEditingCategory({...editingCategory, imageUrl: url});
                }} />
                <button type="submit" className="btn btn-primary" style={{ padding: '1rem', fontWeight: 700 }}><Save size={18} /> Update Sector</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SidebarLink = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    style={{
      display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', borderRadius: '12px', border: 'none',
      background: active ? 'linear-gradient(90deg, rgba(59,130,246,0.15) 0%, rgba(59,130,246,0.05) 100%)' : 'transparent',
      color: active ? '#60a5fa' : '#94a3b8',
      cursor: 'pointer', width: '100%', textAlign: 'left', transition: 'all 0.3s ease', 
      fontWeight: active ? 800 : 500, fontSize: '0.95rem',
      borderLeft: active ? '3px solid #3b82f6' : '3px solid transparent'
    }}
  >
    {icon}
    {label}
  </button>
);

const StatCard = ({ icon, label, value, detail }) => (
  <motion.div whileHover={{ y: -5 }} className="card glass-dark" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', background: 'linear-gradient(180deg, rgba(30,41,59,0.7) 0%, rgba(15,23,42,0.8) 100%)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ padding: '1rem', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
      <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 900, background: 'rgba(16, 185, 129, 0.1)', padding: '0.4rem 0.75rem', borderRadius: '100px', letterSpacing: '0.5px' }}>LIVE</span>
    </div>
    <div>
      <p style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 800, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
      <h3 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', letterSpacing: '-1px' }}>{value}</h3>
      <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.75rem', fontWeight: 500 }}>{detail}</p>
    </div>
  </motion.div>
);

const MetricRow = ({ label, value, progress, color }) => (
  <div style={{ width: '100%' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#94a3b8' }}>{label}</span>
      <span style={{ fontSize: '1rem', fontWeight: 900, color: 'white' }}>{value}</span>
    </div>
    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
      <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} style={{ height: '100%', background: color }} />
    </div>
  </div>
);

const AdminFilePicker = ({ label, value, onChange, uploading }) => (
  <div style={{ width: '100%' }}>
    <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.85rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>{label}</label>
    <div style={{ 
      width: '100%', position: 'relative', height: '120px', borderRadius: '16px', 
      background: 'rgba(15, 23, 42, 0.4)', border: '2px dashed rgba(255,255,255,0.1)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
    }}>
      <input type="file" accept="image/*" onChange={(e) => onChange(e.target.files[0])} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
      {value ? (
        <img src={resolveImageUrl(value)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '1rem' }} />
      ) : (
        <div style={{ textAlign: 'center', color: '#64748b' }}>
          {uploading ? <div className="animate-spin">⌛</div> : <><Plus size={32} /><p>Upload</p></>}
        </div>
      )}
    </div>
  </div>
);

const AdminInput = ({ label, textarea, required, ...props }) => (
  <div style={{ width: '100%' }}>
    <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.85rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>{label} {required && <span style={{ color: '#ef4444' }}>*</span>}</label>
    {textarea ? (
      <textarea {...props} style={{ width: '100%', padding: '1.1rem', borderRadius: '16px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none', minHeight: '120px', resize: 'vertical' }} />
    ) : (
      <input {...props} style={{ width: '100%', padding: '1.1rem', borderRadius: '16px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} />
    )}
  </div>
);

const VariantsEditor = ({ variants, onChange, onAdd, onRemove }) => (
  <div style={{ marginTop: '1rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
    <h4 style={{ marginBottom: '1rem', color: 'var(--primary-accent)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Product Variants (Optional)</h4>
    <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>Add different sizes/options with specific pricing.</p>
    {variants && variants.map((v, idx) => (
      <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
        <input placeholder="Size (e.g. 18mm)" value={v.size} onChange={e => onChange(idx, 'size', e.target.value)} style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} />
        <input placeholder="Price (e.g. 75)" type="number" value={v.price} onChange={e => onChange(idx, 'price', e.target.value)} style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} />
        <input placeholder="Unit (e.g. per sq ft)" value={v.unit} onChange={e => onChange(idx, 'unit', e.target.value)} style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} />
        <button type="button" onClick={() => onRemove(idx)} style={{ padding: '0.5rem', background: 'rgba(239,68,68,0.2)', color: '#ef4444', border: 'none', borderRadius: '8px', cursor: 'pointer' }}><Trash2 size={16} /></button>
      </div>
    ))}
    <button type="button" onClick={onAdd} style={{ padding: '0.75rem 1.5rem', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>+ Add Variant</button>
  </div>
);

export default AdminDashboard;
