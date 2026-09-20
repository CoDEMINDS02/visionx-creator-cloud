import { TrendingUp } from 'lucide-react';

export default function ImprovementStats({ before, after }) {
  const delta = after - before;
  return (
    <div style={{ display: 'flex', gap: 14, marginTop: 20 }}>
      <div className="panel" style={{ flex: 1 }}>
        <p style={{ fontSize: 12.5, color: 'var(--text-soft)' }}>Before</p>
        <p style={{ fontSize: 26, fontWeight: 800, marginTop: 4 }}>{before}</p>
      </div>
      <div className="panel" style={{ flex: 1 }}>
        <p style={{ fontSize: 12.5, color: 'var(--text-soft)' }}>After</p>
        <p style={{ fontSize: 26, fontWeight: 800, marginTop: 4 }}>{after}</p>
      </div>
      <div className="panel" style={{ flex: 1, borderColor: 'rgba(34,197,94,.3)' }}>
        <p style={{ fontSize: 12.5, color: 'var(--text-soft)', display: 'flex', alignItems: 'center', gap: 5 }}>
          <TrendingUp size={13} /> Improvement
        </p>
        <p style={{ fontSize: 26, fontWeight: 800, marginTop: 4, color: '#86EFAC' }}>+{delta}</p>
      </div>
    </div>
  );
}
