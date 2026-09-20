import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function EmptyState({ icon: Icon, title, description, actionTo, actionLabel }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '54px 30px', maxWidth: 460 }}>
      <div
        style={{
          width: 56, height: 56, borderRadius: 16, margin: '0 auto 18px',
          background: 'rgba(139,92,246,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Icon size={24} style={{ color: 'var(--purple)' }} />
      </div>
      <p style={{ fontSize: 15, fontWeight: 600 }}>{title}</p>
      {description && (
        <p style={{ marginTop: 6, fontSize: 13.5, color: 'var(--text-soft)' }}>{description}</p>
      )}
      {actionTo && (
        <Link to={actionTo} className="btn btn-primary" style={{ marginTop: 18 }}>
          {actionLabel} <ArrowRight size={15} />
        </Link>
      )}
    </div>
  );
}
