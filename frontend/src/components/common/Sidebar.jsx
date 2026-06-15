import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { LayoutDashboard, Settings, Folder, Palette, User, FileText, Sparkles, Database } from 'lucide-react';

const Sidebar = () => {
  const { isAdmin } = useAuth();
  const { t } = useLanguage();

  const navItems = [
    { path: '/dashboard', label: t('dashboard.title') || 'Dashboard', icon: LayoutDashboard },
    { path: '/settings', label: t('settings.title') || 'Settings', icon: Settings },
    { path: '/categories', label: t('categories.title') || 'Categories', icon: Folder },
    { path: '/assistant', label: 'AI Assistant', icon: Sparkles },
    { path: '/preferences', label: t('preferences.title') || 'Preferences', icon: Palette },
    { path: '/profile', label: t('profile.title') || 'Profile', icon: User },
  ];

  if (isAdmin()) {
    navItems.push(
      { path: '/mongo-data', label: 'AI Data Manager', icon: Database },
      { path: '/audit', label: 'Audit Logs', icon: FileText }
    );
  }

  return (
    <div style={{ 
      width: '280px', 
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border)',
      minHeight: '100vh',
      position: 'relative'
    }}>
      {/* Logo Section */}
      <div style={{ 
        padding: '24px 20px',
        borderBottom: '1px solid var(--border)'
      }}>
        <div className="flex items-center gap-3">
          <div style={{
            width: '40px',
            height: '40px',
            background: 'var(--gradient)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Settings className="w-5 h-5" style={{ color: '#fff' }} />
          </div>
          <div>
            <h1 className="gradient-text" style={{ 
              fontSize: '18px', 
              fontWeight: 700,
              marginBottom: '2px'
            }}>
              Settings
            </h1>
            <p style={{ 
              fontSize: '11px', 
              color: 'var(--text-muted)',
              fontFamily: "'Fira Code', monospace"
            }}>
              CONFIG_SYS
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ padding: '16px 12px' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                marginBottom: '4px',
                borderRadius: '10px',
                textDecoration: 'none',
                transition: 'var(--transition)',
                position: 'relative',
                background: isActive ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
                color: isActive ? 'var(--accent-3)' : 'var(--text-secondary)',
                borderLeft: isActive ? '3px solid var(--accent-1)' : '3px solid transparent',
              })}
              className="nav-link-hover"
            >
              {({ isActive }) => (
                <>
                  <Icon className="w-5 h-5" style={{ 
                    color: isActive ? 'var(--accent-2)' : 'var(--text-muted)',
                    transition: 'var(--transition)'
                  }} />
                  <span style={{ 
                    fontSize: '14px', 
                    fontWeight: isActive ? 600 : 500,
                    flex: 1
                  }}>
                    {item.label}
                  </span>
                  {isActive && (
                    <div style={{
                      width: '6px',
                      height: '6px',
                      background: 'var(--accent-1)',
                      borderRadius: '50%',
                      boxShadow: '0 0 8px var(--accent-1)'
                    }} />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Section */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '20px',
        borderTop: '1px solid var(--border)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'var(--gradient)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: 700,
            color: '#fff'
          }}>
            {isAdmin() ? 'A' : 'U'}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ 
              fontSize: '13px', 
              fontWeight: 600, 
              color: 'var(--text-primary)',
              marginBottom: '2px'
            }}>
              {isAdmin() ? 'Admin User' : 'User'}
            </p>
            <span className={isAdmin() ? 'badge-admin' : 'badge-active'} style={{ fontSize: '10px' }}>
              {isAdmin() ? 'ADMIN' : 'USER'}
            </span>
          </div>
        </div>
      </div>

      <style>{`
        .nav-link-hover:hover {
          background: rgba(6, 182, 212, 0.08) !important;
          color: var(--accent-3) !important;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
