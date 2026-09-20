import { GalleryHorizontalEnd, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { ImageContext } from '../context/ImageContext';
import ComparisonView from '../components/comparison/ComparisonView';
import EmptyState from '../components/common/EmptyState';
import PageHeader from '../components/common/PageHeader';

export default function Results() {
  const { activeImage, diagnosis, enhancementJob, reset } = useContext(ImageContext);

  if (!enhancementJob || enhancementJob.status !== 'completed') {
    return (
      <div>
        <PageHeader icon={GalleryHorizontalEnd} title="Results" description="Compare your enhanced photo against the original." />
        <EmptyState
          icon={GalleryHorizontalEnd}
          title="No results yet"
          description="Finish running an enhancement and your before-and-after comparison will show up here."
          actionTo="/enhancement"
          actionLabel="Go to enhancement"
        />
      </div>
    );
  }

  const downloadResult = () => {
    const link = document.createElement('a');
    link.href = enhancementJob.resultUrl;
    link.download = `enhanced-${activeImage.filename || 'photo.jpg'}`;
    link.click();
  };

  return (
    <div>
      <PageHeader
        icon={GalleryHorizontalEnd}
        title="Before & after"
        description="Confirm the fix before it replaces your original."
        action={
          <Link to="/upload" className="btn btn-outline" onClick={reset}>
            <RotateCcw size={15} /> Start a new photo
          </Link>
        }
      />

      <div style={{ maxWidth: 760 }}>
        <ComparisonView
          beforeSrc={activeImage.url}
          afterSrc={enhancementJob.resultUrl}
          beforeScore={diagnosis?.score ?? 0}
          afterScore={enhancementJob.improvedScore ?? 0}
          onDownload={downloadResult}
        />
      </div>
    </div>
  );
}
