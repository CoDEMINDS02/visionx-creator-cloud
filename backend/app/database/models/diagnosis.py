import uuid
from datetime import datetime, timezone

from sqlalchemy import JSON, DateTime, Float, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class Diagnosis(Base):
    """
    Stores the result of running OpenCV/PIL based quality analysis
    on an uploaded image.
    """

    __tablename__ = "diagnoses"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    image_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("images.id"), nullable=False)

    blur_score: Mapped[float] = mapped_column(Float, nullable=False)
    noise_score: Mapped[float] = mapped_column(Float, nullable=False)
    exposure_score: Mapped[float] = mapped_column(Float, nullable=False)
    contrast_score: Mapped[float] = mapped_column(Float, nullable=False)
    color_score: Mapped[float] = mapped_column(Float, nullable=False)
    compression_score: Mapped[float] = mapped_column(Float, nullable=False)

    overall_quality_score: Mapped[float] = mapped_column(Float, nullable=False)

    # List[str] of human-readable issues, e.g. ["blurry", "underexposed"]
    issues: Mapped[list] = mapped_column(JSON, default=list)

    # Raw metric details (means, stddevs, etc.) kept for debugging / transparency
    metrics_raw: Mapped[dict] = mapped_column(JSON, default=dict)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    image = relationship("Image", back_populates="diagnoses")
    enhancements = relationship("Enhancement", back_populates="diagnosis")
