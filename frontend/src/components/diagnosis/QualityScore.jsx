import { scoreLabel } from '../../utils/formatting';
import CountUp from '../common/CountUp';

export default function QualityScore({ score, size = 96 }) {
  const pct = Math.max(0, Math.min(100, score));
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  const color = pct >= 80 ? '#22C55E' : pct >= 50 ? '#F59E0B' : '#EF4444';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
      <div className="score-ring-wrap" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="var(--ring-track)" strokeWidth="7" fill="none" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth="7"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset .6s ease' }}
          />
        </svg>
        <div className="score-ring-value">
          <span style={{ fontSize: size * 0.26 }}><CountUp end={pct} loop={false} suffix="%" /></span>
        </div>
      </div>
      <div>
        <p style={{ fontSize: 13, color: 'var(--text-soft)' }}>Quality score</p>
        <p style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>{scoreLabel(score)}</p>
      </div>
    </div>
  );
}
