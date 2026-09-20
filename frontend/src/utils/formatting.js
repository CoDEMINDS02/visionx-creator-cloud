export function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return '—';
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

export function formatDate(isoString) {
  if (!isoString) return '—';
  const date = new Date(isoString);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(isoString) {
  if (!isoString) return '—';
  const date = new Date(isoString);
  return `${formatDate(isoString)}, ${date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
}

export function formatScore(score) {
  if (score === null || score === undefined) return '—';
  return Math.round(score);
}

export function formatPercentage(value) {
  if (value === null || value === undefined) return '—';
  return `${Math.round(value)}%`;
}

export function truncateFilename(name, maxLength = 24) {
  if (!name || name.length <= maxLength) return name;
  const extIndex = name.lastIndexOf('.');
  const ext = extIndex !== -1 ? name.slice(extIndex) : '';
  const base = extIndex !== -1 ? name.slice(0, extIndex) : name;
  const keep = maxLength - ext.length - 1;
  return `${base.slice(0, keep)}…${ext}`;
}

export function scoreLabel(score) {
  if (score >= 80) return 'Good quality';
  if (score >= 50) return 'Needs repair';
  return 'Poor quality';
}

export function severityFromScore(score) {
  if (score >= 80) return 'low';
  if (score >= 50) return 'mid';
  return 'high';
}
