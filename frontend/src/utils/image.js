export function createImagePreviewUrl(file) {
  return URL.createObjectURL(file);
}

export function revokeImagePreviewUrl(url) {
  if (url) URL.revokeObjectURL(url);
}

export function getImageDimensions(file) {
  return new Promise((resolve, reject) => {
    const url = createImagePreviewUrl(file);
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      revokeImagePreviewUrl(url);
    };
    img.onerror = (err) => {
      revokeImagePreviewUrl(url);
      reject(err);
    };
    img.src = url;
  });
}

// Detected-issue metadata shared across diagnosis components
export const ISSUE_LABELS = {
  blur: 'Motion blur',
  noise: 'Sensor noise',
  exposure: 'Exposure',
  contrast: 'Contrast',
  color_cast: 'Color cast',
  compression: 'Compression artifacts',
};

export const METRIC_ORDER = ['sharpness', 'noise', 'exposure', 'contrast', 'color', 'compression'];
