import uuid
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict


class EnhancementRequest(BaseModel):
    # If omitted, the backend decides operations automatically from the
    # latest diagnosis for this image ("auto" mode).
    operations: Optional[List[str]] = None
    preset: Optional[str] = "auto"


class EnhancementOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    image_id: uuid.UUID
    diagnosis_id: Optional[uuid.UUID] = None
    applied_operations: List[str]
    preset: Optional[str] = None
    enhanced_storage_url: str
    quality_before: Optional[float] = None
    quality_after: Optional[float] = None
    improvement_percent: Optional[float] = None
    processing_time_ms: Optional[float] = None
    created_at: datetime
