import { METRIC_ORDER } from '../../utils/image';

const METRIC_LABELS = {
  sharpness: 'Sharpness',
  noise: 'Noise',
  exposure: 'Exposure',
  contrast: 'Contrast',
  color: 'Color',
  compression: 'Compression',
};

function colorFor(value) {
  if (value >= 70) return '#22C55E';
  if (value >= 45) return '#F59E0B';
  return '#EF4444';
}

export default function ImageMetrics({ metrics = {} }) {
  return (
    <div>
      {METRIC_ORDER.map((key) => {
        const value = metrics[key] ?? 0;
        return (
          <div className="metric-row" key={key}>
            <div className="name">{METRIC_LABELS[key]}</div>
            <div className="progress-track" style={{ flexGrow: 1 }}>
              <div className="progress-fill" style={{ width: `${value}%`, background: colorFor(value) }} />
            </div>
            <div className="val">{value}</div>
          </div>
        );
      })}
    </div>
  );
}
