import { Link } from 'react-router-dom';
import beforeImg from '../assets/images/before.jpg';
import afterImg from '../assets/images/after.jpg';
import dashboardPreviewImg from '../assets/images/dashboard-preview.jpg';
import BeforeAfterSlider from '../components/comparison/BeforeAfterSlider';
import CountUp from '../components/common/CountUp';
import {
  Sparkles,
  Play,
  Star,
  UploadCloud,
  BrainCircuit,
  SlidersHorizontal,
  Download,
  Images,
  Gauge,
  Users,
  CloudCog,
  ArrowRight,
  CheckCircle2,
  UserCircle2,
  Sun,
  Activity,
  Focus,
  Palette,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Quote,
  Stethoscope,
  Wand2,
  Layers,
  SlidersHorizontal as AdvancedIcon,
  Zap,
  ShieldCheck,
  FileStack,
  Cloud,
} from 'lucide-react';

const QUICK_TABS = [
  { icon: Stethoscope, label: 'Diagnose Photo' },
  { icon: Wand2, label: 'Enhance Photo' },
  { icon: Layers, label: 'Batch Process' },
  { icon: AdvancedIcon, label: 'Advanced' },
];

const CAPABILITIES = [
  { icon: Zap, label: 'Fast Processing', desc: 'Get results in seconds' },
  { icon: ShieldCheck, label: 'High Quality', desc: '4K / HD output' },
  { icon: FileStack, label: 'Multiple Formats', desc: 'JPG, PNG, WEBP' },
  { icon: Cloud, label: 'Cloud Powered', desc: 'Access anywhere, anytime' },
];

const STATS = [
  { icon: Images, end: 1, decimals: 0, suffix: 'M+', label: 'Images Processed' },
  { icon: Gauge, end: 98.7, decimals: 1, suffix: '%', label: 'Enhancement Accuracy' },
  { icon: Users, end: 50, decimals: 0, suffix: 'K+', label: 'Happy Users' },
  { icon: CloudCog, value: '24/7', label: 'Cloud Processing' },
];

const STEPS = [
  { icon: UploadCloud, title: 'Upload Image', desc: 'Drag & drop or choose from your device.' },
  { icon: BrainCircuit, title: 'AI Diagnosis', desc: 'Our AI analyzes quality, finds issues and suggests improvements.' },
  { icon: SlidersHorizontal, title: 'Smart Enhancement', desc: 'Advanced models apply optimal corrections.' },
  { icon: Download, title: 'Download Results', desc: 'Get your enhanced image in high quality.' },
];

const FEATURES = [
  { icon: UserCircle2, title: 'Face Restoration', desc: 'Bring back natural details and remove imperfections.' },
  { icon: Sun, title: 'Low Light Recovery', desc: 'Enhance dark images with AI precision.' },
  { icon: Activity, title: 'Noise Removal', desc: 'Eliminate unwanted noise for crystal clear results.' },
  { icon: Focus, title: 'Deblur Technology', desc: 'Remove blur and restore sharpness.' },
  { icon: Palette, title: 'Color Correction', desc: 'Balance colors and enhance vibrancy.' },
  { icon: Maximize2, title: 'Super Resolution', desc: 'Upscale images up to 4x with AI models.' },
];

const TESTIMONIALS = [
  {
    quote: 'VisionX has completely changed my workflow. The enhancement quality is incredible and saves me hours of editing.',
    name: 'Sarah Mitchell',
    role: 'Professional Photographer',
    color: '#8B5CF6',
  },
  {
    quote: 'The AI analysis is spot on. I love how it identifies issues and gives precise improvements. Highly recommended!',
    name: 'David Chen',
    role: 'Content Creator',
    color: '#3B82F6',
  },
  {
    quote: 'As a creative agency, VisionX helps me get the best quality for my projects. Super easy to use and powerful!',
    name: 'Emma Wilson',
    role: 'Creative Director',
    color: '#EC4899',
  },
];

const PRICING = [
  {
    plan: 'Starter',
    price: '$0',
    desc: 'For trying VisionX on real photos.',
    features: ['20 diagnoses / month', 'Basic enhancement suite', '2 GB result storage', 'Community support'],
    featured: false,
  },
  {
    plan: 'Studio',
    price: '$29',
    desc: 'For creators and small teams processing shoots weekly.',
    features: [
      'Unlimited diagnoses',
      'Full enhancement suite, incl. super resolution',
      '100 GB result storage with full history',
      'Batch upload and processing',
      'Priority support',
    ],
    featured: true,
  },
  {
    plan: 'Archive',
    price: 'Custom',
    desc: 'For agencies and archives restoring large collections.',
    features: ['Unlimited everything', 'Dedicated storage cluster', 'Custom-tuned models', 'SSO and audit logs'],
    featured: false,
  },
];

function Avatars() {
  const colors = ['#8B5CF6', '#3B82F6', '#EC4899'];
  return (
    <div style={{ display: 'flex' }}>
      {colors.map((c, i) => (
        <div
          key={i}
          style={{
            width: 30, height: 30, borderRadius: '50%',
            background: c, border: '2px solid var(--bg)',
            marginLeft: i === 0 ? 0 : -10,
          }}
        />
      ))}
    </div>
  );
}

function Stars({ count = 5 }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={13} fill="#F59E0B" color="#F59E0B" />
      ))}
    </div>
  );
}

export default function Landing() {
  return (
    <div>
      {/* ---------- HERO ---------- */}
      <header style={{ padding: '56px 0 70px' }}>
        <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1.55fr 0.9fr', gap: 26, alignItems: 'stretch' }}>
          {/* Left column: copy + visual + quick actions */}
          <div>
            <div className="eyebrow"><Sparkles size={13} /> AI-Powered Image Intelligence</div>
            <h1 style={{ fontSize: 42, lineHeight: 1.12, marginTop: 18 }}>
              Transform Low-Quality Images Into <span className="text-gradient">Professional Visual Assets</span>
            </h1>
            <p style={{ marginTop: 18, fontSize: 15.5, color: 'var(--text-soft)', maxWidth: 520 }}>
              Analyze, diagnose and enhance images using advanced AI models. Improve sharpness, remove
              noise, restore details, and optimize image quality in seconds.
            </p>

            <div style={{ display: 'flex', gap: 14, marginTop: 26 }}>
              <Link to="/signup" className="btn btn-primary">
                Start Free <ArrowRight size={15} />
              </Link>
              <button className="btn btn-outline">
                <Play size={14} /> Watch Demo
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 24 }}>
              <Avatars />
              <p style={{ fontSize: 13, color: 'var(--text-soft)' }}>
                Trusted by 50K+ creators, photographers and digital teams worldwide
              </p>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 6 }}>
                <Stars />
                <span style={{ fontSize: 12.5, color: 'var(--text-dim)' }}>4.9/5</span>
              </span>
            </div>

            {/* Hero photo: a real before/after comparison, not a static shot */}
            <div style={{ marginTop: 26 }}>
              <BeforeAfterSlider beforeSrc={beforeImg} afterSrc={afterImg} height={210} />
            </div>

            {/* Quick actions / generator-style bar */}
            <div className="card" style={{ marginTop: 16, padding: 18 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
                {QUICK_TABS.map((tab, i) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.label}
                      className={i === 0 ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'}
                      style={{ border: i === 0 ? 'none' : '1px solid var(--border)' }}
                    >
                      <Icon size={14} /> {tab.label}
                    </button>
                  );
                })}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12 }}>
                <input
                  type="text"
                  placeholder="Describe what needs fixing — e.g. brighten, sharpen, remove noise…"
                  style={{
                    padding: '13px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)',
                    background: 'var(--bg-soft)', color: 'var(--text)', fontSize: 14,
                  }}
                />
                <button className="btn btn-primary">
                  <Sparkles size={15} /> Run AI
                </button>
              </div>
            </div>
          </div>

          {/* Right column: Quality Score panel spanning full hero height */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 7 }}>
              <Sparkles size={13} style={{ color: 'var(--purple)' }} /> Quality Score
            </p>
            <div style={{ textAlign: 'center', margin: '22px 0 14px' }}>
              <div className="score-ring-wrap" style={{ width: 128, height: 128, margin: '0 auto' }}>
                <svg width="128" height="128">
                  <circle cx="64" cy="64" r="54" stroke="var(--ring-track)" strokeWidth="9" fill="none" />
                  <circle
                    cx="64" cy="64" r="54" stroke="#22D3EE" strokeWidth="9" fill="none"
                    strokeDasharray={2 * Math.PI * 54}
                    strokeDashoffset={(2 * Math.PI * 54) * 0.04}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="score-ring-value"><span style={{ fontSize: 30 }}><CountUp end={96} suffix="%" /></span></div>
              </div>
              <span className="badge badge-low" style={{ marginTop: 14, display: 'inline-flex' }}>
                <CheckCircle2 size={12} /> Excellent
              </span>
            </div>

            <div style={{ marginTop: 6, flexGrow: 1 }}>
              {['Noise Reduction', 'Face Restoration', 'Color Correction', 'Super Resolution'].map((f) => (
                <div
                  key={f}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 9, fontSize: 13.5, color: 'var(--text-soft)',
                    padding: '11px 0', borderTop: '1px solid var(--border)',
                  }}
                >
                  <CheckCircle2 size={15} style={{ color: '#86EFAC', flexShrink: 0 }} />
                  {f}
                </div>
              ))}
            </div>

            <Link to="/upload" className="btn btn-outline" style={{ width: '100%', marginTop: 14 }}>
              Try with your photo
            </Link>
          </div>
        </div>

        {/* Capability strip */}
        <div className="wrap" style={{ marginTop: 16 }}>
          <div className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', padding: '22px 28px' }}>
            {CAPABILITIES.map((cap, i) => {
              const Icon = cap.icon;
              return (
                <div
                  key={cap.label}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 13,
                    borderLeft: i === 0 ? 'none' : '1px solid var(--border)',
                    paddingLeft: i === 0 ? 0 : 22,
                  }}
                >
                  <div className="icon-tile" style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(139,92,246,.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={17} style={{ color: 'var(--purple)' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 13.5, fontWeight: 700 }}>{cap.label}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-dim)' }}>{cap.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </header>

      {/* ---------- STATS ---------- */}
      <div className="wrap" style={{ paddingBottom: 10 }}>
        <div className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', padding: '26px 30px' }}>
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  borderLeft: i === 0 ? 'none' : '1px solid var(--border)',
                  paddingLeft: i === 0 ? 0 : 24,
                }}
              >
                <div className="icon-tile" style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--grad-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={19} color="#fff" />
                </div>
                <div>
                  <p style={{ fontSize: 22, fontWeight: 800 }}>
                    {stat.value ? stat.value : <CountUp end={stat.end} decimals={stat.decimals} suffix={stat.suffix} />}
                  </p>
                  <p style={{ fontSize: 12.5, color: 'var(--text-soft)' }}>{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---------- HOW IT WORKS ---------- */}
      <section id="pipeline">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow" style={{ margin: '0 auto 16px' }}><Sparkles size={12} /> Simple 4-Step Process</div>
            <h2>How VisionX Works</h2>
            <p>Get professional results in just 4 simple steps</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.title} style={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div
                      style={{
                        width: 60, height: 60, borderRadius: '50%', margin: '0 auto 18px',
                        background: 'var(--grad-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: 'var(--shadow-btn)',
                      }}
                    >
                      <Icon size={24} color="#fff" />
                    </div>
                    <h3 style={{ fontSize: 16.5 }}>{step.title}</h3>
                    <p style={{ fontSize: 13.5, color: 'var(--text-soft)', marginTop: 8, maxWidth: 190, marginLeft: 'auto', marginRight: 'auto' }}>
                      {step.desc}
                    </p>
                  </div>
                  {i < STEPS.length - 1 && (
                    <ChevronRight size={20} style={{ color: 'var(--text-dim)', marginTop: 18, flexShrink: 0 }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- BEFORE / AFTER ---------- */}
      <section>
        <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 56, alignItems: 'center' }}>
          <BeforeAfterSlider beforeSrc={beforeImg} afterSrc={afterImg} height={420} />

          <div>
            <div className="eyebrow"><Sparkles size={12} /> Real Results</div>
            <h2 style={{ fontSize: 32, marginTop: 16 }}>See the Difference</h2>
            <p style={{ marginTop: 14, fontSize: 15.5, color: 'var(--text-soft)' }}>
              Our AI technology brings out the best in your images with natural and professional enhancements.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 26 }}>
              {[
                { label: 'Sharpness', end: 48, prefix: '+', icon: Focus },
                { label: 'Noise', end: 72, prefix: '-', icon: Activity },
                { label: 'Quality', end: 65, prefix: '+', icon: Star },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div className="panel" key={stat.label}>
                    <Icon size={16} style={{ color: 'var(--purple)', marginBottom: 8 }} />
                    <p style={{ fontSize: 12, color: 'var(--text-soft)' }}>{stat.label}</p>
                    <p style={{ fontSize: 18, fontWeight: 800, color: '#86EFAC', marginTop: 2 }}>
                      <CountUp end={stat.end} prefix={stat.prefix} suffix="%" />
                    </p>
                  </div>
                );
              })}
            </div>

            <Link to="/signup" className="btn btn-primary" style={{ marginTop: 26 }}>
              Try It Yourself <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- FEATURES ---------- */}
      <section id="features">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow" style={{ margin: '0 auto 16px' }}><Sparkles size={12} /> Powerful AI Features</div>
            <h2>Advanced Tools for Perfect Images</h2>
            <p>Everything you need for professional image processing</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div className="card card-hover" key={f.title} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', cursor: 'pointer' }}>
                  <div className="icon-tile" style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(139,92,246,.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={20} style={{ color: 'var(--purple)' }} />
                  </div>
                  <div style={{ flexGrow: 1 }}>
                    <h3 style={{ fontSize: 16 }}>{f.title}</h3>
                    <p style={{ fontSize: 13.5, color: 'var(--text-soft)', marginTop: 6 }}>{f.desc}</p>
                  </div>
                  <ArrowRight size={16} className="feature-arrow" style={{ color: 'var(--text-dim)', flexShrink: 0, marginTop: 4, transition: 'transform .25s var(--ease), color .25s var(--ease)' }} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- DASHBOARD PREVIEW ---------- */}
      <section>
        <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 56, alignItems: 'center' }}>
          <div className="card" style={{ padding: 12, overflow: 'hidden' }}>
            <img
              src={dashboardPreviewImg}
              alt="VisionX dashboard preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-lg)' }}
            />
          </div>

          <div>
            <div className="eyebrow"><Sparkles size={12} /> Your Complete Workspace</div>
            <h2 style={{ fontSize: 32, marginTop: 16 }}>Everything Managed From One Powerful Dashboard</h2>
            <p style={{ marginTop: 14, fontSize: 15.5, color: 'var(--text-soft)' }}>
              Track your uploads, monitor processing, view results, and manage your history — all in one place.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, marginTop: 22 }}>
              {['Real-time analytics', 'Upload queue management', 'Easy results access', 'Complete history'].map((item) => (
                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', fontSize: 14.5 }}>
                  <CheckCircle2 size={17} style={{ color: '#86EFAC' }} /> {item}
                </li>
              ))}
            </ul>
            <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: 20 }}>
              Explore Dashboard <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- TESTIMONIALS ---------- */}
      <section>
        <div className="wrap">
          <div className="section-head">
            <h2>What Our Users Say</h2>
            <p>Join thousands of creators who trust VisionX for their image enhancement needs.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {TESTIMONIALS.map((t) => (
              <div className="card" key={t.name}>
                <Quote size={20} style={{ color: 'var(--purple)', opacity: 0.6 }} />
                <p style={{ fontSize: 14.5, color: 'var(--text-soft)', marginTop: 14, lineHeight: 1.6 }}>{t.quote}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20 }}>
                  <div
                    className="icon-tile"
                    style={{
                      width: 42, height: 42, borderRadius: '50%',
                      background: `linear-gradient(135deg, ${t.color}, ${t.color}99)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 700, color: '#fff', flexShrink: 0,
                    }}
                  >
                    {t.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700 }}>{t.name}</p>
                    <p style={{ fontSize: 12.5, color: 'var(--text-dim)' }}>{t.role}</p>
                  </div>
                </div>
                <div style={{ marginTop: 12 }}><Stars /></div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 30 }}>
            <button className="btn btn-outline btn-sm" style={{ padding: 10, borderRadius: '50%' }}><ChevronLeft size={16} /></button>
            <button className="btn btn-outline btn-sm" style={{ padding: 10, borderRadius: '50%' }}><ChevronRight size={16} /></button>
          </div>
        </div>
      </section>

      {/* ---------- PRICING ---------- */}
      <section id="pricing">
        <div className="wrap">
          <div className="section-head">
            <h2>Simple, Transparent Pricing</h2>
            <p>Start free. Upgrade when you're processing a full shoot or an archive.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
            {PRICING.map((p) => (
              <div
                key={p.plan}
                className="card"
                style={p.featured ? { border: '1px solid rgba(139,92,246,.5)', boxShadow: 'var(--shadow-glow-purple)' } : {}}
              >
                {p.featured && (
                  <span className="badge" style={{ background: 'var(--grad-brand)', color: '#fff', marginBottom: 14 }}>Most popular</span>
                )}
                <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-soft)' }}>{p.plan}</p>
                <p style={{ fontSize: 38, fontWeight: 800, marginTop: 10 }}>{p.price}</p>
                <p style={{ marginTop: 10, fontSize: 14, color: 'var(--text-soft)' }}>{p.desc}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '22px 0 26px' }}>
                  {p.features.map((f) => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 0', fontSize: 13.5, borderTop: '1px solid var(--border)' }}>
                      <CheckCircle2 size={14} style={{ color: '#86EFAC', flexShrink: 0 }} /> {f}
                    </li>
                  ))}
                </ul>
                <Link to="/signup" className={`btn ${p.featured ? 'btn-primary' : 'btn-outline'}`} style={{ width: '100%' }}>
                  {p.plan === 'Archive' ? 'Talk to us' : 'Get started'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FINAL CTA ---------- */}
      <section>
        <div className="wrap">
          <div
            className="card"
            style={{
              textAlign: 'center',
              padding: '64px 40px',
              background: 'radial-gradient(circle at 50% 0%, rgba(139,92,246,.18), transparent 60%)',
              border: '1px solid rgba(139,92,246,.3)',
            }}
          >
            <div className="eyebrow" style={{ margin: '0 auto 18px' }}><Sparkles size={12} /> Get Started Today</div>
            <h2 style={{ fontSize: 34, maxWidth: 520, margin: '0 auto' }}>Ready To Enhance Images With AI?</h2>
            <p style={{ marginTop: 14, fontSize: 15.5, color: 'var(--text-soft)' }}>
              Join 50,000+ creators and experience the future of image enhancement.
            </p>
            <div style={{ marginTop: 28 }}>
              <Link to="/signup" className="btn btn-primary">
                Launch VisionX Free <ArrowRight size={15} />
              </Link>
            </div>
            <p style={{ marginTop: 14, fontSize: 12.5, color: 'var(--text-dim)' }}>No credit card required</p>
          </div>
        </div>
      </section>
    </div>
  );
}
