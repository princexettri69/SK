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
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../components/AuthContext';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    fetchData();
  }, [activeTab]);
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

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    imageUrl: '',
    features: '',
    specifications: ''
  });

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
      
      // addLog('System synchronization complete', 'success');
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

  // --- Product Handlers ---
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
      setNewProduct({ name: '', category: categories[0]?.name || '', description: '', price: '', imageUrl: '', features: '', specifications: '' });
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
      toast.error('Update failed');
    }
  };

  // --- Category Handlers ---
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
      toast.error('Update failed');
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

  // --- Order Handlers ---
  const handleUpdateOrderStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/orders/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Order status updated');
      fetchData();
    } catch (err) {
      toast.error('Status update failed');
    }
  };

  // --- Filtering ---
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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#020617' }}>
      <div className="loader"></div>
      <span style={{ marginLeft: '1rem', fontWeight: 600, color: '#3b82f6' }}>Initializing Control Panel...</span>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc', paddingTop: '80px', fontFamily: "'Outfit', sans-serif" }}>
      {/* Sidebar */}
      <div style={{ 
        width: '280px', borderRight: '1px solid rgba(255,255,255,0.05)', padding: '2.5rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem',
        backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(20px)', position: 'fixed', height: 'calc(100vh - 80px)', zIndex: 50
      }} className="desktop-only">
        <div style={{ marginBottom: '2rem', padding: '0 0.75rem' }}>
          <h2 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px' }}>Main Navigation</h2>
        </div>
        <SidebarLink icon={<LayoutDashboard size={18} />} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
        <SidebarLink icon={<Users size={18} />} label="User Registry" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
        <SidebarLink icon={<Package size={18} />} label="Asset Catalog" active={activeTab === 'products'} onClick={() => setActiveTab('products')} />
        <SidebarLink icon={<Layers size={18} />} label="Sectors" active={activeTab === 'categories'} onClick={() => setActiveTab('categories')} />
        <SidebarLink icon={<ShoppingBag size={18} />} label="Procurement" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
        
        <div style={{ margin: '1.5rem 0', height: '1px', background: 'rgba(255,255,255,0.05)' }}></div>
        
        <SidebarLink icon={<Plus size={18} />} label="New Deployment" active={activeTab === 'add-product'} onClick={() => setActiveTab('add-product')} />
        <SidebarLink icon={<TerminalIcon size={18} />} label="System Terminal" active={activeTab === 'terminal'} onClick={() => setActiveTab('terminal')} />
        
        <div style={{ marginTop: 'auto', padding: '1.25rem', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05))', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 10px #10b981' }}></div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', letterSpacing: '1px' }}>CORE SECURE</span>
          </div>
          <p style={{ fontSize: '0.7rem', color: '#94a3b8', lineHeight: '1.4' }}>All encrypted nodes are operational and synchronized.</p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '3rem', marginLeft: '280px' }} className="mobile-full-padding">
        <header style={{ marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#3b82f6', marginBottom: '0.75rem' }}>
              <Activity size={16} />
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px' }}>Terminal v1.2 // Root Access</span>
            </motion.div>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-2px', color: 'white' }}>
              Dashboard<span style={{ color: '#3b82f6' }}>.</span>
            </h1>
          </div>
          
          <div style={{ position: 'relative', display: 'flex', gap: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input 
                type="text" placeholder="Search system nodes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                style={{ 
                  padding: '1rem 1rem 1rem 3rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', 
                  background: 'rgba(30, 41, 59, 0.5)', color: 'white', width: '380px', outline: 'none', transition: 'all 0.3s ease',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
                }} 
                className="focus-ring"
              />
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              <div className="grid grid-4" style={{ gap: '1.5rem' }}>
                <StatCard icon={<Users color="#3b82f6" />} label="Active Users" value={users.length} detail="+12% from last cycle" />
                <StatCard icon={<Package color="#10b981" />} label="Asset Catalog" value={products.length} detail="24 unique identifiers" />
                <StatCard icon={<ShoppingBag color="#f59e0b" />} label="Total Orders" value={orders.length} detail="High demand detected" />
                <StatCard icon={<Database color="#ec4899" />} label="System Pulse" value="Optimal" detail="All clusters healthy" />
              </div>
              
              <div className="card glass-dark" style={{ padding: '2.5rem', borderRadius: '24px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Activity size={20} color="#3b82f6" /> System Performance Overview
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <MetricRow label="Database Latency" value="12ms" progress={92} color="#10b981" />
                  <MetricRow label="Asset Synchronization" value="Synchronized" progress={100} color="#3b82f6" />
                  <MetricRow label="Order Fulfillment Rate" value="98.4%" progress={98} color="#f59e0b" />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card glass-dark" style={{ padding: '0', borderRadius: '24px', overflow: 'hidden' }}>
              <div style={{ padding: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Master User Registry</h3>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>{filteredUsers.length} NODES DETECTED</span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.02)', textAlign: 'left' }}>
                      <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', color: '#64748b', fontWeight: 800, letterSpacing: '1px' }}>USER IDENTITY</th>
                      <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', color: '#64748b', fontWeight: 800, letterSpacing: '1px' }}>SECURITY LEVEL</th>
                      <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', color: '#64748b', fontWeight: 800, letterSpacing: '1px' }}>INITIALIZATION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }} className="hover-row">
                        <td style={{ padding: '1.5rem 2rem' }}>
                          <div style={{ fontWeight: 700, color: 'white', fontSize: '1rem' }}>{u.name}</div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>{u.email}</div>
                        </td>
                        <td style={{ padding: '1.5rem 2rem' }}>
                          <span style={{ 
                            padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 900, letterSpacing: '1px',
                            background: u.role === 'admin' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255,255,255,0.05)',
                            color: u.role === 'admin' ? '#3b82f6' : '#94a3b8',
                            border: `1px solid ${u.role === 'admin' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255,255,255,0.1)'}`
                          }}>
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: '1.5rem 2rem', color: '#64748b', fontSize: '0.85rem', fontWeight: 500 }}>{new Date(u.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'products' && (
            <motion.div key="products" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-4" style={{ gap: '1.5rem' }}>
              {filteredProducts.map((p) => (
                <div key={p._id} className="card glass-dark hover-scale" style={{ padding: '0', borderRadius: '20px', overflow: 'hidden', position: 'relative', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem', zIndex: 10 }}>
                    <button onClick={() => setEditingProduct(p)} style={{ background: 'rgba(30, 41, 59, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '10px', padding: '0.6rem', color: '#3b82f6', cursor: 'pointer' }}>
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDeleteProduct(p._id)} style={{ background: 'rgba(30, 41, 59, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', padding: '0.6rem', color: '#ef4444', cursor: 'pointer' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div style={{ background: 'white', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
                    <img src={p.imageUrl} alt={p.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    <div style={{ fontSize: '0.7rem', color: '#3b82f6', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>{p.category}</div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.75rem', color: 'white', lineHeight: '1.3' }}>{p.name}</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{ color: '#f8fafc', fontWeight: 900, fontSize: '1.25rem' }}>रू {p.price?.toLocaleString()}</p>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Database size={12} /> {Math.floor(Math.random() * 50) + 10} in stock
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'categories' && (
            <motion.div key="categories" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-2" style={{ gap: '2.5rem' }}>
              <div className="card glass-dark" style={{ padding: '3rem', borderRadius: '28px' }}>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '2.5rem', color: 'white' }}>Expand Sectors</h3>
                <form onSubmit={handleAddCategory} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <AdminInput label="Sector Designation" value={newCategory.name} onChange={(e) => setNewCategory({...newCategory, name: e.target.value})} placeholder="e.g. Smart Automation" required />
                  <AdminInput label="Functional Overview" textarea value={newCategory.description} onChange={(e) => setNewCategory({...newCategory, description: e.target.value})} placeholder="Define this market sector..." />
                  <AdminFilePicker 
                    label="Sector Visual Identifier" 
                    value={newCategory.imageUrl} 
                    uploading={uploading}
                    onChange={async (file) => {
                      const url = await handleImageUpload(file);
                      if (url) setNewCategory({...newCategory, imageUrl: url});
                    }}
                  />
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.25rem', borderRadius: '16px', fontWeight: 800, fontSize: '1.1rem' }}>Deploy Sector Asset</button>
                </form>
              </div>
              <div className="card glass-dark" style={{ padding: '3rem', borderRadius: '28px' }}>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '2.5rem', color: 'white' }}>Market Sectors</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {categories.map(c => (
                    <div key={c._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', transition: 'transform 0.2s' }} className="hover-lift">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', overflow: 'hidden' }}>
                          {c.imageUrl ? <img src={resolveImageUrl(c.imageUrl)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Layers size={24} />}
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, color: 'white', fontSize: '1.1rem' }}>{c.name}</div>
                          <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>{c.description || 'No sectoral description provided'}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button onClick={() => setEditingCategory(c)} style={{ background: 'transparent', border: 'none', color: '#3b82f6', cursor: 'pointer', padding: '0.5rem' }}><Edit size={18} /></button>
                        <button onClick={() => handleDeleteCategory(c._id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem' }}><Trash2 size={18} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card glass-dark" style={{ padding: '0', borderRadius: '24px', overflow: 'hidden' }}>
              <div style={{ padding: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Procurement Ledger</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ padding: '0.5rem 1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '10px', fontSize: '0.7rem', color: '#10b981', fontWeight: 800 }}>SYNCED</div>
                </div>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.02)', textAlign: 'left' }}>
                      <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', color: '#64748b', fontWeight: 800, letterSpacing: '1px' }}>LEDGER ID</th>
                      <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', color: '#64748b', fontWeight: 800, letterSpacing: '1px' }}>CUSTOMER ENTITY</th>
                      <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', color: '#64748b', fontWeight: 800, letterSpacing: '1px' }}>VALUATION</th>
                      <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', color: '#64748b', fontWeight: 800, letterSpacing: '1px' }}>LIFECYCLE</th>
                      <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', color: '#64748b', fontWeight: 800, letterSpacing: '1px' }}>OPERATIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((o) => (
                      <tr key={o._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }} className="hover-row">
                        <td style={{ padding: '1.5rem 2rem', fontSize: '0.8rem', fontFamily: 'monospace', color: '#3b82f6', fontWeight: 700 }}>#{o._id.slice(-8).toUpperCase()}</td>
                        <td style={{ padding: '1.5rem 2rem' }}>
                          <div style={{ fontWeight: 800, color: 'white', fontSize: '1rem' }}>{o.user?.name || 'Authorized Guest'}</div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Phone size={12} /> {o.shippingAddress?.phone} <span style={{ opacity: 0.3 }}>|</span> <MapPin size={12} /> {o.shippingAddress?.city}
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.75rem' }}>
                            {o.items?.map((item, i) => (
                              <span key={i} style={{ fontSize: '0.6rem', background: 'rgba(59, 130, 246, 0.08)', color: '#60a5fa', padding: '0.25rem 0.6rem', borderRadius: '6px', border: '1px solid rgba(59, 130, 246, 0.15)', fontWeight: 700 }}>
                                {item.product?.name?.split(' ').slice(0, 2).join(' ')} ×{item.quantity}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td style={{ padding: '1.5rem 2rem', fontWeight: 900, color: 'white', fontSize: '1.1rem' }}>रू {o.totalPrice?.toLocaleString()}</td>
                        <td style={{ padding: '1.5rem 2rem' }}>
                          <span style={{ 
                            padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 900, letterSpacing: '1.5px',
                            background: o.status === 'Delivered' ? 'rgba(16, 185, 129, 0.1)' : o.status === 'Cancelled' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                            color: o.status === 'Delivered' ? '#10b981' : o.status === 'Cancelled' ? '#ef4444' : '#f59e0b',
                            border: `1px solid ${o.status === 'Delivered' ? 'rgba(16, 185, 129, 0.2)' : o.status === 'Cancelled' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`
                          }}>{o.status.toUpperCase()}</span>
                        </td>
                        <td style={{ padding: '1.5rem 2rem' }}>
                          <select 
                            value={o.status} 
                            onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)}
                            style={{ 
                              background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: 'white', 
                              borderRadius: '12px', padding: '0.6rem 1rem', fontSize: '0.8rem', outline: 'none', cursor: 'pointer',
                              fontWeight: 600, boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                            }}
                          >
                            <option value="Pending">Pending Review</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Dispatched</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Void Order</option>
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
            <motion.div key="add-product" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="card glass-dark" style={{ maxWidth: '960px', margin: '0 auto', padding: '4rem', borderRadius: '32px' }}>
              <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', letterSpacing: '-1px' }}>Asset Deployment</h2>
                <p style={{ color: '#64748b', marginTop: '0.5rem', fontSize: '1.1rem' }}>Initialize new product parameters into the marketplace global registry</p>
              </div>
              <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                <div className="grid grid-2" style={{ gap: '2.5rem' }}>
                  <AdminInput label="Asset Designation" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} placeholder="e.g. S.K Premium Series" required />
                  <div>
                    <label style={{ display: 'block', marginBottom: '1rem', fontSize: '0.85rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Operational Sector</label>
                    <select 
                      value={newProduct.category} 
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      style={{ 
                        width: '100%', padding: '1.1rem', borderRadius: '16px', background: 'rgba(15, 23, 42, 0.6)', 
                        border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontWeight: 600, fontSize: '1rem', outline: 'none'
                      }}
                    >
                      {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-2" style={{ gap: '2.5rem' }}>
                  <AdminInput label="Market Valuation (NPR)" type="number" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} placeholder="25000" required />
                  <AdminFilePicker 
                    label="Asset Visual Deployment" 
                    value={newProduct.imageUrl} 
                    uploading={uploading}
                    onChange={async (file) => {
                      const url = await handleImageUpload(file);
                      if (url) setNewProduct({...newProduct, imageUrl: url});
                    }}
                  />
                </div>
                <AdminInput label="Technical Overview & Specifications" textarea value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} placeholder="Detailed functional description..." required />
                <button type="submit" className="btn btn-primary" style={{ padding: '1.5rem', fontWeight: 900, borderRadius: '20px', fontSize: '1.2rem', boxShadow: '0 10px 20px rgba(59, 130, 246, 0.2)' }}>Deploy to Marketplace Core</button>
              </form>
            </motion.div>
          )}

          {activeTab === 'terminal' && (
            <motion.div key="terminal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card" style={{ background: '#020617', border: '1px solid #1e293b', padding: '0', borderRadius: '24px', overflow: 'hidden', height: '650px', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
              <div style={{ padding: '1rem 2rem', background: '#0f172a', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }}></div>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }}></div>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }}></div>
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', fontFamily: 'monospace', marginLeft: '1rem' }}>admin@sktrade_core:~ system_monitor</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#3b82f6', fontWeight: 800 }}>LIVE_FEED</div>
              </div>
              <div style={{ padding: '2rem', flex: 1, overflowY: 'auto', fontFamily: "'Fira Code', monospace", fontSize: '0.9rem', color: '#94a3b8', lineHeight: '1.8' }} className="custom-scrollbar">
                {logs.length === 0 ? (
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', color: '#334155' }}>
                    <TerminalIcon size={48} />
                    <p>Listening for system interrupts...</p>
                  </div>
                ) : (
                  logs.map(log => (
                    <div key={log.id} style={{ marginBottom: '0.5rem', display: 'flex', gap: '1rem' }}>
                      <span style={{ color: '#334155', minWidth: '100px' }}>[{log.time}]</span>
                      <span style={{ 
                        color: log.type === 'error' ? '#ef4444' : log.type === 'success' ? '#10b981' : log.type === 'warning' ? '#f59e0b' : '#3b82f6', 
                        fontWeight: 800, minWidth: '80px' 
                      }}>
                        {log.type.toUpperCase()}
                      </span>
                      <span style={{ color: '#f8fafc' }}>{log.msg}</span>
                    </div>
                  ))
                )}
                <div style={{ marginTop: '1rem', display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{ color: '#3b82f6', fontWeight: 900 }}>$</span>
                  <span className="cursor-blink" style={{ width: '10px', height: '20px', background: '#3b82f6', display: 'inline-block' }}></span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Edit Product Modal */}
      <AnimatePresence>
        {editingProduct && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingProduct(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(2, 6, 23, 0.8)', backdropFilter: 'blur(12px)' }} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="card glass-dark" style={{ maxWidth: '850px', width: '100%', padding: '3.5rem', position: 'relative', borderRadius: '32px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <button onClick={() => setEditingProduct(null)} style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#94a3b8', cursor: 'pointer', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="hover-rotate"><X size={24} /></button>
              <div style={{ marginBottom: '3rem' }}>
                <h3 style={{ fontSize: '2rem', fontWeight: 900, color: 'white', letterSpacing: '-1px' }}>Update Asset Parameters</h3>
                <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Modifying registry entry for: <span style={{ color: '#3b82f6', fontWeight: 700 }}>{editingProduct.name}</span></p>
              </div>
              <form onSubmit={handleUpdateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="grid grid-2" style={{ gap: '2rem' }}>
                  <AdminInput label="Asset Designation" value={editingProduct.name} onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} required />
                  <div>
                    <label style={{ display: 'block', marginBottom: '1rem', fontSize: '0.85rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Market Sector</label>
                    <select 
                      value={editingProduct.category} 
                      onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                      style={{ 
                        width: '100%', padding: '1.1rem', borderRadius: '16px', background: 'rgba(15, 23, 42, 0.6)', 
                        border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontWeight: 600, fontSize: '1rem', outline: 'none'
                      }}
                    >
                      {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-2" style={{ gap: '2rem' }}>
                  <AdminInput label="Current Valuation" type="number" value={editingProduct.price} onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})} required />
                  <AdminFilePicker 
                    label="Update Visual Asset" 
                    value={editingProduct.imageUrl} 
                    uploading={uploading}
                    onChange={async (file) => {
                      const url = await handleImageUpload(file);
                      if (url) setEditingProduct({...editingProduct, imageUrl: url});
                    }}
                  />
                </div>
                <AdminInput label="Technical Overview" textarea value={editingProduct.description} onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})} required />
                <button type="submit" className="btn btn-primary" style={{ padding: '1.25rem', fontWeight: 900, borderRadius: '16px', fontSize: '1.1rem', marginTop: '1rem' }}><Save size={20} style={{ marginRight: '10px' }} /> Commit Parameter Updates</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Category Modal */}
      <AnimatePresence>
        {editingCategory && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingCategory(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(2, 6, 23, 0.8)', backdropFilter: 'blur(12px)' }} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="card glass-dark" style={{ maxWidth: '500px', width: '100%', padding: '2.5rem', position: 'relative', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <button onClick={() => setEditingCategory(null)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={24} /></button>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>Update Sector: {editingCategory.name}</h3>
              <form onSubmit={handleUpdateCategory} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <AdminInput label="Sector Name" value={editingCategory.name} onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})} required />
                <AdminInput label="Description" textarea value={editingCategory.description} onChange={(e) => setEditingCategory({...editingCategory, description: e.target.value})} />
                <AdminFilePicker 
                  label="Update Sector Visual" 
                  value={editingCategory.imageUrl} 
                  uploading={uploading}
                  onChange={async (file) => {
                    const url = await handleImageUpload(file);
                    if (url) setEditingCategory({...editingCategory, imageUrl: url});
                  }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '1rem', fontWeight: 700 }}><Save size={18} style={{ marginRight: '8px' }} /> Commit Sector Updates</button>
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
      background: active ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
      color: active ? '#3b82f6' : '#94a3b8',
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
  <motion.div whileHover={{ y: -5 }} className="card glass-dark" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.03)' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ padding: '0.85rem', borderRadius: '14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>{icon}</div>
      <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 900, background: 'rgba(16, 185, 129, 0.1)', padding: '0.35rem 0.6rem', borderRadius: '6px', letterSpacing: '1px' }}>LIVE</span>
    </div>
    <div>
      <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
      <h3 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', letterSpacing: '-1px' }}>{value}</h3>
      <p style={{ fontSize: '0.8rem', color: '#475569', marginTop: '0.6rem', fontWeight: 500 }}>{detail}</p>
    </div>
  </motion.div>
);

const MetricRow = ({ label, value, progress, color }) => (
  <div style={{ width: '100%' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', alignItems: 'flex-end' }}>
      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#94a3b8' }}>{label}</span>
      <span style={{ fontSize: '1rem', fontWeight: 900, color: 'white' }}>{value}</span>
    </div>
    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1.5, ease: "circOut" }}
        style={{ height: '100%', background: color, boxShadow: `0 0 15px ${color}` }} 
      />
    </div>
  </div>
);

const AdminFilePicker = ({ label, value, onChange, uploading }) => (
  <div style={{ width: '100%' }}>
    <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.85rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</label>
    <div style={{ 
      width: '100%', position: 'relative', height: '140px', borderRadius: '16px', 
      background: 'rgba(15, 23, 42, 0.4)', border: '2px dashed rgba(255,255,255,0.1)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', cursor: 'pointer', transition: 'all 0.3s'
    }} className="hover-lift">
      <input 
        type="file" 
        accept="image/*"
        onChange={(e) => onChange(e.target.files[0])}
        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 10 }} 
      />
      {value ? (
        <img src={resolveImageUrl(value)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '1rem' }} />
      ) : (
        <div style={{ textAlign: 'center', color: '#64748b' }}>
          {uploading ? (
            <div className="animate-spin" style={{ width: '24px', height: '24px', border: '3px solid rgba(59, 130, 246, 0.3)', borderTopColor: '#3b82f6', borderRadius: '50%', margin: '0 auto mb-2' }}></div>
          ) : (
            <>
              <Plus size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
              <p style={{ fontSize: '0.8rem', fontWeight: 700 }}>Deploy Local Asset</p>
            </>
          )}
        </div>
      )}
    </div>
    {value && !uploading && (
      <p style={{ fontSize: '0.7rem', color: '#3b82f6', marginTop: '0.5rem', fontWeight: 700, textAlign: 'center' }}>IMAGE SYNCED</p>
    )}
  </div>
);

const AdminInput = ({ label, textarea, ...props }) => (
  <div style={{ width: '100%' }}>
    <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.85rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</label>
    {textarea ? (
      <textarea 
        {...props} 
        style={{ 
          width: '100%', padding: '1.25rem', borderRadius: '16px', background: 'rgba(15, 23, 42, 0.6)', 
          border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontWeight: 600, fontSize: '1rem', 
          outline: 'none', minHeight: '150px', resize: 'vertical'
        }} 
      />
    ) : (
      <input 
        {...props} 
        style={{ 
          width: '100%', padding: '1.1rem', borderRadius: '16px', background: 'rgba(15, 23, 42, 0.6)', 
          border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontWeight: 600, fontSize: '1rem', outline: 'none'
        }} 
      />
    )}
  </div>
);

export default AdminDashboard;
