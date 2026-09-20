import { Sparkles, User, Moon, Archive } from 'lucide-react';

const PRESETS = [
  { id: 'auto', label: 'Auto repair', desc: 'Fix whatever the diagnosis flags', icon: Sparkles },
  { id: 'portrait', label: 'Portrait', desc: 'Skin-friendly sharpening and light balance', icon: User },
  { id: 'low_light', label: 'Low light', desc: 'Recover detail from underexposed shots', icon: Moon },
  { id: 'archive', label: 'Archive restore', desc: 'For old scans and low-resolution originals', icon: Archive },
];

export default function PresetSelector({ selected, onSelect }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      {PRESETS.map((preset) => {
        const Icon = preset.icon;
        const isSelected = selected === preset.id;
        return (
          <button
            key={preset.id}
            className="panel"
            onClick={() => onSelect(preset.id)}
            style={{
              textAlign: 'left',
              cursor: 'pointer',
              border: isSelected ? '1px solid rgba(139,92,246,.5)' : '1px solid var(--border)',
              background: isSelected ? 'rgba(139,92,246,.08)' : 'var(--bg-soft)',
            }}
          >
            <Icon size={18} style={{ color: isSelected ? 'var(--purple)' : 'var(--text-soft)', marginBottom: 8 }} />
            <p style={{ fontWeight: 600, fontSize: 14.5 }}>{preset.label}</p>
            <p style={{ fontSize: 12.5, color: 'var(--text-soft)', marginTop: 4 }}>{preset.desc}</p>
          </button>
        );
      })}
    </div>
  );
}

export { PRESETS };
