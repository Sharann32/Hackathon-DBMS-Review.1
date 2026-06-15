import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import Loading from '../components/common/Loading';
import { useLanguage } from '../contexts/LanguageContext';
import { usePreferences } from '../contexts/PreferencesContext';
import { useAuth } from '../context/AuthContext';
import { Settings, Folder, Palette, User, Users, Clock, TrendingUp, Database, Activity } from 'lucide-react';

const Dashboard = () => {
  const { t } = useLanguage();
  const { preferences } = usePreferences();
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalSettings: 0,
    systemSettings: 0,
    userSettings: 0,
    totalCategories: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [settingsRes, categoriesRes] = await Promise.all([
        api.get('/settings'),
        api.get('/categories'),
      ]);

      const settings = settingsRes.data.data;
      const categories = categoriesRes.data.data;

      setStats({
        totalSettings: settings.length,
        systemSettings: settings.filter(s => s.scope === 'SYSTEM').length,
        userSettings: settings.filter(s => s.scope === 'USER').length,
        totalCategories: categories.length,
      });

      if (isAdmin()) {
        try {
          const usersRes = await api.get('/users');
          const users = usersRes.data.data;
          const sorted = users
            .filter(u => u.lastLogin)
            .sort((a, b) => new Date(b.lastLogin) - new Date(a.lastLogin))
            .slice(0, 5);
          setRecentUsers(sorted);
        } catch (err) {
          console.error('Failed to fetch recent users:', err);
        }
      }
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  const dashboardCards = preferences.dashboardCards || {
    totalSettings: true,
    systemSettings: true,
    userSettings: true,
    categories: true,
  };

  const statCards = [
    {
      key: 'totalSettings',
      title: t('dashboard.totalSettings') || 'Total Settings',
      value: stats.totalSettings,
      icon: Database,
      gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
      show: dashboardCards.totalSettings
    },
    {
      key: 'systemSettings',
      title: t('dashboard.systemSettings') || 'System Settings',
      value: stats.systemSettings,
      icon: Settings,
      gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
      show: dashboardCards.systemSettings
    },
    {
      key: 'userSettings',
      title: t('dashboard.userSettings') || 'User Settings',
      value: stats.userSettings,
      icon: User,
      gradient: 'linear-gradient(135deg, #60a5fa, #93c5fd)',
      show: dashboardCards.userSettings
    },
    {
      key: 'categories',
      title: t('dashboard.categories') || 'Categories',
      value: stats.totalCategories,
      icon: Folder,
      gradient: 'linear-gradient(135deg, #c4b5fd, #ddd6fe)',
      show: dashboardCards.categories
    }
  ];

  return (
    <div className="page-grid" style={{ minHeight: '100vh', padding: '32px', position: 'relative' }}>
      {/* Ambient Blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div className="fade-in-up" style={{ marginBottom: '32px' }}>
          <h1 className="gradient-text" style={{ fontSize: '36px', fontWeight: 800, marginBottom: '8px' }}>
            {t('dashboard.title') || 'Dashboard'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Welcome back! Here's your system overview
          </p>
        </div>

        {/* Stats Cards */}
        <div className={`grid gap-6 mb-8 ${
          preferences.dashboardLayout === 'list' 
            ? 'grid-cols-1' 
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
        }`}>
          {statCards.filter(card => card.show).map((card, index) => {
            const Icon = card.icon;
            return (
              <div 
                key={card.key}
                className="card fade-in-up" 
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  background: 'var(--bg-card)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Gradient Background */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '100px',
                  height: '100px',
                  background: card.gradient,
                  opacity: 0.1,
                  borderRadius: '50%',
                  filter: 'blur(30px)'
                }} />
                
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div className="flex items-start justify-between mb-4">
                    <div style={{
                      width: '48px',
                      height: '48px',
                      background: card.gradient,
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: 'var(--shadow-glow)'
                    }}>
                      <Icon className="w-6 h-6" style={{ color: '#fff' }} />
                    </div>
                    <TrendingUp className="w-5 h-5" style={{ color: '#4ade80' }} />
                  </div>
                  
                  <h3 style={{ 
                    fontSize: '13px', 
                    fontWeight: 500, 
                    color: 'var(--text-secondary)',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {card.title}
                  </h3>
                  
                  <p style={{ 
                    fontSize: '32px', 
                    fontWeight: 700, 
                    color: 'var(--text-primary)',
                    lineHeight: 1
                  }}>
                    {card.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <div className="card fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-6 h-6" style={{ color: 'var(--accent-2)' }} />
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {t('dashboard.quickActions') || 'Quick Actions'}
              </h2>
            </div>
            
            <div className="space-y-3">
              {isAdmin() && (
                <Link 
                  to="/settings/create" 
                  className="btn-primary"
                  style={{ 
                    width: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px',
                    justifyContent: 'center',
                    textDecoration: 'none'
                  }}
                >
                  <Settings className="w-4 h-4" />
                  {t('settings.create') || 'Create New Setting'}
                </Link>
              )}
              
              {isAdmin() && (
                <Link 
                  to="/categories" 
                  className="btn-outline"
                  style={{ 
                    width: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px',
                    justifyContent: 'center',
                    textDecoration: 'none'
                  }}
                >
                  <Folder className="w-4 h-4" />
                  {t('categories.title') || 'Manage Categories'}
                </Link>
              )}
              
              <Link 
                to="/preferences" 
                className="btn-outline"
                style={{ 
                  width: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  justifyContent: 'center',
                  textDecoration: 'none'
                }}
              >
                <Palette className="w-4 h-4" />
                {t('preferences.title') || 'User Preferences'}
              </Link>
            </div>
          </div>

          {/* System Info */}
          <div className="card fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center gap-3 mb-6">
              <Database className="w-6 h-6" style={{ color: 'var(--accent-2)' }} />
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
                System Overview
              </h2>
            </div>
            
            <div className="space-y-4">
              <div style={{ 
                padding: '16px', 
                background: 'rgba(6, 182, 212, 0.08)',
                border: '1px solid rgba(6, 182, 212, 0.2)',
                borderRadius: '12px'
              }}>
                <p style={{ fontSize: '12px', color: 'var(--accent-3)', marginBottom: '8px', fontFamily: "'Fira Code', monospace" }}>
                  💡 THEME_TOGGLE
                </p>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Use the theme toggle in the header to switch between light and dark modes!
                </p>
              </div>
              
              <div style={{ 
                padding: '16px', 
                background: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '12px'
              }}>
                <p style={{ fontSize: '12px', color: 'var(--accent-3)', marginBottom: '8px', fontFamily: "'Fira Code', monospace" }}>
                  🌍 LOCALIZATION
                </p>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Change language from the header or preferences page.
                </p>
              </div>
              
              <div style={{ 
                padding: '16px', 
                background: 'rgba(96, 165, 250, 0.08)',
                border: '1px solid rgba(96, 165, 250, 0.2)',
                borderRadius: '12px'
              }}>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4" style={{ color: 'var(--accent-3)' }} />
                  <p style={{ fontSize: '12px', color: 'var(--accent-3)', fontFamily: "'Fira Code', monospace" }}>
                    TIME_FORMAT
                  </p>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Current format is {preferences.timeFormat}-hour. Change it in preferences!
                </p>
              </div>
            </div>
          </div>

          {/* Recently Logged-in Users - Removed for all users */}
        </div>
      </div>
    </div>
  );
};

const formatRelativeTime = (dateString) => {
  if (!dateString) return 'Never';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}w ago`;
  
  return date.toLocaleDateString();
};

export default Dashboard;
