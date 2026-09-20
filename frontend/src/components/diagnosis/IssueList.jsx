import { ISSUE_LABELS } from '../../utils/image';

export default function IssueList({ issues = [] }) {
  if (!issues.length) {
    return <p style={{ fontSize: 14, color: 'var(--text-soft)' }}>No significant issues detected.</p>;
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {issues.map((issue) => (
        <li
          key={issue.type}
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', fontSize: 14.5, borderTop: '1px solid var(--border)' }}
        >
          <span className={`dot dot-${issue.severity}`} />
          <span>{ISSUE_LABELS[issue.type] || issue.type}</span>
          <span className={`badge badge-${issue.severity}`} style={{ marginLeft: 'auto' }}>
            {issue.severity}
          </span>
        </li>
      ))}
    </ul>
  );
}
