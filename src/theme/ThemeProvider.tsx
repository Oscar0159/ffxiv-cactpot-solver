import { useEffect, useMemo, useState } from 'react';

import { ThemeContext } from './ThemeContext';
import type { Theme, ThemeContextState } from './ThemeContext';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};
export function ThemeProvider({
  children,
  defaultTheme = 'dark',
  storageKey = 'vite-ui-theme',
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
  );

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
  }, [theme]);

  const value = useMemo<ThemeContextState>(
    () => ({
      theme,
      setTheme: (t: Theme) => {
        localStorage.setItem(storageKey, t);
        setTheme(t);
      },
    }),
    [theme, storageKey],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
