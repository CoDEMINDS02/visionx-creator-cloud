import { Download } from 'lucide-react';
import BeforeAfterSlider from './BeforeAfterSlider';
import ImprovementStats from './ImprovementStats';
import Button from '../common/Button';

export default function ComparisonView({ beforeSrc, afterSrc, beforeScore, afterScore, onDownload }) {
  return (
    <div className="card">
      <BeforeAfterSlider beforeSrc={beforeSrc} afterSrc={afterSrc} />
      <ImprovementStats before={beforeScore} after={afterScore} />
      <div style={{ marginTop: 24 }}>
        <Button variant="primary" icon={Download} onClick={onDownload}>
          Download result
        </Button>
      </div>
    </div>
  );
}
