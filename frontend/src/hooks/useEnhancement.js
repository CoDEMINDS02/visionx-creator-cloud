import { useState, useCallback, useContext } from 'react';
import { runEnhancement as runEnhancementApi } from '../api/enhancement';
import { ImageContext } from '../context/ImageContext';
import { AppContext } from '../context/AppContext';

// The manual "fine-tune fixes" checkboxes (EnhancementControls.jsx) use these
// keys. The backend's OPERATION_MAP (app/utils/image_utils.py) only implements
// these four real operations — deblur/superResolution/faceRestoration/lowLight
// were part of the original ai_engine/ plan but were never built, so they're
// dropped here rather than silently pretending to apply them.
const FIX_TO_OPERATION = {
  denoise: 'denoise',
  sharpen: 'sharpen',
  whiteBalance: 'white_balance',
  colorCorrection: 'color_correction',
};

function buildOperations(preset, fixes) {
  // "auto" (and the other presets, which the backend doesn't distinguish
  // yet) -> let the backend decide from the latest diagnosis.
  if (preset === 'auto') return undefined;

  const operations = Object.entries(fixes)
    .filter(([, enabled]) => enabled)
    .map(([key]) => FIX_TO_OPERATION[key])
    .filter(Boolean);

  return operations.length ? operations : undefined;
}

export function useEnhancement() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { activeImage, diagnosis, enhancementJob, setEnhancementJob } = useContext(ImageContext);
  const { pushToast } = useContext(AppContext);

  const enhance = useCallback(
    async ({ preset, fixes }) => {
      if (!activeImage || !diagnosis) return null;
      setLoading(true);
      setError(null);
      setEnhancementJob({ id: 'pending', status: 'running', progress: 40 });

      try {
        const operations = buildOperations(preset, fixes || {});
        // The backend processes and returns the finished result in one call —
        // there is no job id to poll.
        const enhancementOut = await runEnhancementApi(activeImage.id, { operations, preset });

        const job = {
          id: enhancementOut.id,
          status: 'completed',
          progress: 100,
          resultUrl: enhancementOut.enhanced_storage_url,
          improvedScore: Math.round(enhancementOut.quality_after ?? 0),
        };
        setEnhancementJob(job);
        pushToast('Enhancement complete.', 'success');
        return job;
      } catch (err) {
        setError(err.message || 'Enhancement failed.');
        setEnhancementJob({ id: 'pending', status: 'failed' });
        pushToast('Enhancement failed. Please try again.', 'error');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [activeImage, diagnosis, setEnhancementJob, pushToast]
  );

  return { enhancementJob, enhance, loading, error };
}
