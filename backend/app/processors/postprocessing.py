"""
Converts processed OpenCV arrays back into bytes suitable for uploading
to cloud storage.
"""

import cv2
import numpy as np


def bgr_to_encoded_bytes(bgr: np.ndarray, ext: str = ".jpg", quality: int = 92) -> bytes:
    """
    Encodes a BGR np.ndarray into image bytes (JPEG by default).
    `ext` should include the leading dot, e.g. ".jpg" or ".png".
    """
    params = []
    if ext.lower() in (".jpg", ".jpeg"):
        params = [cv2.IMWRITE_JPEG_QUALITY, quality]
    elif ext.lower() == ".png":
        params = [cv2.IMWRITE_PNG_COMPRESSION, 6]

    success, buffer = cv2.imencode(ext, bgr, params)
    if not success:
        raise ValueError("Failed to encode image.")
    return buffer.tobytes()
