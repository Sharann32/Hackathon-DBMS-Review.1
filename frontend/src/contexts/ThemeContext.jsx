import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    console.log('🎨 Initial theme from localStorage:', saved);
    return saved || 'light';
  });

  useEffect(() => {
    console.log('🔄 Theme effect triggered. Current theme:', theme);
    const root = window.document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    // Add the current theme class
    root.classList.add(theme);
    console.log('✅ Theme set to:', theme, '| Classes:', root.className);
    
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    console.log('🎯 Toggle theme clicked. Current theme:', theme);
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      console.log('➡️ Theme changing from', prev, 'to', next);
      return next;
    });
  };

  const setThemeMode = (mode) => {
    console.log('🎨 setThemeMode called with:', mode);
    setTheme(mode);
  };

  const value = {
    theme,
    toggleTheme,
    setThemeMode
  };

  console.log('🔧 ThemeProvider rendering. Current theme:', theme);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
