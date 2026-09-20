import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UploadCloud,
  Stethoscope,
  Wand2,
  GalleryHorizontalEnd,
  History as HistoryIcon,
  Settings as SettingsIcon,
  LogOut,
} from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';
import { useAuth } from '../../hooks/useAuth';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/upload', label: 'Upload', icon: UploadCloud },
  { to: '/diagnosis', label: 'Diagnosis', icon: Stethoscope },
  { to: '/enhancement', label: 'Enhancement', icon: Wand2 },
  { to: '/results', label: 'Results', icon: GalleryHorizontalEnd },
  { to: '/history', label: 'History', icon: HistoryIcon },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const initial = user?.name?.trim()?.[0]?.toUpperCase() || '?';

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <svg width="28" height="28" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="sblogo" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
          <path d="M4 4L18 30L32 4H24.5L18 16.5L11.5 4H4Z" fill="url(#sblogo)" />
        </svg>
      </div>
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'active' : '')}>
            <Icon />
            {item.label}
          </NavLink>
        );
      })}

      <div className="sidebar-footer">
        <div className="sidebar-user">
          {user?.picture ? (
            <img src={user.picture} alt={user.name} className="sidebar-user-avatar-img" referrerPolicy="no-referrer" />
          ) : (
            <div className="sidebar-user-avatar">{initial}</div>
          )}
          <div style={{ flexGrow: 1, minWidth: 0 }}>
            <p className="sidebar-user-name">{user?.name || 'Guest'}</p>
            <p className="sidebar-user-plan">{user?.plan || 'Starter'} plan</p>
          </div>
          <button className="theme-toggle-btn" onClick={logout} aria-label="Sign out" title="Sign out">
            <LogOut size={15} />
          </button>
        </div>
        <div style={{ marginTop: 10 }}>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
