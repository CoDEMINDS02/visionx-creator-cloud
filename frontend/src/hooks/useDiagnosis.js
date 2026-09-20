import { useState, useCallback, useContext } from 'react';
import { runDiagnosis as runDiagnosisApi } from '../api/diagnosis';
import { ImageContext } from '../context/ImageContext';

// Backend issue labels -> { uiType (matches ISSUE_LABELS in utils/image.js), scoreField }
const ISSUE_INFO = {
  blurry: { uiType: 'blur', scoreField: 'blur_score' },
  noisy: { uiType: 'noise', scoreField: 'noise_score' },
  poor_exposure: { uiType: 'exposure', scoreField: 'exposure_score' },
  low_contrast: { uiType: 'contrast', scoreField: 'contrast_score' },
  color_cast: { uiType: 'color_cast', scoreField: 'color_score' },
  compression_artifacts: { uiType: 'compression', scoreField: 'compression_score' },
};

// Backend score field -> the metric key ImageMetrics.jsx (utils/image.js METRIC_ORDER) expects.
const METRIC_KEY_MAP = {
  blur_score: 'sharpness',
  noise_score: 'noise',
  exposure_score: 'exposure',
  contrast_score: 'contrast',
  color_score: 'color',
  compression_score: 'compression',
};

function severityFor(score) {
  if (score < 30) return 'high';
  return 'mid';
}

// Maps the backend's DiagnosisOut to the { score, issues[], metrics{}, histogram }
// shape DiagnosisCard/QualityScore/IssueList/ImageMetrics already render.
function toDiagnosis(diagnosisOut) {
  const metrics = {};
  for (const [backendKey, uiKey] of Object.entries(METRIC_KEY_MAP)) {
    metrics[uiKey] = Math.round(diagnosisOut[backendKey]);
  }

  const issues = diagnosisOut.issues.map((backendType) => {
    const info = ISSUE_INFO[backendType];
    const uiType = info ? info.uiType : backendType;
    const rawScore = info ? diagnosisOut[info.scoreField] : 50;
    return { type: uiType, severity: severityFor(rawScore), score: Math.round(rawScore) };
  });

  return {
    score: Math.round(diagnosisOut.overall_quality_score),
    issues,
    metrics,
    // The backend doesn't compute a pixel histogram — Histogram.jsx already
    // falls back to a placeholder pattern when `histogram` is null.
    histogram: null,
  };
}

export function useDiagnosis() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { activeImage, diagnosis, setDiagnosis } = useContext(ImageContext);

  const diagnose = useCallback(async () => {
    if (!activeImage) return null;
    setLoading(true);
    setError(null);
    try {
      const diagnosisOut = await runDiagnosisApi(activeImage.id);
      const result = toDiagnosis(diagnosisOut);
      setDiagnosis(result);
      return result;
    } catch (err) {
      setError(err.message || 'Could not analyze this photo.');
      return null;
    } finally {
      setLoading(false);
    }
  }, [activeImage, setDiagnosis]);

  return { diagnosis, diagnose, loading, error };
}
