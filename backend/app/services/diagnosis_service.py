import uuid

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.database.models.diagnosis import Diagnosis
from app.database.models.image import Image
from app.processors.image_loader import load_image_from_bytes
from app.processors.pipeline import run_diagnosis_pipeline
from app.services.storage_service import download_bytes


def get_owned_image(db: Session, image_id: uuid.UUID, user_id: uuid.UUID) -> Image:
    image = db.query(Image).filter(Image.id == image_id, Image.user_id == user_id).first()
    if image is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Image not found.")
    return image


def run_diagnosis(db: Session, image: Image) -> Diagnosis:
    data = download_bytes(image.storage_url)
    _pil, bgr = load_image_from_bytes(data)

    result = run_diagnosis_pipeline(bgr)

    diagnosis = Diagnosis(
        image_id=image.id,
        blur_score=result["blur_score"],
        noise_score=result["noise_score"],
        exposure_score=result["exposure_score"],
        contrast_score=result["contrast_score"],
        color_score=result["color_score"],
        compression_score=result["compression_score"],
        overall_quality_score=result["overall_quality_score"],
        issues=result["issues"],
        metrics_raw=result["metrics_raw"],
    )
    db.add(diagnosis)

    image.status = "diagnosed"
    db.add(image)

    db.commit()
    db.refresh(diagnosis)
    return diagnosis


def get_latest_diagnosis(db: Session, image_id: uuid.UUID) -> Diagnosis | None:
    return (
        db.query(Diagnosis)
        .filter(Diagnosis.image_id == image_id)
        .order_by(Diagnosis.created_at.desc())
        .first()
    )
