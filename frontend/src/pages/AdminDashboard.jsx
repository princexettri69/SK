import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  Package, 
  Plus, 
  Trash2, 
  LayoutDashboard, 
  ChevronRight, 
  Search,
  CheckCircle,
  Terminal as TerminalIcon,
  Activity,
  ShieldCheck,
  Settings,
  Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../components/AuthContext';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [logs, setLogs] = useState([
    { id: 1, type: 'info', msg: 'Admin System Initialized', time: new Date().toLocaleTimeString() },
    { id: 2, type: 'success', msg: 'Database Connection Secure', time: new Date().toLocaleTimeString() }
  ]);

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Water Purifiers',
    description: '',
    price: '',
    imageUrl: '',
    features: '',
    specifications: ''
  });

  const categories = ['Water Purifiers', 'Vacuum Cleaners', 'Air Coolers', 'Kitchen Appliances', 'Hardware', 'Interior Decor'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [usersRes, productsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/auth/users`, config),
        axios.get(`${import.meta.env.VITE_API_URL}/api/products`)
      ]);

      setUsers(usersRes.data.data.users);
      setProducts(productsRes.data);
      addLog('Fetched system data successfully', 'success');
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch dashboard data');
      addLog('Failed to fetch system data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addLog = (msg, type = 'info') => {
    setLogs(prev => [{ id: Date.now(), type, msg, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 50));
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Product deleted');
      addLog(`Product deleted: ${id}`, 'warning');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const productData = {
        ...newProduct,
        price: Number(newProduct.price),
        features: newProduct.features.split(',').map(f => f.trim()).filter(f => f),
        specifications: newProduct.specifications.split(',').reduce((acc, curr) => {
          const [key, val] = curr.split(':').map(s => s.trim());
          if (key && val) acc[key] = val;
          return acc;
        }, {})
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/api/products`, productData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Product added successfully!');
      addLog(`New product added: ${newProduct.name}`, 'success');
      setNewProduct({
        name: '', category: 'Water Purifiers', description: '', price: '', imageUrl: '', features: '', specifications: ''
      });
      setActiveTab('products');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add product');
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

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
      <div className="loader"></div>
      <span style={{ marginLeft: '1rem', fontWeight: 600, color: '#3b82f6' }}>Secure Login...</span>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc', paddingTop: '80px' }}>
      {/* Sidebar */}
      <div style={{ 
        width: '260px', 
        borderRight: '1px solid rgba(255,255,255,0.05)', 
        padding: '2rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
        backgroundColor: '#0f172a',
        position: 'fixed',
        height: 'calc(100vh - 80px)',
        zIndex: 50
      }} className="desktop-only">
        <SidebarLink icon={<LayoutDashboard size={18} />} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
        <SidebarLink icon={<Users size={18} />} label="Users" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
        <SidebarLink icon={<Package size={18} />} label="Products" active={activeTab === 'products'} onClick={() => setActiveTab('products')} />
        <SidebarLink icon={<Plus size={18} />} label="Add Product" active={activeTab === 'add-product'} onClick={() => setActiveTab('add-product')} />
        <SidebarLink icon={<TerminalIcon size={18} />} label="Admin Terminal" active={activeTab === 'terminal'} onClick={() => setActiveTab('terminal')} />
        
        <div style={{ marginTop: 'auto', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <ShieldCheck size={16} color="#10b981" />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981' }}>SYSTEM SECURE</span>
          </div>
          <p style={{ fontSize: '0.7rem', color: '#64748b' }}>Last Sync: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '2.5rem', marginLeft: '260px' }} className="mobile-full-padding">
        <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#3b82f6', marginBottom: '0.5rem' }}>
              <Activity size={16} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Management Console</span>
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px' }}>Control Panel</h1>
          </div>
          
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input 
              type="text" 
              placeholder="System search..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                padding: '0.75rem 1rem 0.75rem 2.5rem', 
                borderRadius: '12px', 
                border: '1px solid rgba(255,255,255,0.1)',
                background: '#1e293b',
                color: 'white',
                width: '320px',
                outline: 'none',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }} 
            />
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-3" style={{ gap: '1.5rem' }}>
              <StatCard icon={<Users color="#3b82f6" />} label="Active Users" value={users.length} detail="+2 this week" />
              <StatCard icon={<Package color="#10b981" />} label="Total Inventory" value={products.length} detail="In stock" />
              <StatCard icon={<Database color="#f59e0b" />} label="DB Nodes" value="Healthy" detail="Primary Cluster" />
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card" style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.05)', padding: '0' }}>
              <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>User Registry</h3>
              </div>
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
                        <span style={{ 
                          padding: '0.35rem 0.75rem', 
                          borderRadius: '6px', 
                          fontSize: '0.7rem', 
                          background: u.role === 'admin' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255,255,255,0.05)',
                          color: u.role === 'admin' ? '#60a5fa' : '#94a3b8',
                          fontWeight: 800,
                          border: `1px solid ${u.role === 'admin' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255,255,255,0.1)'}`
                        }}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem', color: '#64748b', fontSize: '0.85rem' }}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}

          {activeTab === 'products' && (
            <motion.div key="products" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-4" style={{ gap: '1.5rem' }}>
              {filteredProducts.map((p) => (
                <div key={p._id} className="card" style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.05)', padding: '1rem', position: 'relative' }}>
                  <button 
                    onClick={() => handleDeleteProduct(p._id)}
                    style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', border: 'none', borderRadius: '8px', padding: '0.5rem', color: '#ef4444', cursor: 'pointer', zIndex: 10 }}
                  >
                    <Trash2 size={16} />
                  </button>
                  <div style={{ background: 'white', borderRadius: '8px', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', padding: '0.5rem' }}>
                    <img src={p.imageUrl} alt={p.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  </div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</h4>
                  <p style={{ color: '#3b82f6', fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.5rem' }}>रू {p.price?.toLocaleString()} NPR</p>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>{p.category}</div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'add-product' && (
            <motion.div key="add-product" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="card" style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem', background: '#0f172a', border: '1px solid rgba(255,255,255,0.05)' }}>
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
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-2" style={{ gap: '2rem' }}>
                  <AdminInput label="Valuation (NPR)" type="number" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} placeholder="25000" required />
                  <AdminInput label="Asset Image URL" value={newProduct.imageUrl} onChange={(e) => setNewProduct({...newProduct, imageUrl: e.target.value})} placeholder="https://cdn.example.com/asset.jpg" />
                </div>
                <AdminInput label="Technical Overview" textarea value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} placeholder="Describe product functionality and value proposition..." required />
                <div className="grid grid-2" style={{ gap: '2rem' }}>
                  <AdminInput label="Core Features (Comma Separated)" value={newProduct.features} onChange={(e) => setNewProduct({...newProduct, features: e.target.value})} placeholder="Feature A, Feature B..." />
                  <AdminInput label="Tech Specs (Key:Value, Comma Separated)" value={newProduct.specifications} onChange={(e) => setNewProduct({...newProduct, specifications: e.target.value})} placeholder="Storage:9L, Power:60W" />
                </div>
                <button type="submit" className="btn btn-primary" style={{ padding: '1.25rem', marginTop: '1.5rem', fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Initialize Asset Deployment
                </button>
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
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#666', fontFamily: 'JetBrains Mono, monospace' }}>admin@sktrade: ~ (v1.0.4)</span>
              </div>
              <div style={{ padding: '1.5rem', flex: 1, overflowY: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', color: '#10b981', lineHeight: '1.6' }}>
                <p style={{ color: '#666' }}>[System] Boot sequence initiated...</p>
                <p style={{ color: '#666' }}>[System] SSL Handshake: COMPLETED</p>
                <p style={{ color: '#666' }}>[System] Port 5000: LISTENING</p>
                <div style={{ margin: '1rem 0' }}></div>
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
  <div className="card" style={{ padding: '1.75rem', background: '#0f172a', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
