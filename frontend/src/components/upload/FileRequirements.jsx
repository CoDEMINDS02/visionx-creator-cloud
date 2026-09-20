import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE_MB } from '../../utils/validation';

export default function FileRequirements() {
  const formats = ACCEPTED_IMAGE_TYPES.map((t) => t.split('/')[1].toUpperCase()).join(', ');
  return (
    <p style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 14, textAlign: 'center' }}>
      Accepted formats: {formats}. Max size: {MAX_FILE_SIZE_MB}MB.
    </p>
  );
}
