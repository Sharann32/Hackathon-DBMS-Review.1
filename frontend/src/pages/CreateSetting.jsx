import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

const CreateSetting = () => {
  const [formData, setFormData] = useState({
    key: '',
    value: '',
    description: '',
    categoryId: '',
    scope: 'SYSTEM',
    userId: null,
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data);
    } catch (error) {
      toast.error('Failed to load categories');
    }
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/settings', {
        ...formData,
        categoryId: parseInt(formData.categoryId),
      });
      toast.success('Setting created successfully');
      navigate('/settings');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create setting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Create New Setting</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Add a new configuration setting to the system
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Setting Key */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Setting Key *
            </label>
            <input
              type="text"
              name="key"
              value={formData.key}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., two_factor_auth, theme, language"
              required
            />
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
              Unique identifier for this setting (use lowercase with underscores)
            </p>
          </div>

          {/* Setting Value */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Value *
            </label>
            <textarea
              name="value"
              value={formData.value}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              placeholder="e.g., enabled, dark, en-US"
              required
            />
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
              The actual value for this setting
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              placeholder="Brief description of what this setting controls..."
            />
          </div>

          {/* Category Selection - Enhanced */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Category *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => setFormData({ ...formData, categoryId: cat.id.toString() })}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.categoryId === cat.id.toString()
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900 shadow-md'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 bg-white dark:bg-gray-700'
                  }`}
                >
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">{getCategoryIcon(cat.name)}</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {cat.name}
                      </h4>
                      {cat.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                          {cat.description}
                        </p>
                      )}
                    </div>
                    {formData.categoryId === cat.id.toString() && (
                      <span className="text-blue-600 dark:text-blue-400 ml-2">✓</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {categories.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No categories available. Please create a category first.
              </p>
            )}
          </div>

          {/* Scope Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Scope *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => setFormData({ ...formData, scope: 'SYSTEM' })}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  formData.scope === 'SYSTEM'
                    ? 'border-green-600 bg-green-50 dark:bg-green-900'
                    : 'border-gray-200 dark:border-gray-700 hover:border-green-400 bg-white dark:bg-gray-700'
                }`}
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🌐</span>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">System</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Global setting for all users
                    </p>
                  </div>
                  {formData.scope === 'SYSTEM' && (
                    <span className="text-green-600 dark:text-green-400 ml-auto">✓</span>
                  )}
                </div>
              </div>

              <div
                onClick={() => setFormData({ ...formData, scope: 'USER' })}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  formData.scope === 'USER'
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-900'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-400 bg-white dark:bg-gray-700'
                }`}
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">👤</span>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">User</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Personal user preference
                    </p>
                  </div>
                  {formData.scope === 'USER' && (
                    <span className="text-purple-600 dark:text-purple-400 ml-auto">✓</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : '✓ Create Setting'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/settings')}
              className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              ✕ Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSetting;
