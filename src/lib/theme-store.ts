import { create } from 'zustand';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  resolvedTheme: () => 'light' | 'dark';
}

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return;
  const resolved = theme === 'system' ? getSystemTheme() : theme;
  document.documentElement.classList.toggle('dark', resolved === 'dark');
}

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'system';
  const stored = localStorage.getItem('pickpick-theme') as Theme | null;
  return stored || 'system';
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: 'system',
  setTheme: (theme: Theme) => {
    localStorage.setItem('pickpick-theme', theme);
    applyTheme(theme);
    set({ theme });
  },
  toggleTheme: () => {
    const current = get().theme;
    const next = current === 'light' ? 'dark' : current === 'dark' ? 'system' : 'light';
    get().setTheme(next);
  },
  resolvedTheme: () => {
    const theme = get().theme;
    return theme === 'system' ? getSystemTheme() : theme;
  },
}));

// Initialize on load
if (typeof window !== 'undefined') {
  const initial = getInitialTheme();
  useThemeStore.setState({ theme: initial });
  applyTheme(initial);
}
