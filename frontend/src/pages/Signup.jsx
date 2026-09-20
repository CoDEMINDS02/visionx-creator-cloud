import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import editproImg from '../assets/images/editpro-showcase.jpg';
import CountUp from '../components/common/CountUp';
import {
  Sparkles,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Gift,
  Cpu,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  ArrowRight as ArrowIcon,
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import ToastStack from '../components/common/Toast';
import { useAuth } from '../hooks/useAuth';
import { AppContext } from '../context/AppContext';
import { isGoogleConfigured } from '../utils/googleAuth';

const HIGHLIGHTS = [
  { icon: Gift, title: 'Free Credits', desc: 'Start with 10 free image credits' },
  { icon: Cpu, title: 'Advanced AI Models', desc: 'Powered by cutting-edge technology' },
  { icon: ShieldCheck, title: 'Secure & Private', desc: 'Your data is always protected' },
];

const CHECKS = ['Sharpness', 'Noise Reduction', 'Color Correction', 'Face Restoration'];

function Avatars() {
  const colors = ['#8B5CF6', '#3B82F6', '#EC4899'];
  return (
    <div style={{ display: 'flex' }}>
      {colors.map((c, i) => (
        <div
          key={i}
          style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: '2px solid var(--bg)', marginLeft: i === 0 ? 0 : -9 }}
        />
      ))}
    </div>
  );
}

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { signup, loginWithGoogle } = useAuth();
  const { pushToast } = useContext(AppContext);
  const navigate = useNavigate();
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      pushToast(err.message || 'Google sign-in failed.', 'error');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await signup(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Could not create your account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 50, alignItems: 'center', padding: '48px 32px 60px' }}>
        {/* Left: showcase panel */}
        <div>
          <div className="eyebrow"><Sparkles size={12} /> Join 50,000+ Creators</div>
          <h1 style={{ fontSize: 40, lineHeight: 1.15, marginTop: 18 }}>
            Create Your Account and Start Enhancing <span className="text-gradient">Images with AI</span>
          </h1>
          <p style={{ marginTop: 18, fontSize: 15.5, color: 'var(--text-soft)', maxWidth: 440 }}>
            Join VisionX Creator Cloud and get access to powerful AI tools for image diagnosis,
            enhancement and restoration. Turn your ordinary photos into extraordinary visuals.
          </p>

          <div style={{ marginTop: 30, display: 'flex', flexDirection: 'column', gap: 18 }}>
            {HIGHLIGHTS.map((h) => {
              const Icon = h.icon;
              return (
                <div key={h.title} style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(139,92,246,.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={19} style={{ color: 'var(--purple)' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 14.5, fontWeight: 700 }}>{h.title}</p>
                    <p style={{ fontSize: 13, color: 'var(--text-soft)' }}>{h.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="card" style={{ marginTop: 32, padding: 0, overflow: 'hidden', maxWidth: 420 }}>
            <div style={{ height: 200, position: 'relative' }}>
              <img src={editproImg} alt="VisionX editing workspace" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <span
                style={{
                  position: 'absolute', top: 14, left: 14, fontSize: 11, fontWeight: 700,
                  background: 'rgba(8,8,15,.7)', padding: '5px 12px', borderRadius: 999,
                  border: '1px solid var(--border-strong)', display: 'flex', alignItems: 'center', gap: 5,
                }}
              >
                <Sparkles size={11} /> AI Enhanced
              </span>
            </div>
            <div style={{ padding: 18, display: 'flex', gap: 18, alignItems: 'center' }}>
              <div className="score-ring-wrap" style={{ width: 60, height: 60, flexShrink: 0 }}>
                <svg width="60" height="60">
                  <circle cx="30" cy="30" r="25" stroke="var(--ring-track)" strokeWidth="5" fill="none" />
                  <circle
                    cx="30" cy="30" r="25" stroke="#22D3EE" strokeWidth="5" fill="none"
                    strokeDasharray={2 * Math.PI * 25}
                    strokeDashoffset={(2 * Math.PI * 25) * 0.04}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="score-ring-value"><span style={{ fontSize: 13 }}><CountUp end={96} suffix="%" /></span></div>
              </div>
              <div>
                <p style={{ fontSize: 11.5, color: 'var(--text-soft)', marginBottom: 6 }}>Quality Score</p>
                {CHECKS.map((c) => (
                  <span key={c} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-soft)', marginRight: 12 }}>
                    <CheckCircle2 size={11} style={{ color: '#86EFAC' }} /> {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 30 }}>
            <Avatars />
            <p style={{ fontSize: 13, color: 'var(--text-soft)' }}>
              Trusted by 50K+ creators, photographers and digital teams worldwide{' '}
              <ArrowIcon size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />
            </p>
          </div>
        </div>

        {/* Right: form */}
        <div className="card" style={{ maxWidth: 440, marginLeft: 'auto', width: '100%', boxShadow: 'var(--shadow-glow-purple)' }}>
          <h2 style={{ fontSize: 24 }}>Create Your Account</h2>
          <p style={{ marginTop: 8, fontSize: 14, color: 'var(--text-soft)' }}>
            Get started for free. No credit card required.
          </p>

          <form onSubmit={handleSubmit} style={{ marginTop: 26 }}>
            <div className="field">
              <label>Full Name</label>
              <div className="input-wrap">
                <User />
                <input type="text" placeholder="Enter your full name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
            </div>

            <div className="field">
              <label>Email Address</label>
              <div className="input-wrap">
                <Mail />
                <input type="email" placeholder="Enter your email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>

            <div className="field">
              <label>Password</label>
              <div className="input-wrap">
                <Lock />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" className="toggle-visibility" onClick={() => setShowPassword((s) => !s)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="field">
              <label>Confirm Password</label>
              <div className="input-wrap">
                <Lock />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
                <button type="button" className="toggle-visibility" onClick={() => setShowConfirm((s) => !s)}>
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <p style={{ color: '#FCA5A5', fontSize: 13.5, marginBottom: 14 }}>{error}</p>}

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'} <ArrowRight size={15} />
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
            <div style={{ flexGrow: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontSize: 12.5, color: 'var(--text-dim)' }}>Or continue with</span>
            <div style={{ flexGrow: 1, height: 1, background: 'var(--border)' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <button className="btn btn-outline" onClick={handleGoogleSignIn} disabled={googleLoading}>
              <svg width="16" height="16" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.87 2.7-6.62z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18z"/>
                <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.03l2.99-2.33z"/>
                <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.97l2.99 2.33C4.66 5.17 6.65 3.58 9 3.58z"/>
              </svg>
              {googleLoading ? 'Connecting…' : 'Google'}
            </button>
            <button className="btn btn-outline" onClick={() => pushToast('GitHub sign-in isn\'t connected in this build yet.')}>GitHub</button>
          </div>

          {!isGoogleConfigured() && (
            <p style={{ marginTop: 12, fontSize: 12, color: 'var(--text-dim)', textAlign: 'center', lineHeight: 1.6 }}>
              Google Sign-In needs a one-time setup — add <code style={{ background: 'var(--surface)', padding: '1px 6px', borderRadius: 4 }}>VITE_GOOGLE_CLIENT_ID</code> to your <code style={{ background: 'var(--surface)', padding: '1px 6px', borderRadius: 4 }}>.env</code> file.{' '}
              <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer" style={{ color: 'var(--purple)' }}>
                Get a Client ID
              </a>
            </p>
          )}

          <p style={{ marginTop: 22, fontSize: 13.5, color: 'var(--text-soft)', textAlign: 'center' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--purple)', fontWeight: 600 }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <p style={{ fontSize: 12.5, color: 'var(--text-dim)', display: 'flex', gap: 18 }}>
          <span>Transforming Images</span> <span>•</span> <span>Empowering Creators</span> <span>•</span> <span>Building the Future with AI</span>
        </p>
        <p style={{ fontSize: 12.5, color: 'var(--text-dim)' }}>© 2026 VisionX Creator Cloud. All rights reserved.</p>
      </div>
      <ToastStack />
    </div>
  );
}
