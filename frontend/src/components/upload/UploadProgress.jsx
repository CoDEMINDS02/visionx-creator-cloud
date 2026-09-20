import ProgressBar from '../common/ProgressBar';

export default function UploadProgress({ progress, filename }) {
  return (
    <div className="card" style={{ marginTop: 20 }}>
      <p style={{ fontSize: 14, marginBottom: 12 }}>Uploading {filename}…</p>
      <ProgressBar value={progress} />
    </div>
  );
}
