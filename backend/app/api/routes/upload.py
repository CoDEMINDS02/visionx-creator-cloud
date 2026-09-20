from fastapi import APIRouter, Depends, File, UploadFile, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.database.models.user import User
from app.database.session import get_db
from app.schemas.upload import ImageOut
from app.services.upload_service import handle_image_upload

router = APIRouter(prefix="/upload", tags=["upload"])


@router.post("", response_model=ImageOut, status_code=status.HTTP_201_CREATED)
async def upload_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    image = await handle_image_upload(db, current_user.id, file)
    return image
