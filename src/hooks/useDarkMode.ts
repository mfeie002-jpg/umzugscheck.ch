import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';

export const useDarkMode = () => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as Theme) || 'system';
    }
    return 'system';
  });

  const [isDark, setIsDark] = useState(false);

  const applyTheme = useCallback((newTheme: Theme) => {
    const root = document.documentElement;
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const shouldBeDark = newTheme === 'dark' || (newTheme === 'system' && systemDark);
    
    if (shouldBeDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    setIsDark(shouldBeDark);
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  }, [applyTheme]);

  const toggleTheme = useCallback(() => {
    const newTheme = isDark ? 'light' : 'dark';
    setTheme(newTheme);
  }, [isDark, setTheme]);

  useEffect(() => {
    applyTheme(theme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, applyTheme]);

  return { theme, setTheme, toggleTheme, isDark };
};
