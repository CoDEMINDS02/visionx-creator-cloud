import { Link } from 'react-router-dom';
import {
  Images,
  Gauge,
  Crown,
  ArrowRight,
  UploadCloud,
  Stethoscope,
  Wand2,
  Sparkles,
  Download,
  CheckCircle2,
} from 'lucide-react';
import { useHistory } from '../hooks/useHistory';
import { useAuth } from '../hooks/useAuth';
import HistoryGrid from '../components/history/HistoryGrid';
import CountUp from '../components/common/CountUp';

const QUICK_ACTIONS = [
  { to: '/upload', label: 'Upload a photo', desc: 'Start a new diagnosis', icon: UploadCloud, color: '#8B5CF6' },
  { to: '/diagnosis', label: 'Run diagnosis', desc: 'Check quality issues', icon: Stethoscope, color: '#3B82F6' },
  { to: '/enhancement', label: 'Enhance photo', desc: 'Apply AI fixes', icon: Wand2, color: '#EC4899' },
];

const GETTING_STARTED_STEPS = [
  { icon: UploadCloud, title: 'Upload a photo', desc: 'JPEG, PNG, WEBP or TIFF — straight from your device.' },
  { icon: Stethoscope, title: 'Get a real diagnosis', desc: 'VisionX scores sharpness, noise, exposure and more from the actual pixels.' },
  { icon: Wand2, title: 'Apply the right fixes', desc: 'Only the corrections your photo actually needs are applied.' },
  { icon: Download, title: 'Download the result', desc: 'Compare before & after, then save your enhanced photo.' },
];

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function Dashboard() {
  const { items, loading, removeItem } = useHistory({ pageSize: 6 });
  const { user } = useAuth();

  const totalProcessed = items.length;
  const avgScore = items.length
    ? Math.round(items.reduce((sum, i) => sum + (i.score || 0), 0) / items.length)
    : 0;

  const STATS = [
    { label: 'Photos processed', end: totalProcessed, icon: Images, color: '#8B5CF6' },
    { label: 'Average quality score', end: avgScore, suffix: '%', icon: Gauge, color: '#3B82F6' },
    { label: 'Plan', value: user?.plan || 'Starter', icon: Crown, color: '#EC4899' },
  ];

  return (
    <div>
      {/* Welcome banner */}
      <div
        className="card"
        style={{
          marginBottom: 28, padding: '30px 34px',
          background: 'linear-gradient(120deg, rgba(139,92,246,.14), rgba(59,130,246,.08))',
          border: '1px solid rgba(139,92,246,.25)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20,
        }}
      >
        <div>
          <div className="eyebrow" style={{ marginBottom: 12 }}><Sparkles size={12} /> Welcome back</div>
          <h2 style={{ fontSize: 26 }}>{greeting()}{user?.name ? `, ${user.name}` : ''}!</h2>
          <p style={{ marginTop: 8, fontSize: 14.5, color: 'var(--text-soft)' }}>
            Here's a quick look at what you've diagnosed and fixed so far.
          </p>
        </div>
        <Link to="/upload" className="btn btn-primary">
          Upload a photo <ArrowRight size={15} />
        </Link>
      </div>

      {/* Stat cards */}
      <div className="stat-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div className="card" key={stat.label}>
              <div
                className="icon-tile"
                style={{
                  width: 40, height: 40, borderRadius: 11,
                  background: `${stat.color}22`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 16,
                }}
              >
                <Icon size={19} style={{ color: stat.color }} />
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-soft)' }}>{stat.label}</p>
              <p style={{ fontSize: 30, fontWeight: 800, marginTop: 6 }}>
                {stat.value !== undefined ? stat.value : <CountUp end={stat.end} suffix={stat.suffix || ''} />}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-soft)', marginBottom: 14, letterSpacing: '.02em' }}>
        QUICK ACTIONS
      </p>
      <div className="stat-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 40 }}>
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Link to={action.to} key={action.to} className="card card-hover" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                className="icon-tile"
                style={{
                  width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                  background: `${action.color}22`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Icon size={19} style={{ color: action.color }} />
              </div>
              <div style={{ flexGrow: 1 }}>
                <p style={{ fontSize: 14.5, fontWeight: 700 }}>{action.label}</p>
                <p style={{ fontSize: 12.5, color: 'var(--text-dim)' }}>{action.desc}</p>
              </div>
              <ArrowRight size={15} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
            </Link>
          );
        })}
      </div>

      {items.length === 0 && !loading ? (
        <>
          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-soft)', marginBottom: 14, letterSpacing: '.02em' }}>
            GETTING STARTED
          </p>
          <div className="card" style={{ padding: '34px 36px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }} className="getting-started-grid">
              {GETTING_STARTED_STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <div
                        className="icon-tile"
                        style={{
                          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                          background: 'var(--grad-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <Icon size={16} color="#fff" />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-dim)' }}>STEP {i + 1}</span>
                    </div>
                    <p style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 6 }}>{step.title}</p>
                    <p style={{ fontSize: 12.5, color: 'var(--text-soft)', lineHeight: 1.5 }}>{step.desc}</p>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 28, paddingTop: 24, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <p style={{ fontSize: 13.5, color: 'var(--text-soft)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={16} style={{ color: '#86EFAC' }} /> Everything runs in your browser — your photos are never uploaded anywhere.
              </p>
              <Link to="/upload" className="btn btn-primary">
                Upload your first photo <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: 20 }}>Recent activity</h3>
            <Link to="/history" className="btn btn-ghost btn-sm">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <HistoryGrid items={items} onView={() => {}} onDelete={removeItem} />
        </>
      )}
    </div>
  );
}
