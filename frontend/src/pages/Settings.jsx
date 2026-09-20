import { useState, useContext } from 'react';
import { Settings as SettingsIcon, User, Palette, Bell, ShieldAlert, Crown, Calendar } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { AppContext } from '../context/AppContext';
import ThemeToggle from '../components/common/ThemeToggle';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import { formatDate } from '../utils/formatting';

export default function Settings() {
  const { user, logout, updateProfile } = useAuth();
  const { pushToast } = useContext(AppContext);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saving, setSaving] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyProduct, setNotifyProduct] = useState(false);

  const initial = user?.name?.trim()?.[0]?.toUpperCase() || '?';

  const handleSave = () => {
    setSaving(true);
    try {
      updateProfile({ name: name.trim(), email: email.trim().toLowerCase() });
      pushToast('Profile updated.', 'success');
    } catch (err) {
      pushToast(err.message || 'Could not save changes.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader icon={SettingsIcon} title="Settings" description="Manage your account, appearance, and notification preferences." />

      <div className="dash-split" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 22, alignItems: 'start', maxWidth: 920 }}>
        <div>
          {/* Profile */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <User size={17} style={{ color: 'var(--purple)' }} />
              <p style={{ fontSize: 15, fontWeight: 700 }}>Profile</p>
            </div>
            <div className="field">
              <label>Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
            </div>
            <div className="field" style={{ marginBottom: 4 }}>
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <Button variant="primary" style={{ marginTop: 16 }} onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </Button>
          </div>

          {/* Appearance */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <Palette size={17} style={{ color: 'var(--purple)' }} />
              <p style={{ fontSize: 15, fontWeight: 700 }}>Appearance</p>
            </div>
            <p style={{ fontSize: 13.5, color: 'var(--text-soft)', marginBottom: 14 }}>
              Switch between light and dark theme. Your choice is remembered on this device.
            </p>
            <ThemeToggle />
          </div>

          {/* Notifications */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <Bell size={17} style={{ color: 'var(--purple)' }} />
              <p style={{ fontSize: 15, fontWeight: 700 }}>Notifications</p>
            </div>
            {[
              { label: 'Email me when a job finishes', value: notifyEmail, set: setNotifyEmail },
              { label: 'Product updates & tips', value: notifyProduct, set: setNotifyProduct },
            ].map((n) => (
              <label
                key={n.label}
                className="toggle-row"
              >
                {n.label}
                <input
                  type="checkbox"
                  checked={n.value}
                  onChange={() => n.set((v) => !v)}
                  style={{ width: 16, height: 16, accentColor: 'var(--purple)' }}
                />
              </label>
            ))}
          </div>

          {/* Danger zone */}
          <div className="card" style={{ borderColor: 'rgba(239,68,68,.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <ShieldAlert size={17} style={{ color: '#FCA5A5' }} />
              <p style={{ fontSize: 15, fontWeight: 700 }}>Account</p>
            </div>
            <p style={{ fontSize: 13.5, color: 'var(--text-soft)', marginBottom: 16 }}>
              Sign out of VisionX on this device.
            </p>
            <Button variant="outline" onClick={logout}>Sign out</Button>
          </div>
        </div>

        {/* Right column: profile card + plan */}
        <div>
          <div className="card" style={{ textAlign: 'center', marginBottom: 20 }}>
            {user?.picture ? (
              <img
                src={user.picture}
                alt={user.name}
                referrerPolicy="no-referrer"
                style={{ width: 72, height: 72, borderRadius: '50%', margin: '0 auto 16px', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <div
                style={{
                  width: 72, height: 72, borderRadius: '50%', margin: '0 auto 16px',
                  background: 'var(--grad-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 26, fontWeight: 800, color: '#fff',
                }}
              >
                {initial}
              </div>
            )}
            <p style={{ fontSize: 16, fontWeight: 700 }}>{user?.name || 'Guest'}</p>
            <p style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 2 }}>{user?.email}</p>
            {user?.createdAt && (
              <p style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <Calendar size={12} /> Joined {formatDate(user.createdAt)}
              </p>
            )}
          </div>

          <div
            className="card"
            style={{
              background: 'linear-gradient(135deg, rgba(139,92,246,.14), rgba(236,72,153,.08))',
              border: '1px solid rgba(139,92,246,.3)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <Crown size={17} style={{ color: '#EC4899' }} />
              <p style={{ fontSize: 15, fontWeight: 700 }}>{user?.plan || 'Starter'} plan</p>
            </div>
            <p style={{ fontSize: 13.5, color: 'var(--text-soft)', marginBottom: 18 }}>
              Upgrade to Studio for unlimited diagnoses, the full enhancement suite, and batch processing.
            </p>
            <Button variant="accent" style={{ width: '100%' }}>Upgrade plan</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
