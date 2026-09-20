import HistoryCard from './HistoryCard';

export default function HistoryGrid({ items, onView, onDelete }) {
  if (!items.length) {
    return <p style={{ color: 'var(--text-soft)', fontSize: 14.5 }}>No processed photos yet.</p>;
  }

  return (
    <div className="history-grid">
      {items.map((item) => (
        <HistoryCard key={item.id} item={item} onView={onView} onDelete={onDelete} />
      ))}
    </div>
  );
}
