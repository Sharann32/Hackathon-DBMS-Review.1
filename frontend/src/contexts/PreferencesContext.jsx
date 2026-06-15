import { createContext, useContext, useState, useEffect } from 'react';

const PreferencesContext = createContext();

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within PreferencesProvider');
  }
  return context;
};

const defaultPreferences = {
  timeFormat: '12', // '12' or '24'
  timezone: 'Asia/Kolkata',
  dateFormat: 'DD/MM/YYYY',
  emailNotifications: true,
  inAppNotifications: true,
  systemAlerts: true,
  dashboardCards: {
    totalSettings: true,
    userSettings: true,
    systemSettings: true,
    categories: true,
  },
  dashboardLayout: 'grid', // 'grid' or 'list'
};

export const PreferencesProvider = ({ children }) => {
  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem('userPreferences');
    return saved ? JSON.parse(saved) : defaultPreferences;
  });

  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  }, [preferences]);

  const updatePreference = (key, value) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateDashboardCard = (card, visible) => {
    setPreferences((prev) => ({
      ...prev,
      dashboardCards: {
        ...prev.dashboardCards,
        [card]: visible,
      },
    }));
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    localStorage.setItem('userPreferences', JSON.stringify(defaultPreferences));
  };

  return (
    <PreferencesContext.Provider 
      value={{ 
        preferences, 
        updatePreference, 
        updateDashboardCard,
        resetPreferences 
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};
