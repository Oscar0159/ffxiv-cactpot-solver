import { createContext, useContext } from 'react';

export type Theme = 'dark' | 'light';

export type ThemeContextState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

export const ThemeContext = createContext<ThemeContextState | undefined>(
  undefined,
);

export const useTheme = (): ThemeContextState => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
