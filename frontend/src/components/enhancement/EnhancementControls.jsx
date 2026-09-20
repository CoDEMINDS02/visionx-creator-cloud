const FIX_OPTIONS = [
  { key: 'denoise', label: 'Denoise' },
  { key: 'sharpen', label: 'Sharpen' },
  { key: 'deblur', label: 'Deblur' },
  { key: 'whiteBalance', label: 'White balance' },
  { key: 'colorCorrection', label: 'Color correction' },
  { key: 'superResolution', label: 'Super resolution' },
  { key: 'faceRestoration', label: 'Face restoration' },
  { key: 'lowLight', label: 'Low-light recovery' },
];

export default function EnhancementControls({ fixes, onToggle }) {
  return (
    <div>
      {FIX_OPTIONS.map((opt) => (
        <label
          key={opt.key}
          className="toggle-row"
        >
          <span>{opt.label}</span>
          <input
            type="checkbox"
            checked={!!fixes[opt.key]}
            onChange={() => onToggle(opt.key)}
            style={{ width: 16, height: 16, accentColor: 'var(--purple)' }}
          />
        </label>
      ))}
    </div>
  );
}

export { FIX_OPTIONS };
