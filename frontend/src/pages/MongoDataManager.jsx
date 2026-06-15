import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { BookOpen, HelpCircle, Plus, Edit2, Trash2, Save, X, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MongoDataManager = () => {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('explanations');
  const [explanations, setExplanations] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    keywords: '',
    question: '',
    answer: ''
  });

  const API_BASE = 'http://localhost:3001/api';

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'explanations') {
        const res = await axios.get(`${API_BASE}/explanations`);
        setExplanations(res.data.data || []);
      } else {
        const res = await axios.get(`${API_BASE}/faqs`);
        setFaqs(res.data.data || []);
      }
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const endpoint = activeTab === 'explanations' ? 'explanations' : 'faqs';
      const payload = activeTab === 'explanations' 
        ? {
            title: formData.title,
            content: formData.content,
            keywords: formData.keywords.split(',').map(k => k.trim()).filter(k => k)
          }
        : {
            question: formData.question,
            answer: formData.answer,
            keywords: formData.keywords.split(',').map(k => k.trim()).filter(k => k)
          };

      if (editingItem) {
        await axios.put(`${API_BASE}/${endpoint}/${editingItem._id}`, payload);
        toast.success('Updated successfully');
      } else {
        await axios.post(`${API_BASE}/${endpoint}`, payload);
        toast.success('Created successfully');
      }

      setShowModal(false);
      resetForm();
      fetchData();
      
      // Generate embeddings after adding/updating
      toast.info('Generating AI embeddings...');
      setTimeout(() => {
        toast.success('Embeddings generated! Search ready.');
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      const endpoint = activeTab === 'explanations' ? 'explanations' : 'faqs';
      await axios.delete(`${API_BASE}/${endpoint}/${id}`);
      toast.success('Deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      if (activeTab === 'explanations') {
        setFormData({
          title: item.title,
          content: item.content,
          keywords: item.keywords?.join(', ') || '',
          question: '',
          answer: ''
        });
      } else {
        setFormData({
          question: item.question,
          answer: item.answer,
          keywords: item.keywords?.join(', ') || '',
          title: '',
          content: ''
        });
      }
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      keywords: '',
      question: '',
      answer: ''
    });
    setEditingItem(null);
  };

  if (!isAdmin()) {
    return (
      <div className="page-grid" style={{ padding: '32px' }}>
        <div className="card text-center" style={{ padding: '60px' }}>
          <h2 style={{ fontSize: '24px', color: 'var(--text-primary)', marginBottom: '16px' }}>
            ⚠️ Admin Access Required
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Only administrators can manage AI Assistant data.
          </p>
        </div>
      </div>
    );
  }

  const items = activeTab === 'explanations' ? explanations : faqs;

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
              AI Assistant Data Manager
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Manage explanations and FAQs for semantic search
            </p>
          </div>
          <button 
            onClick={() => openModal()} 
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add {activeTab === 'explanations' ? 'Explanation' : 'FAQ'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 fade-in-up" style={{ animationDelay: '0.1s' }}>
          <button
            onClick={() => setActiveTab('explanations')}
            className={activeTab === 'explanations' ? 'btn-primary' : 'btn-ghost'}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <BookOpen className="w-4 h-4" />
            Explanations ({explanations.length})
          </button>
          <button
            onClick={() => setActiveTab('faqs')}
            className={activeTab === 'faqs' ? 'btn-primary' : 'btn-ghost'}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <HelpCircle className="w-4 h-4" />
            FAQs ({faqs.length})
          </button>
        </div>

        {/* Items List */}
        {loading ? (
          <div className="text-center" style={{ padding: '60px' }}>
            <Sparkles className="w-12 h-12 mx-auto mb-4 animate-spin" style={{ color: 'var(--accent-2)' }} />
            <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item, index) => (
              <div 
                key={item._id} 
                className="card fade-in-up"
                style={{ animationDelay: `${0.2 + index * 0.05}s` }}
              >
                <div className="flex items-start gap-4">
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'var(--gradient)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {activeTab === 'explanations' ? (
                      <BookOpen className="w-6 h-6" style={{ color: '#fff' }} />
                    ) : (
                      <HelpCircle className="w-6 h-6" style={{ color: '#fff' }} />
                    )}
                  </div>

                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      fontSize: '18px', 
                      fontWeight: 600, 
                      color: 'var(--text-primary)',
                      marginBottom: '8px'
                    }}>
                      {activeTab === 'explanations' ? item.title : item.question}
                    </h3>
                    <p style={{ 
                      fontSize: '14px', 
                      color: 'var(--text-secondary)',
                      marginBottom: '12px',
                      lineHeight: 1.6
                    }}>
                      {activeTab === 'explanations' ? item.content : item.answer}
                    </p>
                    {item.keywords && item.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {item.keywords.map((keyword, idx) => (
                          <span 
                            key={idx}
                            style={{
                              padding: '2px 8px',
                              background: 'rgba(6, 182, 212, 0.08)',
                              border: '1px solid rgba(6, 182, 212, 0.2)',
                              borderRadius: '4px',
                              fontSize: '11px',
                              color: 'var(--accent-3)',
                              fontFamily: "'Fira Code', monospace"
                            }}
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(item)}
                      className="btn-ghost"
                      style={{ padding: '8px 12px' }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="btn-ghost"
                      style={{ padding: '8px 12px', color: '#ef4444' }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {items.length === 0 && (
              <div className="card text-center" style={{ padding: '60px' }}>
                <p style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>
                  No {activeTab} yet. Click "Add" to create one!
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}
        onClick={() => setShowModal(false)}
        >
          <div 
            className="card"
            style={{ 
              maxWidth: '600px', 
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {editingItem ? 'Edit' : 'Add'} {activeTab === 'explanations' ? 'Explanation' : 'FAQ'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="btn-ghost"
                style={{ padding: '8px' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === 'explanations' ? (
                <>
                  <div>
                    <label className="label">Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="input-field"
                      placeholder="e.g., How to Configure Settings"
                    />
                  </div>
                  <div>
                    <label className="label">Content *</label>
                    <textarea
                      required
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      className="input-field"
                      rows="6"
                      placeholder="Detailed explanation..."
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="label">Question *</label>
                    <input
                      type="text"
                      required
                      value={formData.question}
                      onChange={(e) => setFormData({...formData, question: e.target.value})}
                      className="input-field"
                      placeholder="e.g., How do I reset my password?"
                    />
                  </div>
                  <div>
                    <label className="label">Answer *</label>
                    <textarea
                      required
                      value={formData.answer}
                      onChange={(e) => setFormData({...formData, answer: e.target.value})}
                      className="input-field"
                      rows="6"
                      placeholder="Detailed answer..."
                    />
                  </div>
                </>
              )}
              
              <div>
                <label className="label">Keywords (comma-separated)</label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) => setFormData({...formData, keywords: e.target.value})}
                  className="input-field"
                  placeholder="settings, configure, admin, security"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex items-center gap-2" style={{ flex: 1 }}>
                  <Save className="w-4 h-4" />
                  {editingItem ? 'Update' : 'Create'}
                </button>
                <button 
                  type="button"
                  onClick={() => setShowModal(false)} 
                  className="btn-ghost"
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

export default MongoDataManager;
