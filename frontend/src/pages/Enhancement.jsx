import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wand2, ArrowRight, FileImage } from 'lucide-react';
import { ImageContext } from '../context/ImageContext';
import { useEnhancement } from '../hooks/useEnhancement';
import EnhancementPanel from '../components/enhancement/EnhancementPanel';
import EmptyState from '../components/common/EmptyState';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import { formatFileSize } from '../utils/formatting';

export default function Enhancement() {
  const { activeImage, diagnosis } = useContext(ImageContext);
  const { enhancementJob, enhance, loading } = useEnhancement();
  const navigate = useNavigate();

  if (!activeImage || !diagnosis) {
    return (
      <div>
        <PageHeader icon={Wand2} title="Enhancement" description="Apply AI fixes based on your photo's diagnosis." />
        <EmptyState
          icon={Wand2}
          title="Run a diagnosis first"
          description="VisionX needs a diagnosis report to know which fixes your photo actually needs."
          actionTo="/diagnosis"
          actionLabel="Go to diagnosis"
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        icon={Wand2}
        title="Enhancement"
        description="Pick a preset or fine-tune which fixes to apply."
        action={
          enhancementJob?.status === 'completed' && (
            <Button variant="accent" icon={ArrowRight} onClick={() => navigate('/results')}>
              See before & after
            </Button>
          )
        }
      />

      <div className="dash-split" style={{ display: 'grid', gridTemplateColumns: '0.85fr 1.15fr', gap: 22, alignItems: 'start' }}>
        {/* Photo preview */}
        <div className="card" style={{ padding: 14, position: 'sticky', top: 24 }}>
          <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <img
              src={enhancementJob?.resultUrl || activeImage.url}
              alt={activeImage.filename}
              style={{ width: '100%', display: 'block' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 6px 6px' }}>
            <FileImage size={15} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 13.5, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {activeImage.filename}
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-dim)' }}>
                {formatFileSize(activeImage.size)} · Quality score {diagnosis.score}
              </p>
            </div>
          </div>
        </div>

        {/* Enhancement controls */}
        <EnhancementPanel onRun={enhance} loading={loading} job={enhancementJob} />
      </div>
    </div>
  );
}
