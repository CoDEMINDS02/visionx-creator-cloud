import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.database.models.user import User
from app.database.session import get_db
from app.schemas.enhancement import EnhancementOut, EnhancementRequest
from app.services.diagnosis_service import get_owned_image
from app.services.enhancement_service import get_latest_enhancement, run_enhancement

router = APIRouter(prefix="/enhancement", tags=["enhancement"])


@router.post("/{image_id}", response_model=EnhancementOut)
def enhance_image(
    image_id: uuid.UUID,
    payload: EnhancementRequest = EnhancementRequest(),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    image = get_owned_image(db, image_id, current_user.id)
    enhancement = run_enhancement(db, image, operations=payload.operations, preset=payload.preset)
    return enhancement


@router.get("/{image_id}", response_model=EnhancementOut)
def get_enhancement(
    image_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    image = get_owned_image(db, image_id, current_user.id)
    enhancement = get_latest_enhancement(db, image.id)
    if enhancement is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No enhancement found for this image yet."
        )
    return enhancement
