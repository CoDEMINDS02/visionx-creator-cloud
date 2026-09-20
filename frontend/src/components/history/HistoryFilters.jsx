const ISSUE_TYPES = ['blur', 'noise', 'exposure', 'contrast', 'color_cast', 'compression'];

export default function HistoryFilters({ filters, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 16, marginBottom: 26, flexWrap: 'wrap' }}>
      <div className="field" style={{ marginBottom: 0, minWidth: 180 }}>
        <label>Issue type</label>
        <select
          value={filters.issueType || ''}
          onChange={(e) => onChange({ ...filters, issueType: e.target.value || undefined })}
        >
          <option value="">All issues</option>
          {ISSUE_TYPES.map((type) => (
            <option key={type} value={type}>
              {type.replace('_', ' ')}
            </option>
          ))}
        </select>
      </div>
      <div className="field" style={{ marginBottom: 0, minWidth: 160 }}>
        <label>Min score</label>
        <input
          type="number"
          min="0"
          max="100"
          value={filters.minScore || ''}
          onChange={(e) => onChange({ ...filters, minScore: e.target.value || undefined })}
        />
      </div>
    </div>
  );
}
