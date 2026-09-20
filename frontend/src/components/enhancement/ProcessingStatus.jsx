import { CheckCircle2, XCircle } from 'lucide-react';
import Loader from '../common/Loader';
import ProgressBar from '../common/ProgressBar';

const STATUS_COPY = {
  queued: 'Queued for processing…',
  running: 'Applying enhancements…',
  completed: 'Enhancement complete.',
  failed: 'Enhancement failed. Please try again.',
};

export default function ProcessingStatus({ job }) {
  if (!job) return null;

  if (job.status === 'completed') {
    return (
      <p style={{ color: '#86EFAC', fontSize: 14.5, display: 'flex', alignItems: 'center', gap: 8 }}>
        <CheckCircle2 size={17} /> {STATUS_COPY.completed}
      </p>
    );
  }
  if (job.status === 'failed') {
    return (
      <p style={{ color: '#FCA5A5', fontSize: 14.5, display: 'flex', alignItems: 'center', gap: 8 }}>
        <XCircle size={17} /> {STATUS_COPY.failed}
      </p>
    );
  }

  return (
    <div>
      <Loader label={STATUS_COPY[job.status] || 'Processing…'} />
      {typeof job.progress === 'number' && (
        <div style={{ marginTop: 14 }}>
          <ProgressBar value={job.progress} />
        </div>
      )}
    </div>
  );
}
