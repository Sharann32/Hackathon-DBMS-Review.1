import { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import Loading from '../components/common/Loading';
import { useAuth } from '../context/AuthContext';
import { Folder, Plus, Edit2, Trash2, ChevronDown, ChevronUp, Settings as SettingsIcon, FolderOpen } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [categorySettings, setCategorySettings] = useState({});
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      console.log('🔄 Fetching categories...');
      const response = await api.get('/categories');
      console.log('✅ Categories response:', response.data);
      
      if (response.data && response.data.data) {
        const cats = response.data.data;
        setCategories(cats);
        console.log('📦 Categories loaded:', cats.length);
        
        cats.forEach(cat => fetchCategorySettings(cat.id));
      } else {
        console.warn('⚠️ No data field in response');
        setCategories([]);
      }
    } catch (error) {
      console.error('❌ Failed to load categories:', error);
      toast.error('Failed to load categories: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchCategorySettings = async (categoryId) => {
    try {
      // Fetch all settings and filter by category
      const response = await api.get('/settings');
      if (response.data && response.data.data) {
        const allSettings = response.data.data;
        const filtered = allSettings.filter(s => s.category && s.category.id === categoryId);
        setCategorySettings(prev => ({
          ...prev,
          [categoryId]: filtered
        }));
        console.log(`📊 Category ${categoryId}: ${filtered.length} settings`);
      }
    } catch (error) {
      console.error(`Failed to load settings for category ${categoryId}:`, error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, formData);
        toast.success('Category updated successfully');
      } else {
        await api.post('/categories', formData);
        toast.success('Category created successfully');
      }
      setShowModal(false);
      setFormData({ name: '', description: '' });
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category? This will not delete the settings, but they will become uncategorized.')) return;

    try {
      await api.delete(`/categories/${id}`);
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete category');
    }
  };

  const openModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name, description: category.description || '' });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '' });
    }
    setShowModal(true);
  };

  const toggleExpand = (categoryId) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const getCategoryIcon = (name) => {
    const icons = {
      'Appearance': '🎨',
      'Security': '🔒',
      'Notifications': '🔔',
      'Localization': '🌍',
      'Dashboard': '📊',
      'Privacy': '🔐',
      'Email': '📧',
      'General': '⚙️',
      'Performance': '⚡',
      'Backup': '💾',
      'Integration': '🔗',
      'Logging': '📝',
      'Network': '🌐',
      'API': '🔌'
    };
    return icons[name] || '📁';
  };

  if (loading) return <Loading />;

  const totalSettings = Object.values(categorySettings).reduce((sum, settings) => sum + settings.length, 0);

  return (
    <div className="page-grid" style={{ minHeight: '100vh', padding: '32px', position: 'relative' }}>
      {/* Ambient Blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div className="flex justify-between items-center mb-8 fade-in-up">
          <div>
            <h1 className="gradient-text" style={{ fontSize: '36px', fontWeight: 800, marginBottom: '8px' }}>
              Settings by Category
            </h1>
            <div className="flex items-center gap-3" style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              <span className="badge-admin" style={{ fontFamily: "'Fira Code', monospace" }}>
                {categories.length} CATEGORIES
              </span>
              <span style={{ color: 'var(--text-muted)' }}>•</span>
              <span className="badge-active" style={{ fontFamily: "'Fira Code', monospace" }}>
                {totalSettings} SETTINGS
              </span>
            </div>
          </div>
          {isAdmin() && (
            <button 
              onClick={() => openModal()} 
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Category
            </button>
          )}
        </div>

        {/* Categories List */}
        <div className="space-y-4">
          {categories.map((category, index) => {
            const settings = categorySettings[category.id] || [];
            const isExpanded = expandedCategories.includes(category.id);
            
            return (
              <div 
                key={category.id} 
                className="card fade-in-up"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  overflow: 'hidden'
                }}
              >
                {/* Category Header */}
                <div 
                  onClick={() => toggleExpand(category.id)}
                  style={{
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1 gap-4">
                      <div style={{
                        width: '56px',
                        height: '56px',
                        background: 'var(--gradient)',
                        borderRadius: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '28px',
                        boxShadow: 'var(--shadow-glow)'
                      }}>
                        {getCategoryIcon(category.name)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 style={{ 
                            fontSize: '20px', 
                            fontWeight: 700, 
                            color: 'var(--text-primary)' 
                          }}>
                            {category.name}
                          </h3>
                          <span className="badge-active" style={{ fontSize: '11px' }}>
                            {settings.length} {settings.length === 1 ? 'setting' : 'settings'}
                          </span>
                        </div>
                        {category.description && (
                          <p style={{ 
                            fontSize: '13px', 
                            color: 'var(--text-secondary)',
                            lineHeight: 1.5
                          }}>
                            {category.description}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {isAdmin() && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openModal(category);
                            }}
                            className="btn-ghost"
                            style={{ padding: '8px 12px' }}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(category.id);
                            }}
                            className="btn-ghost"
                            style={{ 
                              padding: '8px 12px',
                              borderColor: 'rgba(239, 68, 68, 0.3)',
                              color: '#f87171'
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button className="btn-ghost" style={{ padding: '8px' }}>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Settings List - Expandable */}
                {isExpanded && (
                  <div style={{
                    marginTop: '24px',
                    paddingTop: '24px',
                    borderTop: '1px solid var(--border)'
                  }}>
                    {settings.length > 0 ? (
                      <div className="space-y-3">
                        {settings.map((setting) => (
                          <div 
                            key={setting.id}
                            style={{
                              padding: '16px',
                              background: 'rgba(6, 182, 212, 0.05)',
                              border: '1px solid rgba(6, 182, 212, 0.15)',
                              borderRadius: '12px',
                              transition: 'var(--transition)'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(6, 182, 212, 0.08)';
                              e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(6, 182, 212, 0.05)';
                              e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.15)';
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <SettingsIcon className="w-5 h-5 mt-0.5" style={{ color: 'var(--accent-2)' }} />
                              <div style={{ flex: 1 }}>
                                <h4 style={{ 
                                  fontSize: '14px', 
                                  fontWeight: 600, 
                                  color: 'var(--text-primary)',
                                  marginBottom: '4px'
                                }}>
                                  {setting.key}
                                </h4>
                                <p style={{ 
                                  fontSize: '13px', 
                                  color: 'var(--text-secondary)',
                                  fontFamily: "'Fira Code', monospace"
                                }}>
                                  {setting.value}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '48px 20px' }}>
                        <FolderOpen className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
                        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                          No settings in this category yet
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {categories.length === 0 && !loading && (
          <div className="card text-center fade-in-up" style={{ padding: '80px 40px' }}>
            <Folder className="w-24 h-24 mx-auto mb-6" style={{ color: 'var(--text-muted)' }} />
            <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
              No categories found
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Create your first category to organize settings
            </p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content fade-in-up">
            <div className="flex items-center gap-3 mb-6">
              {editingCategory ? (
                <Edit2 className="w-6 h-6" style={{ color: 'var(--accent-2)' }} />
              ) : (
                <Plus className="w-6 h-6" style={{ color: 'var(--accent-2)' }} />
              )}
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="input-label">Category Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Security, Appearance"
                  required
                />
              </div>
              
              <div>
                <label className="input-label">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  rows="4"
                  placeholder="Describe what settings belong in this category..."
                  style={{ resize: 'vertical', minHeight: '100px' }}
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button 
                  type="submit" 
                  className="btn-primary"
                  style={{ flex: 1 }}
                >
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-outline"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
