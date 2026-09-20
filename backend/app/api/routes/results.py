import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.database.models.user import User
from app.database.session import get_db
from app.schemas.result import ResultOut
from app.services.diagnosis_service import get_owned_image
from app.services.result_service import build_result

router = APIRouter(prefix="/results", tags=["results"])


@router.get("/{image_id}", response_model=ResultOut)
def get_result(
    image_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    image = get_owned_image(db, image_id, current_user.id)
    return build_result(db, image)
