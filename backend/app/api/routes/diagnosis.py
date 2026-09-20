import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.database.models.user import User
from app.database.session import get_db
from app.schemas.diagnosis import DiagnosisOut
from app.services.diagnosis_service import get_latest_diagnosis, get_owned_image, run_diagnosis

router = APIRouter(prefix="/diagnosis", tags=["diagnosis"])


@router.post("/{image_id}", response_model=DiagnosisOut)
def diagnose_image(
    image_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    image = get_owned_image(db, image_id, current_user.id)
    diagnosis = run_diagnosis(db, image)
    return diagnosis


@router.get("/{image_id}", response_model=DiagnosisOut)
def get_diagnosis(
    image_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    image = get_owned_image(db, image_id, current_user.id)
    diagnosis = get_latest_diagnosis(db, image.id)
    if diagnosis is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No diagnosis found for this image yet.")
    return diagnosis
