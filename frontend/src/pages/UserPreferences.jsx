import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { usePreferences } from '../contexts/PreferencesContext';
import { Sun, Moon, Globe, Clock, Calendar, Bell, Layout, Save } from 'lucide-react';
import { toast } from 'react-toastify';
import { timezones } from '../utils/dateTime';

const UserPreferences = () => {
  const { theme, setThemeMode } = useTheme();
  const { language, changeLanguage, t } = useLanguage();
  const { preferences, updatePreference, updateDashboardCard, resetPreferences } = usePreferences();

  const [localPrefs, setLocalPrefs] = useState(preferences);

  const handleSave = () => {
    Object.keys(localPrefs).forEach(key => {
      if (key !== 'dashboardCards') {
        updatePreference(key, localPrefs[key]);
      }
    });
    
    if (localPrefs.dashboardCards) {
      Object.keys(localPrefs.dashboardCards).forEach(card => {
        updateDashboardCard(card, localPrefs.dashboardCards[card]);
      });
    }
    
    toast.success('Preferences saved successfully!');
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all preferences to default?')) {
      resetPreferences();
      setLocalPrefs(preferences);
      toast.info('Preferences reset to default');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('preferences.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Customize your application experience
        </p>
      </div>

      <div className="space-y-6">
        {/* Theme Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Sun className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Theme Settings
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setThemeMode('light')}
              className={`p-4 rounded-lg border-2 transition-all ${
                theme === 'light'
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'
              }`}
            >
              <Sun className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <p className="font-medium text-gray-900 dark:text-white">Light</p>
            </button>

            <button
              onClick={() => setThemeMode('dark')}
              className={`p-4 rounded-lg border-2 transition-all ${
                theme === 'dark'
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'
              }`}
            >
              <Moon className="w-8 h-8 mx-auto mb-2 text-indigo-500" />
              <p className="font-medium text-gray-900 dark:text-white">Dark</p>
            </button>
          </div>
        </div>

        {/* Language Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Globe className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Language Settings
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { code: 'en', name: 'English', flag: '🇺🇸' },
              { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
              { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  language === lang.code
                    ? 'border-green-600 bg-green-50 dark:bg-green-900'
                    : 'border-gray-200 dark:border-gray-700 hover:border-green-400'
                }`}
              >
                <span className="text-4xl mb-2 block">{lang.flag}</span>
                <p className="font-medium text-gray-900 dark:text-white">{lang.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Time & Date Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Time & Date Settings
            </h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Time Format
              </label>
              <select
                value={localPrefs.timeFormat}
                onChange={(e) => setLocalPrefs({ ...localPrefs, timeFormat: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
              >
                <option value="12">12-Hour Format (2:30 PM)</option>
                <option value="24">24-Hour Format (14:30)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Timezone
              </label>
              <select
                value={localPrefs.timezone}
                onChange={(e) => setLocalPrefs({ ...localPrefs, timezone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
              >
                {timezones.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date Format
              </label>
              <select
                value={localPrefs.dateFormat}
                onChange={(e) => setLocalPrefs({ ...localPrefs, dateFormat: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2026)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2026)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (2026-12-31)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Bell className="w-5 h-5 text-orange-600 dark:text-orange-400 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Notification Preferences
            </h2>
          </div>
          
          <div className="space-y-4">
            {[
              { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
              { key: 'inAppNotifications', label: 'In-App Notifications', desc: 'Show notifications within the app' },
              { key: 'systemAlerts', label: 'System Alerts', desc: 'Critical system updates and alerts' },
            ].map((notif) => (
              <div key={notif.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{notif.label}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{notif.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localPrefs[notif.key]}
                    onChange={(e) => setLocalPrefs({ ...localPrefs, [notif.key]: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard Preferences */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Layout className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Dashboard Preferences
            </h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Dashboard Layout
              </label>
              <select
                value={localPrefs.dashboardLayout}
                onChange={(e) => setLocalPrefs({ ...localPrefs, dashboardLayout: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              >
                <option value="grid">Grid Layout</option>
                <option value="list">List Layout</option>
              </select>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Visible Dashboard Cards
              </p>
              <div className="space-y-2">
                {[
                  { key: 'totalSettings', label: 'Total Settings' },
                  { key: 'userSettings', label: 'User Settings' },
                  { key: 'systemSettings', label: 'System Settings' },
                  { key: 'categories', label: 'Categories' },
                ].map((card) => (
                  <label key={card.key} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                    <input
                      type="checkbox"
                      checked={localPrefs.dashboardCards?.[card.key] ?? true}
                      onChange={(e) => setLocalPrefs({
                        ...localPrefs,
                        dashboardCards: {
                          ...localPrefs.dashboardCards,
                          [card.key]: e.target.checked,
                        },
                      })}
                      className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="ml-3 text-gray-900 dark:text-white">{card.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleReset}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Reset to Default
          </button>
          
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPreferences;
