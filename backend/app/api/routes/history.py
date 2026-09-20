from typing import List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.database.models.image import Image
from app.database.models.user import User
from app.database.session import get_db
from app.schemas.upload import ImageOut

router = APIRouter(prefix="/history", tags=["history"])


@router.get("", response_model=List[ImageOut])
def list_history(
    status_filter: str | None = Query(default=None, alias="status"),
    limit: int = Query(default=20, le=100),
    offset: int = Query(default=0, ge=0),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(Image).filter(Image.user_id == current_user.id)
    if status_filter:
        query = query.filter(Image.status == status_filter)

    images = query.order_by(Image.created_at.desc()).offset(offset).limit(limit).all()
    return images
