export default function ProgressBar({ value = 0, label }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-soft)', marginBottom: 7 }}>
          <span>{label}</span>
          <span>{clamped}%</span>
        </div>
      )}
      <div className="progress-track" role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100}>
        <div className="progress-fill" style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}
