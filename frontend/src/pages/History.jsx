import { History as HistoryIcon, Images, TrendingUp } from 'lucide-react';
import { useHistory } from '../hooks/useHistory';
import HistoryFilters from '../components/history/HistoryFilters';
import HistoryGrid from '../components/history/HistoryGrid';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import PageHeader from '../components/common/PageHeader';
import CountUp from '../components/common/CountUp';

export default function History() {
  const { items, filters, setFilters, loading, removeItem } = useHistory();

  const avgScore = items.length
    ? Math.round(items.reduce((sum, i) => sum + (i.score || 0), 0) / items.length)
    : 0;
  const bestScore = items.length ? Math.max(...items.map((i) => i.score || 0)) : 0;

  return (
    <div>
      <PageHeader icon={HistoryIcon} title="History" description="Every photo you've diagnosed or enhanced, kept with its original." />

      {!loading && items.length > 0 && (
        <div className="stat-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className="icon-tile" style={{ width: 40, height: 40, borderRadius: 11, background: 'rgba(139,92,246,.16)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Images size={18} style={{ color: 'var(--purple)' }} />
            </div>
            <div>
              <p style={{ fontSize: 12.5, color: 'var(--text-soft)' }}>Total photos</p>
              <p style={{ fontSize: 22, fontWeight: 800 }}><CountUp end={items.length} loop={false} /></p>
            </div>
          </div>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className="icon-tile" style={{ width: 40, height: 40, borderRadius: 11, background: 'rgba(59,130,246,.16)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={18} style={{ color: 'var(--blue)' }} />
            </div>
            <div>
              <p style={{ fontSize: 12.5, color: 'var(--text-soft)' }}>Average score</p>
              <p style={{ fontSize: 22, fontWeight: 800 }}><CountUp end={avgScore} suffix="%" loop={false} /></p>
            </div>
          </div>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className="icon-tile" style={{ width: 40, height: 40, borderRadius: 11, background: 'rgba(236,72,153,.16)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={18} style={{ color: '#EC4899' }} />
            </div>
            <div>
              <p style={{ fontSize: 12.5, color: 'var(--text-soft)' }}>Best score</p>
              <p style={{ fontSize: 22, fontWeight: 800 }}><CountUp end={bestScore} suffix="%" loop={false} /></p>
            </div>
          </div>
        </div>
      )}

      {!loading && items.length > 0 && <HistoryFilters filters={filters} onChange={setFilters} />}

      {loading && <Loader label="Loading history…" />}

      {!loading && items.length === 0 && (
        <EmptyState
          icon={HistoryIcon}
          title="No history yet"
          description="Photos you diagnose or enhance will show up here, alongside their originals."
          actionTo="/upload"
          actionLabel="Upload a photo"
        />
      )}

      {!loading && items.length > 0 && (
        <HistoryGrid items={items} onView={() => {}} onDelete={removeItem} />
      )}
    </div>
  );
}
