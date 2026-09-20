import { Eye, Trash2 } from 'lucide-react';
import { formatDate, formatScore } from '../../utils/formatting';
import Button from '../common/Button';

export default function HistoryCard({ item, onView, onDelete }) {
  return (
    <div className="history-card">
      <div className="thumb" style={item.thumbnailUrl ? { backgroundImage: `url(${item.thumbnailUrl})`, backgroundSize: 'cover' } : undefined} />
      <div className="body">
        <p style={{ fontSize: 14, fontWeight: 600 }}>{item.filename}</p>
        <p style={{ fontSize: 12.5, color: 'var(--text-dim)', marginTop: 4 }}>{formatDate(item.createdAt)}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
          <span className="badge badge-low">Score {formatScore(item.score)}</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <Button variant="ghost" size="sm" onClick={() => onView(item)}><Eye size={15} /></Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(item.id)}><Trash2 size={15} /></Button>
          </div>
        </div>
      </div>
    </div>
  );
}
