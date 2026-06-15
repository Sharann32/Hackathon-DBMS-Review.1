import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { usePreferences } from '../../contexts/PreferencesContext';
import { Moon, Sun, Clock, Globe, LogOut, User } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, changeLanguage, t } = useLanguage();
  const { preferences } = usePreferences();

  const handleThemeToggle = () => {
    console.log('🖱️ Theme button clicked in Header. Current theme:', theme);
    toggleTheme();
  };

  const formatTime = () => {
    const now = new Date();
    if (preferences.timeFormat === '24') {
      return now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    }
    return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <header className="navbar" style={{ position: 'sticky', top: 0 }}>
      <div className="flex items-center gap-6" style={{ flex: 1 }}>
        <div>
          <h2 style={{ 
            fontSize: '16px', 
            fontWeight: 600, 
            color: 'var(--text-primary)',
            marginBottom: '2px'
          }}>
            {t('app.title') || 'Settings & Configuration Management'}
          </h2>
          <div className="flex items-center gap-2" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            <Clock className="w-3 h-3" />
            <span style={{ fontFamily: "'Fira Code', monospace" }}>
              {formatTime()} • {preferences.timezone}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Language Selector */}
        <div style={{ position: 'relative' }}>
          <select
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="input-field"
            style={{
              padding: '8px 12px',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              appearance: 'none',
              paddingRight: '32px',
              minWidth: '120px'
            }}
          >
            <option value="en">🇬🇧 English</option>
            <option value="te">🇮🇳 తెలుగు</option>
            <option value="hi">🇮🇳 हिंदी</option>
          </select>
          <Globe className="w-4 h-4" style={{ 
            position: 'absolute', 
            right: '10px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
            pointerEvents: 'none'
          }} />
        </div>

        {/* Theme Toggle */}
        <button
          onClick={handleThemeToggle}
          className="btn-ghost"
          title={`Current: ${theme} theme`}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            padding: '8px 14px'
          }}
        >
          {theme === 'dark' ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4" />
          )}
          <span className="hidden sm:inline" style={{ fontSize: '12px' }}>
            {theme}
          </span>
        </button>

        {/* Time Format Display */}
        <div className="badge-admin hidden lg:flex" style={{ gap: '6px', alignItems: 'center' }}>
          <Clock className="w-3 h-3" />
          <span>{preferences.timeFormat}H</span>
        </div>

        {/* User Info */}
        <div className="hidden md:flex items-center gap-3" style={{
          padding: '8px 14px',
          background: 'rgba(6, 182, 212, 0.08)',
          border: '1px solid rgba(6, 182, 212, 0.2)',
          borderRadius: '100px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            background: 'var(--gradient)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 700,
            color: '#fff'
          }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <p style={{ 
              fontSize: '13px', 
              fontWeight: 600, 
              color: 'var(--text-primary)',
              lineHeight: 1.2
            }}>
              {user?.name}
            </p>
            <p style={{ 
              fontSize: '11px', 
              color: 'var(--text-muted)',
              fontFamily: "'Fira Code', monospace"
            }}>
              {user?.email}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="btn-outline"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            borderColor: 'rgba(239, 68, 68, 0.4)',
            color: '#f87171'
          }}
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">
            {t('auth.logout') || 'Logout'}
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;
