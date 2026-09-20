import QualityScore from './QualityScore';
import IssueList from './IssueList';
import ImageMetrics from './ImageMetrics';
import Histogram from './Histogram';

export default function DiagnosisCard({ diagnosis }) {
  if (!diagnosis) return null;
  const { score, issues, metrics, histogram } = diagnosis;

  return (
    <div className="card">
      <QualityScore score={score} />

      <div style={{ marginTop: 28 }}>
        <p style={{ fontSize: 13, color: 'var(--text-soft)', marginBottom: 8, fontWeight: 600 }}>ISSUES DETECTED</p>
        <IssueList issues={issues} />
      </div>

      <div style={{ marginTop: 28 }}>
        <p style={{ fontSize: 13, color: 'var(--text-soft)', marginBottom: 10, fontWeight: 600 }}>METRICS</p>
        <ImageMetrics metrics={metrics} />
      </div>

      <div style={{ marginTop: 28 }}>
        <p style={{ fontSize: 13, color: 'var(--text-soft)', marginBottom: 10, fontWeight: 600 }}>PIXEL VALUE HISTOGRAM</p>
        <Histogram data={histogram} />
      </div>
    </div>
  );
}
