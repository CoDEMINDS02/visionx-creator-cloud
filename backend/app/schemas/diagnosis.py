import uuid
from datetime import datetime
from typing import Any, Dict, List

from pydantic import BaseModel, ConfigDict


class DiagnosisOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    image_id: uuid.UUID
    blur_score: float
    noise_score: float
    exposure_score: float
    contrast_score: float
    color_score: float
    compression_score: float
    overall_quality_score: float
    issues: List[str]
    metrics_raw: Dict[str, Any]
    created_at: datetime
