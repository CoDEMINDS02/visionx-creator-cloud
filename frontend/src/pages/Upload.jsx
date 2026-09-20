import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, ArrowRight, Stethoscope, Wand2, ShieldCheck } from 'lucide-react';
import UploadZone from '../components/upload/UploadZone';
import UploadProgress from '../components/upload/UploadProgress';
import ImagePreview from '../components/upload/ImagePreview';
import FileRequirements from '../components/upload/FileRequirements';
import PageHeader from '../components/common/PageHeader';
import { useUpload } from '../hooks/useUpload';
import { ImageContext } from '../context/ImageContext';
import { formatFileSize } from '../utils/formatting';
import { createImagePreviewUrl } from '../utils/image';
import Button from '../components/common/Button';

const TIPS = [
  { icon: Stethoscope, text: 'VisionX scores your photo for blur, noise, exposure, contrast, color and compression.' },
  { icon: Wand2, text: 'Only the fixes it actually needs are applied — never a one-size-fits-all filter.' },
  { icon: ShieldCheck, text: 'Everything runs and stays in your browser — your photos are never uploaded anywhere.' },
];

export default function Upload() {
  const [localFile, setLocalFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const { upload, progress, uploading, error } = useUpload();
  const { activeImage } = useContext(ImageContext);
  const navigate = useNavigate();

  const handleFileSelected = async (file) => {
    setLocalFile(file);
    setPreviewUrl(createImagePreviewUrl(file));
    await upload(file);
  };

  return (
    <div>
      <PageHeader icon={UploadCloud} title="Upload a photo" description="Drop in a photo and VisionX will diagnose it before anything gets changed." />

      <div className="dash-split" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 22, alignItems: 'start' }}>
        <div>
          <UploadZone onFileSelected={handleFileSelected} />
          <FileRequirements />

          {uploading && <UploadProgress progress={progress} filename={localFile?.name} />}
          {error && <p style={{ color: '#FCA5A5', marginTop: 12, fontSize: 14 }}>{error}</p>}

          {!uploading && localFile && (
            <ImagePreview
              src={previewUrl}
              filename={localFile.name}
              sizeLabel={formatFileSize(localFile.size)}
              onRemove={() => {
                setLocalFile(null);
                setPreviewUrl(null);
              }}
            />
          )}

          {activeImage && !uploading && (
            <Button variant="accent" icon={ArrowRight} style={{ marginTop: 22 }} onClick={() => navigate('/diagnosis')}>
              Continue to diagnosis
            </Button>
          )}
        </div>

        <div className="card">
          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-soft)', marginBottom: 18, letterSpacing: '.02em' }}>
            HOW IT WORKS
          </p>
          {TIPS.map((tip, i) => {
            const Icon = tip.icon;
            return (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: i < TIPS.length - 1 ? 18 : 0 }}>
                <div
                  className="icon-tile"
                  style={{
                    width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                    background: 'rgba(139,92,246,.14)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Icon size={16} style={{ color: 'var(--purple)' }} />
                </div>
                <p style={{ fontSize: 13.5, color: 'var(--text-soft)', lineHeight: 1.5 }}>{tip.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
