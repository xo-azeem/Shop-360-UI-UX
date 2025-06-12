import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { getTheme, storeTheme } from '@/utils/storage';

// Define theme types
export type ThemeType = 'light' | 'dark';

// Define theme colors
export const lightTheme = {
  background: '#FFFFFF',
  surface: '#F5F5F5',
  primary: '#000000',
  secondary: '#666666',
  accent: '#333333',
  border: '#E0E0E0',
  text: '#000000',
  textSecondary: '#666666',
  tabBar: '#FFFFFF',
  tabBarBorder: '#E0E0E0',
  card: '#FFFFFF',
  cardBorder: '#E0E0E0',
  icon: '#000000',
  iconInactive: '#666666',
};

export const darkTheme = {
  background: '#000000',
  surface: '#1A1A1A',
  primary: '#FFFFFF',
  secondary: '#999999',
  accent: '#CCCCCC',
  border: '#333333',
  text: '#FFFFFF',
  textSecondary: '#999999',
  tabBar: '#000000',
  tabBarBorder: '#333333',
  card: '#1A1A1A',
  cardBorder: '#333333',
  icon: '#FFFFFF',
  iconInactive: '#666666',
};

// Create theme context
type ThemeContextType = {
  theme: ThemeType;
  colors: typeof lightTheme;
  toggleTheme: () => void;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  colors: lightTheme,
  toggleTheme: () => {},
  isDark: false,
});

// Theme provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceTheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeType>(deviceTheme === 'dark' ? 'dark' : 'light');

  // Load saved theme preference on mount
  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await getTheme();
      if (savedTheme !== null) {
        setTheme(savedTheme ? 'dark' : 'light');
      } else {
        setTheme(deviceTheme === 'dark' ? 'dark' : 'light');
      }
    };
    loadTheme();
  }, [deviceTheme]);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    await storeTheme(newTheme === 'dark');
  };

  const colors = theme === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 