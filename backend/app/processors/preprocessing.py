"""
Prepares an image for consistent, size-independent analysis.
"""

import cv2
import numpy as np

MAX_ANALYSIS_DIMENSION = 1600


def resize_for_analysis(bgr: np.ndarray, max_dim: int = MAX_ANALYSIS_DIMENSION) -> np.ndarray:
    """
    Downscales very large images before running diagnosis metrics so that
    scores are comparable across images of different resolutions and so
    analysis stays fast. Never upscales.
    """
    h, w = bgr.shape[:2]
    longest_side = max(h, w)

    if longest_side <= max_dim:
        return bgr

    scale = max_dim / longest_side
    new_size = (int(w * scale), int(h * scale))
    return cv2.resize(bgr, new_size, interpolation=cv2.INTER_AREA)


def to_grayscale(bgr: np.ndarray) -> np.ndarray:
    return cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
