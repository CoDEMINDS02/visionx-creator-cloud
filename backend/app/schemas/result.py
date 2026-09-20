from typing import Optional

from pydantic import BaseModel

from app.schemas.diagnosis import DiagnosisOut
from app.schemas.enhancement import EnhancementOut
from app.schemas.upload import ImageOut


class ResultOut(BaseModel):
    image: ImageOut
    diagnosis: Optional[DiagnosisOut] = None
    enhancement: Optional[EnhancementOut] = None
