import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="wrap" style={{ padding: '120px 32px', textAlign: 'left' }}>
      <h1 style={{ fontSize: 42 }}>404</h1>
      <p style={{ marginTop: 12, color: 'var(--text-soft)', fontSize: 16 }}>
        This page doesn't exist — maybe it got enhanced away.
      </p>
      <Link to="/" className="btn btn-primary" style={{ marginTop: 24, display: 'inline-flex' }}>
        Back to home
      </Link>
    </div>
  );
}
