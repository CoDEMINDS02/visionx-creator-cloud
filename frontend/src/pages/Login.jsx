import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import editproImg from '../assets/images/editpro-showcase.jpg';
import CountUp from '../components/common/CountUp';
import ThemeToggle from '../components/common/ThemeToggle';
import ToastStack from '../components/common/Toast';
import {
  Sparkles,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Grid3x3,
  Cloud,
  ArrowRight,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { AppContext } from '../context/AppContext';
import { isGoogleConfigured } from '../utils/googleAuth';

const HIGHLIGHTS = [
  { icon: Grid3x3, title: 'AI Analysis', desc: 'Detect issues instantly' },
  { icon: Sparkles, title: 'Smart Enhancement', desc: 'Improve quality with AI' },
  { icon: Cloud, title: 'Cloud Storage', desc: 'Access anywhere, anytime' },
];

function Avatars() {
  const colors = ['#8B5CF6', '#3B82F6', '#EC4899', '#22D3EE'];
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

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
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
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Could not sign in. Check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 40px' }}>
        <Link to="/" className="brand">
          <svg className="brand-mark" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="loginlogo" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
            <path d="M4 4L18 30L32 4H24.5L18 16.5L11.5 4H4Z" fill="url(#loginlogo)" />
          </svg>
          <span className="brand-name">
            VISION<span className="x">X</span>
            <span className="brand-sub">CREATOR CLOUD</span>
          </span>
        </Link>
        <p style={{ fontSize: 13.5, color: 'var(--text-soft)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 14, height: 1, background: 'var(--border-strong)', display: 'inline-block' }} />
          AI Image Diagnosis & Enhancement Platform
        </p>
        <p style={{ fontSize: 13.5, color: 'var(--text-soft)', display: 'flex', alignItems: 'center', gap: 14 }}>
          Don't have an account?{' '}
          <Link to="/signup" className="btn btn-outline btn-sm">
            Sign Up
          </Link>
          <ThemeToggle compact />
        </p>
      </div>

      <div className="wrap" style={{ flexGrow: 1, display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 50, alignItems: 'center', paddingTop: 20, paddingBottom: 40 }}>
        {/* Left: showcase panel */}
        <div>
          <div className="eyebrow"><Sparkles size={12} /> Welcome Back</div>
          <h1 style={{ fontSize: 42, lineHeight: 1.14, marginTop: 18 }}>
            Turn Your Images Into <span className="text-gradient">Something Extraordinary</span>
          </h1>
          <p style={{ marginTop: 18, fontSize: 15.5, color: 'var(--text-soft)', maxWidth: 420 }}>
            AI-powered tools to diagnose, enhance and transform your images with professional quality.
            Fast. Secure. Cloud-based.
          </p>

          <div className="card" style={{ marginTop: 34, padding: 0, overflow: 'hidden', maxWidth: 420 }}>
            <div style={{ height: 220, position: 'relative' }}>
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
              <div
                className="score-ring-wrap"
                style={{ position: 'absolute', bottom: 14, right: 14, width: 60, height: 60 }}
              >
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
            </div>
          </div>

          <div style={{ display: 'flex', gap: 26, marginTop: 30 }}>
            {HIGHLIGHTS.map((h) => {
              const Icon = h.icon;
              return (
                <div key={h.title} style={{ maxWidth: 130 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(139,92,246,.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                    <Icon size={17} style={{ color: 'var(--purple)' }} />
                  </div>
                  <p style={{ fontSize: 13.5, fontWeight: 700 }}>{h.title}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-soft)', marginTop: 2 }}>{h.desc}</p>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 34 }}>
            <Avatars />
            <p style={{ fontSize: 13, color: 'var(--text-soft)' }}>
              Trusted by 50K+ creators and digital teams worldwide
            </p>
          </div>
        </div>

        {/* Right: form */}
        <div className="card" style={{ maxWidth: 440, marginLeft: 'auto', width: '100%', boxShadow: 'var(--shadow-glow-purple)' }}>
          <h2 style={{ fontSize: 24 }}>Welcome Back</h2>
          <p style={{ marginTop: 8, fontSize: 14, color: 'var(--text-soft)' }}>
            Sign in to your account to continue your creative journey.
          </p>

          <form onSubmit={handleSubmit} style={{ marginTop: 28 }}>
            <div className="field">
              <label>Email Address</label>
              <div className="input-wrap">
                <Mail />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="field">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label>Password</label>
                <a
                  href="#"
                  style={{ fontSize: 12.5, color: 'var(--purple)' }}
                  onClick={(e) => { e.preventDefault(); pushToast('Password reset isn\'t wired up in this build yet.'); }}
                >
                  Forgot password?
                </a>
              </div>
              <div className="input-wrap">
                <Lock />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" className="toggle-visibility" onClick={() => setShowPassword((s) => !s)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <p style={{ color: '#FCA5A5', fontSize: 13.5, marginBottom: 14 }}>{error}</p>}

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'} <ArrowRight size={15} />
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '26px 0' }}>
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

          <p style={{ marginTop: 24, fontSize: 12.5, color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
            <ShieldCheck size={14} /> Your data is safe with us <Info size={12} />
          </p>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <p style={{ fontSize: 12.5, color: 'var(--text-dim)', display: 'flex', gap: 18 }}>
          <span>Better Images</span> <span>•</span> <span>Smarter Decisions</span> <span>•</span> <span>Powered by AI</span>
        </p>
        <p style={{ fontSize: 12.5, color: 'var(--text-dim)' }}>© 2026 VisionX Creator Cloud. All rights reserved.</p>
        <p style={{ fontSize: 12.5, color: 'var(--text-dim)', display: 'flex', gap: 16 }}>
          <a href="#">Privacy Policy</a> <a href="#">Terms of Service</a> <a href="#">Support</a>
        </p>
      </div>
      <ToastStack />
    </div>
  );
}
