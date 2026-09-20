import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export default function ThemeToggle({ compact = false }) {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  if (compact) {
    return (
      <button
        className="theme-toggle-btn"
        onClick={toggleTheme}
        aria-label={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
        title={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
      >
        {isLight ? <Moon size={16} /> : <Sun size={16} />}
      </button>
    );
  }

  return (
    <button className="theme-toggle-row" onClick={toggleTheme}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {isLight ? <Moon size={16} /> : <Sun size={16} />}
        {isLight ? 'Dark mode' : 'Light mode'}
      </span>
      <span className={`theme-switch ${isLight ? 'is-light' : ''}`}>
        <span className="theme-switch-knob" />
      </span>
    </button>
  );
}
