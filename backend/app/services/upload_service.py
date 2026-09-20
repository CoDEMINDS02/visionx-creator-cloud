import uuid

from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.database.models.image import Image
from app.processors.image_loader import get_image_info, load_image_from_bytes
from app.services.storage_service import upload_bytes
from app.utils.file_utils import generate_unique_filename
from app.utils.validators import validate_image_upload


async def handle_image_upload(db: Session, user_id: uuid.UUID, file: UploadFile) -> Image:
    data = await file.read()
    validate_image_upload(file, len(data))

    # Make sure it's a genuinely decodable image before we upload/store anything.
    pil_image, _bgr = load_image_from_bytes(data)
    info = get_image_info(pil_image)

    unique_name = generate_unique_filename(file.filename or "upload.jpg")
    storage = upload_bytes(data, folder_suffix="originals", public_id=unique_name.split(".")[0])

    image = Image(
        user_id=user_id,
        original_filename=file.filename or unique_name,
        content_type=file.content_type,
        width=info["width"],
        height=info["height"],
        file_size_bytes=len(data),
        storage_url=storage["url"],
        storage_public_id=storage["public_id"],
        status="pending",
    )
    db.add(image)
    db.commit()
    db.refresh(image)
    return image
