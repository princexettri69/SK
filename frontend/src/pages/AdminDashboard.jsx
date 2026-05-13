import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  
  const [logs, setLogs] = useState([
    { id: 1, type: 'info', msg: 'Admin System Initialized', time: new Date().toLocaleTimeString() },
    { id: 2, type: 'success', msg: 'Database Connection Secure', time: new Date().toLocaleTimeString() }
  ]);

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
      setOrders(ordersRes.data);
      
      if (categoriesRes.data.length > 0 && !newProduct.category) {
        setNewProduct(prev => ({ ...prev, category: categoriesRes.data[0].name }));
      }
      
      addLog('System synchronization complete', 'success');
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
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc', paddingTop: '80px' }}>
      {/* Sidebar */}
      <div style={{ 
        width: '260px', borderRight: '1px solid rgba(255,255,255,0.05)', padding: '2rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem',
        backgroundColor: '#0f172a', position: 'fixed', height: 'calc(100vh - 80px)', zIndex: 50
      }} className="desktop-only">
        <SidebarLink icon={<LayoutDashboard size={18} />} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
        <SidebarLink icon={<Users size={18} />} label="Users" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
        <SidebarLink icon={<Package size={18} />} label="Products" active={activeTab === 'products'} onClick={() => setActiveTab('products')} />
        <SidebarLink icon={<Layers size={18} />} label="Categories" active={activeTab === 'categories'} onClick={() => setActiveTab('categories')} />
        <SidebarLink icon={<ShoppingBag size={18} />} label="Orders" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
        <SidebarLink icon={<Plus size={18} />} label="Add Product" active={activeTab === 'add-product'} onClick={() => setActiveTab('add-product')} />
        <SidebarLink icon={<TerminalIcon size={18} />} label="System Logs" active={activeTab === 'terminal'} onClick={() => setActiveTab('terminal')} />
        
        <div style={{ marginTop: 'auto', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <ShieldCheck size={16} color="#10b981" />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981' }}>SYSTEM SECURE</span>
          </div>
          <p style={{ fontSize: '0.7rem', color: '#64748b' }}>v1.2.0 | Stable</p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '2.5rem', marginLeft: '260px' }} className="mobile-full-padding">
        <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#3b82f6', marginBottom: '0.5rem' }}>
              <Activity size={16} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Global Administrator</span>
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px' }}>Dashboard</h1>
          </div>
          
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input 
              type="text" placeholder="Global system search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: '#1e293b', color: 'white', width: '320px', outline: 'none' }} 
            />
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-4" style={{ gap: '1.5rem' }}>
              <StatCard icon={<Users color="#3b82f6" />} label="Users" value={users.length} detail="Active accounts" />
              <StatCard icon={<Package color="#10b981" />} label="Products" value={products.length} detail="Live assets" />
              <StatCard icon={<ShoppingBag color="#f59e0b" />} label="Orders" value={orders.length} detail="Total requests" />
              <StatCard icon={<Database color="#ec4899" />} label="Status" value="Healthy" detail="Primary Cluster" />
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card glass-dark" style={{ padding: '0' }}>
              <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Registry: Users</h3>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.02)', textAlign: 'left' }}>
                      <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', color: '#64748b' }}>IDENTITY</th>
                      <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', color: '#64748b' }}>ACCESS LEVEL</th>
                      <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', color: '#64748b' }}>TIMESTAMP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        <td style={{ padding: '1.25rem 1.5rem' }}>
                          <div style={{ fontWeight: 600 }}>{u.name}</div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{u.email}</div>
                        </td>
                        <td style={{ padding: '1.25rem 1.5rem' }}>
                          <span className={`badge ${u.role === 'admin' ? 'badge-primary' : 'badge-outline'}`}>{u.role.toUpperCase()}</span>
                        </td>
                        <td style={{ padding: '1.25rem 1.5rem', color: '#64748b', fontSize: '0.85rem' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
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
                <div key={p._id} className="card glass-dark" style={{ padding: '1rem', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', display: 'flex', gap: '0.5rem', zIndex: 10 }}>
                    <button onClick={() => setEditingProduct(p)} style={{ background: 'rgba(59, 130, 246, 0.1)', border: 'none', borderRadius: '8px', padding: '0.5rem', color: '#3b82f6', cursor: 'pointer' }}>
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDeleteProduct(p._id)} style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', borderRadius: '8px', padding: '0.5rem', color: '#ef4444', cursor: 'pointer' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div style={{ background: 'white', borderRadius: '8px', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', padding: '0.5rem' }}>
                    <img src={p.imageUrl} alt={p.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  </div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</h4>
                  <p style={{ color: '#3b82f6', fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.5rem' }}>रू {p.price?.toLocaleString()}</p>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>{p.category}</div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'categories' && (
            <motion.div key="categories" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-2" style={{ gap: '2rem' }}>
              <div className="card glass-dark" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>Create New Sector</h3>
                <form onSubmit={handleAddCategory} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <AdminInput label="Sector Name" value={newCategory.name} onChange={(e) => setNewCategory({...newCategory, name: e.target.value})} placeholder="e.g. Smart Lighting" required />
                  <AdminInput label="Description" textarea value={newCategory.description} onChange={(e) => setNewCategory({...newCategory, description: e.target.value})} placeholder="Describe the market sector..." />
                  <AdminInput label="Icon URL" value={newCategory.imageUrl} onChange={(e) => setNewCategory({...newCategory, imageUrl: e.target.value})} placeholder="https://..." />
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>Deploy Sector</button>
                </form>
              </div>
              <div className="card glass-dark" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>Available Sectors</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {categories.map(c => (
                    <div key={c._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div>
                        <div style={{ fontWeight: 700 }}>{c.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{c.description || 'No description'}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => setEditingCategory(c)} style={{ background: 'transparent', border: 'none', color: '#3b82f6', cursor: 'pointer' }}><Edit size={16} /></button>
                        <button onClick={() => handleDeleteCategory(c._id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card glass-dark" style={{ padding: '0' }}>
              <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Registry: Orders</h3>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.02)', textAlign: 'left' }}>
                      <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', color: '#64748b' }}>ORDER ID</th>
                      <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', color: '#64748b' }}>CUSTOMER</th>
                      <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', color: '#64748b' }}>VALUATION</th>
                      <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', color: '#64748b' }}>STATUS</th>
                      <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', color: '#64748b' }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((o) => (
                      <tr key={o._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.8rem', fontFamily: 'monospace' }}>#{o._id.slice(-8).toUpperCase()}</td>
                        <td style={{ padding: '1.25rem 1.5rem' }}>
                          <div style={{ fontWeight: 600 }}>{o.user?.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{o.shippingAddress?.city}</div>
                        </td>
                        <td style={{ padding: '1.25rem 1.5rem', fontWeight: 700 }}>रू {o.totalPrice?.toLocaleString()}</td>
                        <td style={{ padding: '1.25rem 1.5rem' }}>
                          <span style={{ 
                            padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 800,
                            background: o.status === 'Delivered' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                            color: o.status === 'Delivered' ? '#10b981' : '#f59e0b',
                            border: `1px solid ${o.status === 'Delivered' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`
                          }}>{o.status.toUpperCase()}</span>
                        </td>
                        <td style={{ padding: '1.25rem 1.5rem' }}>
                          <select 
                            value={o.status} 
                            onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)}
                            style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '6px', padding: '0.25rem', fontSize: '0.75rem' }}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
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
            <motion.div key="add-product" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="card glass-dark" style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Expand Inventory</h2>
                <p style={{ color: '#64748b' }}>Deploy new product specifications to the marketplace</p>
              </div>
              <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="grid grid-2" style={{ gap: '2rem' }}>
                  <AdminInput label="Product Designation" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} placeholder="e.g. KENT Grand Star" required />
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8' }}>Sector / Category</label>
                    <select 
                      value={newProduct.category} 
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontWeight: 600 }}
                    >
                      {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-2" style={{ gap: '2rem' }}>
                  <AdminInput label="Valuation (NPR)" type="number" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} placeholder="25000" required />
                  <AdminInput label="Asset Image URL" value={newProduct.imageUrl} onChange={(e) => setNewProduct({...newProduct, imageUrl: e.target.value})} placeholder="https://..." />
                </div>
                <AdminInput label="Technical Overview" textarea value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} placeholder="Describe product functionality..." required />
                <div className="grid grid-2" style={{ gap: '2rem' }}>
                  <AdminInput label="Core Features (Comma Separated)" value={newProduct.features} onChange={(e) => setNewProduct({...newProduct, features: e.target.value})} placeholder="Feature A, Feature B..." />
                  <AdminInput label="Tech Specs (Key:Value, Comma Separated)" value={newProduct.specifications} onChange={(e) => setNewProduct({...newProduct, specifications: e.target.value})} placeholder="Power:60W, Capacity:9L" />
                </div>
                <button type="submit" className="btn btn-primary" style={{ padding: '1.25rem', fontWeight: 800 }}>Initialize Asset Deployment</button>
              </form>
            </motion.div>
          )}

          {activeTab === 'terminal' && (
            <motion.div key="terminal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card" style={{ background: '#000', border: '1px solid #333', padding: '0', borderRadius: '12px', overflow: 'hidden', height: '600px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '0.75rem 1.5rem', background: '#111', borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }}></div>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }}></div>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }}></div>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#666', fontFamily: 'monospace' }}>admin@sktrade: ~ log_viewer</span>
              </div>
              <div style={{ padding: '1.5rem', flex: 1, overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.9rem', color: '#10b981', lineHeight: '1.6' }}>
                {logs.map(log => (
                  <div key={log.id} style={{ marginBottom: '0.25rem' }}>
                    <span style={{ color: '#444' }}>[{log.time}] </span>
                    <span style={{ color: log.type === 'error' ? '#ef4444' : log.type === 'success' ? '#10b981' : log.type === 'warning' ? '#f59e0b' : '#3b82f6', fontWeight: 700 }}>
                      {log.type.toUpperCase()}: 
                    </span>
                    <span style={{ color: '#fff', marginLeft: '8px' }}>{log.msg}</span>
                  </div>
                ))}
                <div style={{ marginTop: '1rem', display: 'flex', gap: '8px' }}>
                  <span style={{ color: '#3b82f6' }}>$</span>
                  <span className="cursor-blink" style={{ width: '8px', height: '18px', background: '#10b981' }}></span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card glass-dark" style={{ maxWidth: '800px', width: '100%', padding: '2.5rem', position: 'relative' }}>
            <button onClick={() => setEditingProduct(null)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={24} /></button>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>Update Asset: {editingProduct.name}</h3>
            <form onSubmit={handleUpdateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="grid grid-2" style={{ gap: '1.5rem' }}>
                <AdminInput label="Designation" value={editingProduct.name} onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} required />
                <div>
                  <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8' }}>Sector</label>
                  <select 
                    value={editingProduct.category} 
                    onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                    style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontWeight: 600 }}
                  >
                    {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-2" style={{ gap: '1.5rem' }}>
                <AdminInput label="Valuation" type="number" value={editingProduct.price} onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})} required />
                <AdminInput label="Asset Image URL" value={editingProduct.imageUrl} onChange={(e) => setEditingProduct({...editingProduct, imageUrl: e.target.value})} />
              </div>
              <AdminInput label="Technical Overview" textarea value={editingProduct.description} onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})} required />
              <button type="submit" className="btn btn-primary" style={{ padding: '1rem', fontWeight: 700 }}><Save size={18} style={{ marginRight: '8px' }} /> Commit Changes</button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card glass-dark" style={{ maxWidth: '500px', width: '100%', padding: '2.5rem', position: 'relative' }}>
            <button onClick={() => setEditingCategory(null)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={24} /></button>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>Update Sector: {editingCategory.name}</h3>
            <form onSubmit={handleUpdateCategory} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <AdminInput label="Sector Name" value={editingCategory.name} onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})} required />
              <AdminInput label="Description" textarea value={editingCategory.description} onChange={(e) => setEditingCategory({...editingCategory, description: e.target.value})} />
              <AdminInput label="Icon URL" value={editingCategory.imageUrl} onChange={(e) => setEditingCategory({...editingCategory, imageUrl: e.target.value})} />
              <button type="submit" className="btn btn-primary" style={{ padding: '1rem', fontWeight: 700 }}><Save size={18} style={{ marginRight: '8px' }} /> Commit Sector Updates</button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const SidebarLink = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    style={{
      display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.85rem 1.25rem', borderRadius: '10px', border: 'none',
      background: active ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
      color: active ? '#3b82f6' : '#94a3b8',
      cursor: 'pointer', width: '100%', textAlign: 'left', transition: 'all 0.2s ease', fontWeight: active ? 700 : 500, fontSize: '0.9rem'
    }}
  >
    {icon}
    {label}
  </button>
);

const StatCard = ({ icon, label, value, detail }) => (
  <div className="card glass-dark" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }}>{icon}</div>
      <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700, background: 'rgba(16, 185, 129, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>LIVE</span>
    </div>
    <div>
      <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>{label}</p>
      <h3 style={{ fontSize: '2.25rem', fontWeight: 900, color: 'white' }}>{value}</h3>
      <p style={{ fontSize: '0.75rem', color: '#475569', marginTop: '0.5rem' }}>{detail}</p>
    </div>
  </div>
);

const AdminInput = ({ label, textarea, ...props }) => (
  <div style={{ width: '100%' }}>
    <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8' }}>{label}</label>
    {textarea ? (
      <textarea {...props} style={{ width: '100%', padding: '1rem', borderRadius: '10px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', color: 'white', minHeight: '140px', resize: 'vertical', outline: 'none' }} />
    ) : (
      <input {...props} style={{ width: '100%', padding: '1rem', borderRadius: '10px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} />
    )}
  </div>
);

export default AdminDashboard;
