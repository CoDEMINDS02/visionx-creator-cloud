import { X } from 'lucide-react';
import Button from '../common/Button';

export default function ImagePreview({ src, filename, sizeLabel, onRemove }) {
  if (!src) return null;
  return (
    <div className="card" style={{ display: 'flex', gap: 16, alignItems: 'center', marginTop: 20 }}>
      <img
        src={src}
        alt={filename || 'Uploaded preview'}
        style={{ width: 88, height: 88, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
      />
      <div style={{ flexGrow: 1 }}>
        <p style={{ fontSize: 14.5, fontWeight: 600 }}>{filename}</p>
        <p style={{ fontSize: 13, color: 'var(--text-soft)' }}>{sizeLabel}</p>
      </div>
      {onRemove && (
        <Button variant="ghost" size="sm" icon={X} onClick={onRemove}>
          Remove
        </Button>
      )}
    </div>
  );
}
