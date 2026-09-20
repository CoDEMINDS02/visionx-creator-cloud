"""
Real (non-ML) image quality diagnosis and enhancement operations,
built on OpenCV + NumPy + Pillow.

Diagnosis metrics all return a 0-100 "quality" score for that dimension
(100 = great, 0 = bad), plus the underlying raw numbers for transparency.
Enhancement functions take a BGR np.ndarray (OpenCV convention) and
return a corrected BGR np.ndarray.
"""

from __future__ import annotations

from typing import Any, Dict, List, Tuple

import cv2
import numpy as np

# ---------------------------------------------------------------------------
# Diagnosis metrics
# ---------------------------------------------------------------------------


def compute_blur_score(gray: np.ndarray) -> Tuple[float, float]:
    """
    Variance of the Laplacian. Higher variance = sharper image.
    Returns (score_0_100, raw_variance).
    """
    variance = float(cv2.Laplacian(gray, cv2.CV_64F).var())
    # Empirically, variance < 50 is quite blurry, > 500 is very sharp.
    score = _clamp(_scale(variance, low=50, high=500), 0, 100)
    return score, variance


def compute_noise_score(gray: np.ndarray) -> Tuple[float, float]:
    """
    Estimates noise by comparing the image to a denoised version of itself
    (median blur) and measuring the residual energy. Lower residual = less noisy.
    """
    denoised = cv2.medianBlur(gray, 5)
    diff = cv2.absdiff(gray, denoised)
    noise_level = float(np.mean(diff))
    # noise_level < 2 is clean, > 15 is very noisy.
    score = _clamp(100 - _scale(noise_level, low=2, high=15) , 0, 100)
    return score, noise_level


def compute_exposure_score(gray: np.ndarray) -> Tuple[float, Dict[str, float]]:
    """
    Looks at the brightness histogram: penalizes images that are too dark,
    too bright, or have a large percentage of clipped (0 or 255) pixels.
    """
    mean_brightness = float(np.mean(gray))
    total_pixels = gray.size
    shadow_clip_pct = float(np.sum(gray <= 5)) / total_pixels * 100
    highlight_clip_pct = float(np.sum(gray >= 250)) / total_pixels * 100

    # Ideal mean brightness is roughly in the 90-165 range (0-255 scale).
    if 90 <= mean_brightness <= 165:
        brightness_score = 100.0
    elif mean_brightness < 90:
        brightness_score = _clamp(_scale(mean_brightness, low=20, high=90), 0, 100)
    else:
        brightness_score = _clamp(100 - _scale(mean_brightness, low=165, high=235), 0, 100)

    clip_penalty = min(shadow_clip_pct + highlight_clip_pct, 40) * 1.5  # up to 60 pt penalty
    score = _clamp(brightness_score - clip_penalty, 0, 100)

    raw = {
        "mean_brightness": mean_brightness,
        "shadow_clip_pct": shadow_clip_pct,
        "highlight_clip_pct": highlight_clip_pct,
    }
    return score, raw


def compute_contrast_score(gray: np.ndarray) -> Tuple[float, float]:
    """Standard deviation of pixel intensities. Low std = flat/low-contrast image."""
    std_dev = float(np.std(gray))
    # std < 20 is flat, > 65 is punchy/high contrast.
    score = _clamp(_scale(std_dev, low=20, high=65), 0, 100)
    return score, std_dev


def compute_color_score(bgr: np.ndarray) -> Tuple[float, Dict[str, float]]:
    """
    Gray-world style color-cast check: in a well white-balanced photo the
    average R, G, B channel values should be reasonably close to each other.
    """
    b_mean, g_mean, r_mean = [float(x) for x in cv2.mean(bgr)[:3]]
    channel_means = [r_mean, g_mean, b_mean]
    avg = sum(channel_means) / 3
    if avg == 0:
        deviation = 0.0
    else:
        deviation = sum(abs(c - avg) for c in channel_means) / 3 / avg * 100  # % deviation

    # deviation < 3% is neutral, > 20% is a strong color cast.
    score = _clamp(100 - _scale(deviation, low=3, high=20), 0, 100)
    raw = {"r_mean": r_mean, "g_mean": g_mean, "b_mean": b_mean, "channel_deviation_pct": deviation}
    return score, raw


def compute_compression_score(gray: np.ndarray) -> Tuple[float, float]:
    """
    Rough JPEG-blockiness detector: measures pixel-intensity discontinuity
    specifically at 8x8 block boundaries vs. elsewhere. High blockiness = more
    visible compression artifacts.
    """
    h, w = gray.shape
    if h < 16 or w < 16:
        return 100.0, 0.0

    gray_f = gray.astype(np.float64)

    # Vertical differences across horizontal block boundaries (every 8th column)
    boundary_cols = list(range(8, w - 1, 8))
    non_boundary_cols = [c for c in range(1, w - 1) if c % 8 != 0]

    if not boundary_cols or not non_boundary_cols:
        return 100.0, 0.0

    boundary_diff = np.mean([np.mean(np.abs(gray_f[:, c] - gray_f[:, c - 1])) for c in boundary_cols])
    non_boundary_diff = np.mean(
        [np.mean(np.abs(gray_f[:, c] - gray_f[:, c - 1])) for c in non_boundary_cols[:: max(1, len(non_boundary_cols) // 40)]]
    )

    blockiness = float(boundary_diff - non_boundary_diff)
    # blockiness < 0.5 is negligible, > 4 is visibly blocky.
    score = _clamp(100 - _scale(max(blockiness, 0), low=0.5, high=4), 0, 100)
    return score, blockiness


def compute_all_metrics(bgr: np.ndarray) -> Dict[str, Any]:
    """Runs every diagnosis metric on a BGR image and returns scores + raw values."""
    gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)

    blur_score, blur_raw = compute_blur_score(gray)
    noise_score, noise_raw = compute_noise_score(gray)
    exposure_score, exposure_raw = compute_exposure_score(gray)
    contrast_score, contrast_raw = compute_contrast_score(gray)
    color_score, color_raw = compute_color_score(bgr)
    compression_score, compression_raw = compute_compression_score(gray)

    weights = {
        "blur": 0.25,
        "noise": 0.15,
        "exposure": 0.25,
        "contrast": 0.15,
        "color": 0.10,
        "compression": 0.10,
    }
    overall = (
        blur_score * weights["blur"]
        + noise_score * weights["noise"]
        + exposure_score * weights["exposure"]
        + contrast_score * weights["contrast"]
        + color_score * weights["color"]
        + compression_score * weights["compression"]
    )

    return {
        "blur_score": round(blur_score, 2),
        "noise_score": round(noise_score, 2),
        "exposure_score": round(exposure_score, 2),
        "contrast_score": round(contrast_score, 2),
        "color_score": round(color_score, 2),
        "compression_score": round(compression_score, 2),
        "overall_quality_score": round(overall, 2),
        "raw": {
            "blur_variance": round(blur_raw, 3),
            "noise_level": round(noise_raw, 3),
            "exposure": {k: round(v, 3) for k, v in exposure_raw.items()},
            "contrast_std": round(contrast_raw, 3),
            "color": {k: round(v, 3) for k, v in color_raw.items()},
            "compression_blockiness": round(compression_raw, 3),
        },
    }


def detect_issues(metrics: Dict[str, Any], threshold: float = 55.0) -> List[str]:
    """Turns per-dimension scores below `threshold` into human-readable issue labels."""
    issue_map = {
        "blur_score": "blurry",
        "noise_score": "noisy",
        "exposure_score": "poor_exposure",
        "contrast_score": "low_contrast",
        "color_score": "color_cast",
        "compression_score": "compression_artifacts",
    }
    return [label for key, label in issue_map.items() if metrics[key] < threshold]


def recommend_operations(metrics: Dict[str, Any], threshold: float = 55.0) -> List[str]:
    """Decision logic: maps weak diagnosis dimensions to enhancement operations."""
    ops: List[str] = []
    if metrics["exposure_score"] < threshold:
        ops.append("exposure")
    if metrics["noise_score"] < threshold:
        ops.append("denoise")
    if metrics["blur_score"] < threshold:
        ops.append("sharpen")
    if metrics["contrast_score"] < threshold:
        ops.append("contrast")
    if metrics["color_score"] < threshold:
        ops.append("white_balance")
    if not ops:
        # Image already looks decent — apply a light general touch-up.
        ops = ["contrast", "sharpen"]
    return ops


# ---------------------------------------------------------------------------
# Enhancement operations (each takes/returns a BGR np.ndarray)
# ---------------------------------------------------------------------------


def op_exposure(bgr: np.ndarray) -> np.ndarray:
    """Auto brightness/gamma correction using histogram-based gamma estimation."""
    gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
    mean_brightness = np.mean(gray) / 255.0
    mean_brightness = max(mean_brightness, 0.01)
    target = 0.45
    gamma = np.log(target) / np.log(mean_brightness)
    gamma = float(np.clip(gamma, 0.4, 2.5))

    inv_gamma = 1.0 / gamma
    table = np.array([((i / 255.0) ** inv_gamma) * 255 for i in range(256)]).astype("uint8")
    return cv2.LUT(bgr, table)


def op_denoise(bgr: np.ndarray) -> np.ndarray:
    """Non-local means denoising — good balance of quality vs. speed."""
    return cv2.fastNlMeansDenoisingColored(bgr, None, h=7, hColor=7, templateWindowSize=7, searchWindowSize=21)


def op_sharpen(bgr: np.ndarray) -> np.ndarray:
    """Unsharp mask sharpening."""
    blurred = cv2.GaussianBlur(bgr, (0, 0), sigmaX=3)
    sharpened = cv2.addWeighted(bgr, 1.5, blurred, -0.5, 0)
    return sharpened


def op_contrast(bgr: np.ndarray) -> np.ndarray:
    """CLAHE (adaptive histogram equalization) applied on the luminance channel only."""
    lab = cv2.cvtColor(bgr, cv2.COLOR_BGR2LAB)
    l_channel, a_channel, b_channel = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=2.5, tileGridSize=(8, 8))
    l_channel = clahe.apply(l_channel)
    merged = cv2.merge((l_channel, a_channel, b_channel))
    return cv2.cvtColor(merged, cv2.COLOR_LAB2BGR)


def op_white_balance(bgr: np.ndarray) -> np.ndarray:
    """Gray-world white balance."""
    result = bgr.astype(np.float32)
    b, g, r = cv2.split(result)
    b_mean, g_mean, r_mean = np.mean(b), np.mean(g), np.mean(r)
    gray_mean = (b_mean + g_mean + r_mean) / 3

    b = b * (gray_mean / (b_mean + 1e-6))
    g = g * (gray_mean / (g_mean + 1e-6))
    r = r * (gray_mean / (r_mean + 1e-6))

    balanced = cv2.merge((b, g, r))
    return np.clip(balanced, 0, 255).astype(np.uint8)


def op_color_correction(bgr: np.ndarray) -> np.ndarray:
    """Mild saturation boost via HSV."""
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV).astype(np.float32)
    h, s, v = cv2.split(hsv)
    s = np.clip(s * 1.2, 0, 255)
    boosted = cv2.merge((h, s, v)).astype(np.uint8)
    return cv2.cvtColor(boosted, cv2.COLOR_HSV2BGR)


OPERATION_MAP = {
    "exposure": op_exposure,
    "denoise": op_denoise,
    "sharpen": op_sharpen,
    "contrast": op_contrast,
    "white_balance": op_white_balance,
    "color_correction": op_color_correction,
}


def apply_operations(bgr: np.ndarray, operations: List[str]) -> np.ndarray:
    """Applies a sequence of named enhancement operations in order."""
    result = bgr.copy()
    for op_name in operations:
        fn = OPERATION_MAP.get(op_name)
        if fn is not None:
            result = fn(result)
    return result


# ---------------------------------------------------------------------------
# helpers
# ---------------------------------------------------------------------------


def _scale(value: float, low: float, high: float) -> float:
    """Linearly maps value from [low, high] -> [0, 100], clamped at the edges."""
    if high == low:
        return 0.0
    return (value - low) / (high - low) * 100


def _clamp(value: float, min_v: float, max_v: float) -> float:
    return max(min_v, min(max_v, value))
