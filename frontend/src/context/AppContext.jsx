import { createContext, useState, useCallback, useEffect } from 'react';

export const AppContext = createContext(null);

let toastId = 0;

function getInitialTheme() {
  try {
    const stored = localStorage.getItem('visionx_theme');
    if (stored === 'light' || stored === 'dark') return stored;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
  } catch {
    // ignore — localStorage/matchMedia may be unavailable
  }
  return 'dark';
}

export function AppProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('visionx_theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const pushToast = useCallback((message, variant = 'default') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <AppContext.Provider
      value={{ toasts, pushToast, dismissToast, sidebarCollapsed, setSidebarCollapsed, theme, toggleTheme }}
    >
      {children}
    </AppContext.Provider>
  );
}
