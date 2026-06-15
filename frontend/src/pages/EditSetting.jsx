import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import Loading from '../components/common/Loading';

const EditSetting = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    key: '',
    value: '',
    description: '',
    categoryId: '',
    scope: 'SYSTEM',
    userId: null,
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSetting();
    fetchCategories();
  }, [id]);

  const fetchSetting = async () => {
    try {
      const response = await api.get(`/settings/${id}`);
      const setting = response.data.data;
      setFormData({
        key: setting.key,
        value: setting.value,
        description: setting.description || '',
        categoryId: setting.category?.id || '',
        scope: setting.scope,
        userId: setting.userId,
      });
    } catch (error) {
      toast.error('Failed to load setting');
      navigate('/settings');
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.put(`/settings/${id}`, {
        ...formData,
        categoryId: parseInt(formData.categoryId),
      });
      toast.success('Setting updated successfully');
      navigate('/settings');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update setting');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Edit Setting</h1>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Key *
            </label>
            <input
              type="text"
              name="key"
              value={formData.key}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Value *
            </label>
            <textarea
              name="value"
              value={formData.value}
              onChange={handleChange}
              className="input-field"
              rows="3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input-field"
              rows="3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Scope *
            </label>
            <select
              name="scope"
              value={formData.scope}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="SYSTEM">System</option>
              <option value="USER">User</option>
            </select>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary disabled:opacity-50"
            >
              {submitting ? 'Updating...' : 'Update Setting'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/settings')}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSetting;
