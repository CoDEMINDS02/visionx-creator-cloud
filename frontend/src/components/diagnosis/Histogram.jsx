export default function Histogram({ data }) {
  const bars = data && data.length ? data : Array.from({ length: 32 }, () => Math.random() * 100);
  const max = Math.max(...bars);

  return (
    <svg viewBox="0 0 320 100" width="100%" height="100" role="img" aria-label="Pixel value histogram">
      <defs>
        <linearGradient id="histGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
      {bars.map((value, i) => {
        const height = (value / max) * 90;
        const barWidth = 320 / bars.length - 2;
        return (
          <rect
            key={i}
            x={i * (320 / bars.length)}
            y={100 - height}
            width={barWidth}
            height={height}
            fill="url(#histGrad)"
            opacity={0.85}
            rx={1}
          />
        );
      })}
    </svg>
  );
}
