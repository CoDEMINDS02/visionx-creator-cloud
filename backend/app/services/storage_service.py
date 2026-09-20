"""
Cloud storage (Cloudinary) integration. All upload/delete of image bytes
goes through this module so the rest of the app never talks to Cloudinary
directly.
"""

from __future__ import annotations

from typing import Optional

import cloudinary
import cloudinary.uploader
import requests
from fastapi import HTTPException, status

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True,
)


def upload_bytes(data: bytes, folder_suffix: str = "originals", public_id: Optional[str] = None) -> dict:
    """
    Uploads raw image bytes to Cloudinary.
    Returns {"url": ..., "public_id": ...}.
    """
    folder = f"{settings.CLOUDINARY_UPLOAD_FOLDER}/{folder_suffix}"
    result = cloudinary.uploader.upload(
        data,
        folder=folder,
        public_id=public_id,
        resource_type="image",
        overwrite=True,
    )
    return {"url": result["secure_url"], "public_id": result["public_id"]}


def download_bytes(url: str) -> bytes:
    """Fetches the raw bytes of a previously uploaded (stored) image back from its URL."""
    try:
        response = requests.get(url, timeout=15)
        response.raise_for_status()
        return response.content
    except requests.RequestException as exc:
        logger.error("Failed to download stored image from %s", url, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY, detail="Could not retrieve stored image."
        ) from exc


def delete_by_public_id(public_id: str) -> None:
    try:
        cloudinary.uploader.destroy(public_id, resource_type="image")
    except Exception:  # noqa: BLE001 - storage cleanup should never crash the request
        logger.warning("Failed to delete Cloudinary asset %s", public_id, exc_info=True)
