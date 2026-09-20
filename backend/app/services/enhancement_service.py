import uuid
from typing import List, Optional

from app.database.models.diagnosis import Diagnosis
from app.database.models.enhancement import Enhancement
from app.database.models.image import Image
from app.processors.image_loader import load_image_from_bytes
from app.processors.pipeline import run_enhancement_pipeline, verify_improvement
from app.processors.postprocessing import bgr_to_encoded_bytes
from app.services.diagnosis_service import get_latest_diagnosis, run_diagnosis
from app.services.storage_service import download_bytes, upload_bytes
from app.utils.image_utils import compute_all_metrics
from app.utils.file_utils import get_file_extension
from sqlalchemy.orm import Session


def run_enhancement(
    db: Session,
    image: Image,
    operations: Optional[List[str]] = None,
    preset: Optional[str] = "auto",
) -> Enhancement:
    data = download_bytes(image.storage_url)
    _pil, bgr = load_image_from_bytes(data)

    # Use the latest diagnosis if we have one; otherwise run one now so the
    # "auto" decision engine has something to work from.
    diagnosis: Diagnosis | None = get_latest_diagnosis(db, image.id)
    if diagnosis is None:
        diagnosis = run_diagnosis(db, image)

    diagnosis_metrics = {
        "blur_score": diagnosis.blur_score,
        "noise_score": diagnosis.noise_score,
        "exposure_score": diagnosis.exposure_score,
        "contrast_score": diagnosis.contrast_score,
        "color_score": diagnosis.color_score,
        "compression_score": diagnosis.compression_score,
    }

    enhanced_bgr, applied_ops, elapsed_ms = run_enhancement_pipeline(bgr, operations, diagnosis_metrics)

    quality_after = compute_all_metrics(enhanced_bgr)["overall_quality_score"]
    improvement = verify_improvement(diagnosis.overall_quality_score, quality_after)

    ext = f".{get_file_extension(image.original_filename) or 'jpg'}"
    if ext not in (".jpg", ".jpeg", ".png"):
        ext = ".jpg"
    encoded = bgr_to_encoded_bytes(enhanced_bgr, ext=ext)

    storage = upload_bytes(encoded, folder_suffix="processed", public_id=f"{image.id}-enhanced")

    enhancement = Enhancement(
        image_id=image.id,
        diagnosis_id=diagnosis.id,
        applied_operations=applied_ops,
        preset=preset,
        enhanced_storage_url=storage["url"],
        enhanced_storage_public_id=storage["public_id"],
        quality_before=diagnosis.overall_quality_score,
        quality_after=quality_after,
        improvement_percent=improvement,
        processing_time_ms=elapsed_ms,
    )
    db.add(enhancement)

    image.status = "enhanced"
    db.add(image)

    db.commit()
    db.refresh(enhancement)
    return enhancement


def get_latest_enhancement(db: Session, image_id: uuid.UUID) -> Enhancement | None:
    return (
        db.query(Enhancement)
        .filter(Enhancement.image_id == image_id)
        .order_by(Enhancement.created_at.desc())
        .first()
    )
