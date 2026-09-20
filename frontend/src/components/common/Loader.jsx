export default function Loader({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div className="loader" role="status" aria-label={label || 'Loading'} />
      {label && <span style={{ fontSize: 14, color: 'var(--text-soft)' }}>{label}</span>}
    </div>
  );
}
