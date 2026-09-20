import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export function useTheme() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useTheme must be used within an AppProvider');
  return { theme: ctx.theme, toggleTheme: ctx.toggleTheme };
}
