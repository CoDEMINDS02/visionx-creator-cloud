import { useState, useRef, useCallback } from 'react';
import { ChevronsLeftRight } from 'lucide-react';

export default function BeforeAfterSlider({ beforeSrc, afterSrc, height = 380 }) {
  const [position, setPosition] = useState(50);
  const frameRef = useRef(null);
  const dragging = useRef(false);

  const updateFromClientX = useCallback((clientX) => {
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(0, Math.min(100, pct)));
  }, []);

  return (
    <div
      ref={frameRef}
      className="ba-frame"
      style={{ height }}
      onMouseDown={(e) => {
        dragging.current = true;
        updateFromClientX(e.clientX);
      }}
      onMouseMove={(e) => dragging.current && updateFromClientX(e.clientX)}
      onMouseUp={() => (dragging.current = false)}
      onMouseLeave={() => (dragging.current = false)}
    >
      <span className="ba-tag" style={{ left: 14 }}>Before</span>
      <span className="ba-tag" style={{ right: 14 }}>After</span>

      <img src={beforeSrc} alt="Before enhancement" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <div className="ba-after-layer" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <img
          src={afterSrc}
          alt="After enhancement"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <div className="ba-handle" style={{ left: `${position}%` }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 3, color: 'var(--text)' }}>
          <ChevronsLeftRight size={16} />
        </div>
      </div>
    </div>
  );
}
