// Real, pixel-based image enhancement using the Canvas API.
// Adjustments are derived from the diagnosis metrics — an underexposed photo
// gets brightened, a flat photo gets more contrast, a blurry one gets
// sharpened, and so on. This actually rewrites pixels; it is not a static mock.

function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });
}

function clamp(value) {
  return Math.max(0, Math.min(255, value));
}

// Simple 3x3 sharpening convolution (unsharp-mask style).
function applySharpen(data, width, height, amount) {
  const src = new Uint8ClampedArray(data);
  const kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];
  const strength = amount; // 0..1

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      for (let c = 0; c < 3; c++) {
        let sum = 0;
        let k = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4 + c;
            sum += src[idx] * kernel[k];
            k++;
          }
        }
        const idx = (y * width + x) * 4 + c;
        data[idx] = clamp(src[idx] * (1 - strength) + sum * strength);
      }
    }
  }
}

// Simple 3x3 box-blur based denoise (mild smoothing).
function applyDenoise(data, width, height, amount) {
  const src = new Uint8ClampedArray(data);
  const strength = amount; // 0..1

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      for (let c = 0; c < 3; c++) {
        let sum = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            sum += src[((y + ky) * width + (x + kx)) * 4 + c];
          }
        }
        const blurred = sum / 9;
        const idx = (y * width + x) * 4 + c;
        data[idx] = clamp(src[idx] * (1 - strength) + blurred * strength);
      }
    }
  }
}

function applyBrightnessContrast(data, brightnessDelta, contrastFactor) {
  for (let i = 0; i < data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      let v = data[i + c] + brightnessDelta;
      v = (v - 128) * contrastFactor + 128;
      data[i + c] = clamp(v);
    }
  }
}

function applyWhiteBalance(data, rMean, gMean, bMean) {
  const avg = (rMean + gMean + bMean) / 3;
  const rGain = avg / (rMean || 1);
  const gGain = avg / (gMean || 1);
  const bGain = avg / (bMean || 1);

  for (let i = 0; i < data.length; i += 4) {
    data[i] = clamp(data[i] * rGain);
    data[i + 1] = clamp(data[i + 1] * gGain);
    data[i + 2] = clamp(data[i + 2] * bGain);
  }
}

/**
 * Enhances a photo based on its diagnosis metrics and returns a new data URL.
 * fixes: { denoise, sharpen, whiteBalance, colorCorrection, ... } (from EnhancementPanel)
 */
export async function enhanceImage(dataUrl, metrics, fixes = {}) {
  const img = await loadImage(dataUrl);

  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data, width, height } = imageData;

  // Exposure correction: push mean brightness toward a good midtone.
  if (fixes.denoise !== false) {
    let sum = 0;
    for (let i = 0; i < data.length; i += 4) sum += (data[i] + data[i + 1] + data[i + 2]) / 3;
    const avgBrightness = sum / (data.length / 4);
    const brightnessDelta = metrics.exposure < 70 ? (130 - avgBrightness) * 0.5 : 0;
    const contrastFactor = metrics.contrast < 70 ? 1.15 : 1.03;
    applyBrightnessContrast(data, brightnessDelta, contrastFactor);
  }

  // White balance / color correction: normalize channel means.
  if (fixes.whiteBalance || fixes.colorCorrection || metrics.color < 70) {
    let r = 0, g = 0, b = 0;
    const n = data.length / 4;
    for (let i = 0; i < data.length; i += 4) {
      r += data[i]; g += data[i + 1]; b += data[i + 2];
    }
    applyWhiteBalance(data, r / n, g / n, b / n);
  }

  // Denoise: mild smoothing when noise score indicates a noisy photo.
  if (fixes.denoise && metrics.noise < 75) {
    applyDenoise(data, width, height, 0.35);
  }

  // Sharpen: strengthen edges when the photo reads as soft/blurry.
  if (fixes.sharpen && metrics.sharpness < 75) {
    applySharpen(data, width, height, 0.5);
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/jpeg', 0.9);
}
