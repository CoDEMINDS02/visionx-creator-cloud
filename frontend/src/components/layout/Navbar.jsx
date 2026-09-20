import { Link, NavLink } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import ThemeToggle from '../common/ThemeToggle';

const NAV_LINKS = [
  { to: '/#pipeline', label: 'How it works' },
  { to: '/#features', label: 'Features' },
  { to: '/#pricing', label: 'Pricing' },
];

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 0 }}>
        <Link to="/" className="brand">
          <svg className="brand-mark" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="navlogo" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="55%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
            <path d="M4 4L18 30L32 4H24.5L18 16.5L11.5 4H4Z" fill="url(#navlogo)" />
          </svg>
          <span className="brand-name">
            VISION<span className="x">X</span>
            <span className="brand-sub">CREATOR CLOUD</span>
          </span>
        </Link>

        <div className="nav-pills">
          {NAV_LINKS.map((link) => (
            <a key={link.to} href={link.to}>
              {link.label}
            </a>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <ThemeToggle compact />
          {user ? (
            <>
              <Link to="/dashboard" className="btn btn-ghost">
                Dashboard
              </Link>
              <button className="btn btn-outline btn-sm" onClick={logout}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">
                Sign In
              </Link>
              <Link to="/signup" className="btn btn-primary">
                Get Started Free <ArrowRight size={15} />
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
