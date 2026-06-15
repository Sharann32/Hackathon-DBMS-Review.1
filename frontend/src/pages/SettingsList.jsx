import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import Loading from '../components/common/Loading';
import { useAuth } from '../context/AuthContext';

const SettingsList = () => {
  const { isAdmin } = useAuth();
  const [settings, setSettings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [scopeFilter, setScopeFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  useEffect(() => {
    fetchSettings();
    fetchCategories();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings');
      setSettings(response.data.data);
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data);
    } catch (error) {
      console.error('Failed to load categories');
    }
  };

  const handleDelete = async (id) => {
    // Only admins can delete settings
    if (!isAdmin()) {
      toast.error('Only administrators can delete settings');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this setting?')) return;

    try {
      await api.delete(`/settings/${id}`);
      toast.success('Setting deleted successfully');
      fetchSettings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete setting');
    }
  };

  const filteredSettings = settings.filter((setting) => {
    const matchesSearch = setting.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         setting.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesScope = scopeFilter === 'ALL' || setting.scope === scopeFilter;
    const matchesCategory = categoryFilter === 'ALL' || setting.category?.id === parseInt(categoryFilter);
    
    return matchesSearch && matchesScope && matchesCategory;
  });

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        {isAdmin() && (
          <Link to="/settings/create" className="btn-primary">
            Create Setting
          </Link>
        )}
      </div>

      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search settings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
          />
          <select
            value={scopeFilter}
            onChange={(e) => setScopeFilter(e.target.value)}
            className="input-field"
          >
            <option value="ALL">All Scopes</option>
            <option value="SYSTEM">System</option>
            <option value="USER">User</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input-field"
          >
            <option value="ALL">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredSettings.map((setting) => (
          <div key={setting.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-800">{setting.key}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    setting.scope === 'SYSTEM' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {setting.scope}
                  </span>
                  {setting.category && (
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                      {setting.category.name}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-2">{setting.description || 'No description'}</p>
                <p className="text-sm text-gray-800">
                  <span className="font-medium">Value:</span> {setting.value}
                </p>
              </div>
              <div className="flex gap-2 ml-4">
                {(isAdmin() || setting.scope === 'USER') && (
                  <Link
                    to={`/settings/edit/${setting.id}`}
                    className="px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700"
                  >
                    Edit
                  </Link>
                )}
                {isAdmin() && (
                  <button
                    onClick={() => handleDelete(setting.id)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSettings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No settings found</p>
        </div>
      )}
    </div>
  );
};

export default SettingsList;
