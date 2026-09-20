"""
Loading raw upload bytes into the two representations the rest of the
app needs: a Pillow Image (for metadata / easy re-encoding) and an
OpenCV BGR np.ndarray (for all the numeric analysis / enhancement work).
"""

from __future__ import annotations

from io import BytesIO
from typing import Tuple

import cv2
import numpy as np
from fastapi import HTTPException, status
from PIL import Image, UnidentifiedImageError


def load_image_from_bytes(data: bytes) -> Tuple[Image.Image, np.ndarray]:
    """
    Returns (pil_image, bgr_array). Raises HTTP 400 if the bytes aren't a
    readable image.
    """
    try:
        pil_image = Image.open(BytesIO(data))
        pil_image.load()
    except (UnidentifiedImageError, OSError) as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="File is not a valid image."
        ) from exc

    # Normalize to RGB before converting to OpenCV's BGR order (drops alpha safely).
    rgb_image = pil_image.convert("RGB")
    bgr_array = cv2.cvtColor(np.array(rgb_image), cv2.COLOR_RGB2BGR)

    return pil_image, bgr_array


def get_image_info(pil_image: Image.Image) -> dict:
    return {
        "width": pil_image.width,
        "height": pil_image.height,
        "format": pil_image.format,
    }
