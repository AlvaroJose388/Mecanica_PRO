'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme?: 'dark' | 'light';
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'mecanicapro-theme',
  attribute = 'class',
}: {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  enableSystem?: boolean;
  attribute?: string;
}) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  // Solo después del montaje tenemos acceso a localStorage y window
  useEffect(() => {
    const savedTheme = localStorage.getItem(storageKey) as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
    setMounted(true);
  }, [storageKey]);

  const resolvedTheme = useMemo(() => {
    if (!mounted) return undefined;
    if (theme !== 'system') return theme as 'light' | 'dark';
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return undefined;
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted || !resolvedTheme) return;

    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);
    
    if (attribute === 'class') {
      root.setAttribute('class', resolvedTheme);
    }
  }, [resolvedTheme, attribute, mounted]);

  const value = useMemo(() => ({
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    },
    resolvedTheme,
  }), [theme, resolvedTheme, storageKey]);

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
