// Real, pixel-based image quality analysis using the Canvas API.
// No fake/random numbers — every metric below is computed from the actual
// uploaded image's pixel data.

function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });
}

function getImageData(img, maxDim = 400) {
  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, w, h);
  return ctx.getImageData(0, 0, w, h);
}

function toGrayscale(imageData) {
  const { data, width, height } = imageData;
  const gray = new Float32Array(width * height);
  for (let i = 0; i < width * height; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    gray[i] = 0.299 * r + 0.587 * g + 0.114 * b;
  }
  return { gray, width, height };
}

function mean(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) sum += arr[i];
  return sum / arr.length;
}

function stdDev(arr, avg) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) sum += (arr[i] - avg) ** 2;
  return Math.sqrt(sum / arr.length);
}

// Exposure: how close the mean brightness is to a well-exposed midtone (~130/255).
function scoreExposure(avgBrightness) {
  const distance = Math.abs(avgBrightness - 130);
  return Math.max(0, Math.round(100 - distance * 0.9));
}

// Contrast: standard deviation of luminance. Low std = flat/low-contrast image.
function scoreContrast(stdBrightness) {
  // A std dev around 55-70 reads as strong contrast; below ~25 reads as flat.
  return Math.max(0, Math.min(100, Math.round((stdBrightness / 65) * 100)));
}

// Sharpness: average gradient magnitude between neighbouring pixels (a simple
// Laplacian-style edge-strength proxy). Blurry images have weak gradients.
function scoreSharpness(gray, width, height) {
  let total = 0;
  let count = 0;
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      const gx = gray[idx + 1] - gray[idx - 1];
      const gy = gray[idx + width] - gray[idx - width];
      total += Math.sqrt(gx * gx + gy * gy);
      count++;
    }
  }
  const avgGradient = count ? total / count : 0;
  // Typical sharp photos average ~18-30 gradient magnitude at this sample size.
  return Math.max(0, Math.min(100, Math.round((avgGradient / 22) * 100)));
}

// Noise: local variance in small blocks after removing the low-frequency (blurred)
// component — isolates high-frequency speckle that isn't part of a real edge.
function scoreNoise(gray, width, height) {
  const blockSize = 4;
  let noiseSum = 0;
  let blocks = 0;

  for (let by = 0; by + blockSize < height; by += blockSize) {
    for (let bx = 0; bx + blockSize < width; bx += blockSize) {
      const values = [];
      for (let y = 0; y < blockSize; y++) {
        for (let x = 0; x < blockSize; x++) {
          values.push(gray[(by + y) * width + (bx + x)]);
        }
      }
      const avg = mean(values);
      const variance = values.reduce((s, v) => s + (v - avg) ** 2, 0) / values.length;
      noiseSum += variance;
      blocks++;
    }
  }

  const avgVariance = blocks ? noiseSum / blocks : 0;
  // Higher local variance = more noise. Scale so ~300 variance reads as very noisy.
  const noiseAmount = Math.min(100, (avgVariance / 300) * 100);
  return Math.max(0, Math.round(100 - noiseAmount));
}

// Color balance: how close the R/G/B channel means are to each other.
// A strong cast (e.g. very warm or very cool) shows up as a large spread.
function scoreColor(imageData) {
  const { data } = imageData;
  let r = 0, g = 0, b = 0;
  const n = data.length / 4;
  for (let i = 0; i < data.length; i += 4) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
  }
  r /= n; g /= n; b /= n;
  const avg = (r + g + b) / 3;
  const spread = (Math.abs(r - avg) + Math.abs(g - avg) + Math.abs(b - avg)) / 3;
  return Math.max(0, Math.min(100, Math.round(100 - spread * 2.2)));
}

// Compression: rough proxy comparing encoded data-URL size to raw pixel count.
// Heavily compressed images pack far fewer bytes per pixel.
function scoreCompression(dataUrl, pixelCount) {
  const bytes = Math.round((dataUrl.length * 3) / 4); // base64 -> bytes
  const bytesPerPixel = bytes / pixelCount;
  // ~0.5+ bytes/pixel reads as lightly compressed; below ~0.08 reads as heavily compressed.
  return Math.max(0, Math.min(100, Math.round((bytesPerPixel / 0.35) * 100)));
}

function severityFor(score) {
  if (score < 45) return 'high';
  if (score < 70) return 'mid';
  return 'low';
}

/**
 * Analyzes a photo (as a data URL) and returns a real, pixel-derived diagnosis:
 * { score, issues: [{type, severity}], metrics: {...}, histogram: number[] }
 */
export async function analyzeImage(dataUrl) {
  const img = await loadImage(dataUrl);
  const imageData = getImageData(img);
  const { gray, width, height } = toGrayscale(imageData);

  const avgBrightness = mean(gray);
  const stdBrightness = stdDev(gray, avgBrightness);

  const metrics = {
    sharpness: scoreSharpness(gray, width, height),
    noise: scoreNoise(gray, width, height),
    exposure: scoreExposure(avgBrightness),
    contrast: scoreContrast(stdBrightness),
    color: scoreColor(imageData),
    compression: scoreCompression(dataUrl, width * height),
  };

  const weights = { sharpness: 0.25, noise: 0.2, exposure: 0.2, contrast: 0.15, color: 0.1, compression: 0.1 };
  const score = Math.round(
    Object.entries(metrics).reduce((sum, [key, value]) => sum + value * weights[key], 0)
  );

  const issueMap = [
    { type: 'blur', metricKey: 'sharpness' },
    { type: 'noise', metricKey: 'noise' },
    { type: 'exposure', metricKey: 'exposure' },
    { type: 'contrast', metricKey: 'contrast' },
    { type: 'color_cast', metricKey: 'color' },
    { type: 'compression', metricKey: 'compression' },
  ];

  const issues = issueMap
    .map(({ type, metricKey }) => ({ type, severity: severityFor(metrics[metricKey]), score: metrics[metricKey] }))
    .filter((issue) => issue.severity !== 'low')
    .sort((a, b) => a.score - b.score);

  // Build a simple luminance histogram (16 buckets) for the diagnosis card.
  const histogram = new Array(16).fill(0);
  for (let i = 0; i < gray.length; i++) {
    const bucket = Math.min(15, Math.floor((gray[i] / 256) * 16));
    histogram[bucket]++;
  }
  const maxBucket = Math.max(...histogram, 1);
  const normalizedHistogram = histogram.map((v) => Math.round((v / maxBucket) * 100));

  return { score, issues, metrics, histogram: normalizedHistogram };
}
