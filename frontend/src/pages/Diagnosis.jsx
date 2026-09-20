import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, ArrowRight, FileImage } from 'lucide-react';
import { ImageContext } from '../context/ImageContext';
import { useDiagnosis } from '../hooks/useDiagnosis';
import DiagnosisCard from '../components/diagnosis/DiagnosisCard';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import { formatFileSize } from '../utils/formatting';

export default function Diagnosis() {
  const { activeImage } = useContext(ImageContext);
  const { diagnosis, diagnose, loading, error } = useDiagnosis();
  const navigate = useNavigate();

  useEffect(() => {
    if (activeImage && !diagnosis) {
      diagnose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeImage]);

  if (!activeImage) {
    return (
      <div>
        <PageHeader icon={Stethoscope} title="Diagnosis" description="Run a quality check on a photo before fixing anything." />
        <EmptyState
          icon={Stethoscope}
          title="No photo to diagnose yet"
          description="Upload a photo first — VisionX will score it for blur, noise, exposure and more."
          actionTo="/upload"
          actionLabel="Upload a photo"
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        icon={Stethoscope}
        title="Diagnosis"
        description={`Here's what's actually wrong with ${activeImage.filename}.`}
        action={
          diagnosis && (
            <Button variant="accent" icon={ArrowRight} onClick={() => navigate('/enhancement')}>
              Continue to enhancement
            </Button>
          )
        }
      />

      <div className="dash-split" style={{ display: 'grid', gridTemplateColumns: '0.85fr 1.15fr', gap: 22, alignItems: 'start' }}>
        {/* Photo preview */}
        <div className="card" style={{ padding: 14, position: 'sticky', top: 24 }}>
          <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <img src={activeImage.url} alt={activeImage.filename} style={{ width: '100%', display: 'block' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 6px 6px' }}>
            <FileImage size={15} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 13.5, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {activeImage.filename}
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-dim)' }}>{formatFileSize(activeImage.size)}</p>
            </div>
          </div>
        </div>

        {/* Diagnosis report */}
        <div>
          {loading && (
            <div className="card" style={{ padding: 40, textAlign: 'center' }}>
              <Loader label="Analyzing photo pixels…" />
            </div>
          )}
          {error && <p style={{ color: '#FCA5A5', fontSize: 14 }}>{error}</p>}
          {diagnosis && <DiagnosisCard diagnosis={diagnosis} />}
        </div>
      </div>
    </div>
  );
}
