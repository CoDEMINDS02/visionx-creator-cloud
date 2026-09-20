import { useState, useCallback, useContext } from 'react';
import { validateImageFile } from '../utils/validation';
import { uploadImage } from '../api/upload';
import { ImageContext } from '../context/ImageContext';
import { AppContext } from '../context/AppContext';

// Maps the backend's ImageOut shape to the { id, url, filename, size } shape
// the rest of the app (Diagnosis/Enhancement/Results pages) already expects.
function toActiveImage(imageOut) {
  return {
    id: imageOut.id,
    url: imageOut.storage_url,
    filename: imageOut.original_filename,
    size: imageOut.file_size_bytes,
  };
}

export function useUpload() {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const { setActiveImage, reset } = useContext(ImageContext);
  const { pushToast } = useContext(AppContext);

  const upload = useCallback(
    async (file) => {
      setError(null);
      const { valid, errors } = validateImageFile(file);
      if (!valid) {
        setError(errors[0]);
        return null;
      }

      reset();
      setUploading(true);
      setProgress(0);

      try {
        const imageOut = await uploadImage(file, setProgress);
        const image = toActiveImage(imageOut);
        setActiveImage(image);
        pushToast('Image uploaded. Ready to diagnose.', 'success');
        return image;
      } catch (err) {
        const message = err.message || 'Could not upload this file.';
        setError(message);
        pushToast('Upload failed. Please try again.', 'error');
        return null;
      } finally {
        setUploading(false);
      }
    },
    [setActiveImage, reset, pushToast]
  );

  return { upload, progress, uploading, error };
}
