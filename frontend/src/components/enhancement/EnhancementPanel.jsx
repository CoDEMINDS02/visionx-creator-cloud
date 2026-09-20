import { useState } from 'react';
import { Wand2 } from 'lucide-react';
import PresetSelector from './PresetSelector';
import EnhancementControls from './EnhancementControls';
import ProcessingStatus from './ProcessingStatus';
import Button from '../common/Button';

const DEFAULT_FIXES = {
  denoise: true,
  sharpen: true,
  deblur: false,
  whiteBalance: false,
  colorCorrection: false,
  superResolution: false,
  faceRestoration: false,
  lowLight: false,
};

export default function EnhancementPanel({ onRun, loading, job }) {
  const [preset, setPreset] = useState('auto');
  const [fixes, setFixes] = useState(DEFAULT_FIXES);

  const toggleFix = (key) => setFixes((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="card">
      <p style={{ fontSize: 13, color: 'var(--text-soft)', marginBottom: 12, fontWeight: 600 }}>CHOOSE A STARTING POINT</p>
      <PresetSelector selected={preset} onSelect={setPreset} />

      <p style={{ fontSize: 13, color: 'var(--text-soft)', margin: '26px 0 4px', fontWeight: 600 }}>FINE-TUNE FIXES</p>
      <EnhancementControls fixes={fixes} onToggle={toggleFix} />

      <div style={{ marginTop: 26 }}>
        {job ? (
          <ProcessingStatus job={job} />
        ) : (
          <Button variant="accent" icon={Wand2} disabled={loading} onClick={() => onRun({ preset, fixes })}>
            {loading ? 'Starting…' : 'Run enhancement'}
          </Button>
        )}
      </div>
    </div>
  );
}
