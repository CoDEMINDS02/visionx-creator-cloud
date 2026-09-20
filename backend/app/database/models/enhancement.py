import uuid
from datetime import datetime, timezone

from sqlalchemy import JSON, DateTime, Float, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class Enhancement(Base):
    """
    Stores the result of applying enhancement operations to an image,
    based on (optionally) a prior Diagnosis.
    """

    __tablename__ = "enhancements"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    image_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("images.id"), nullable=False)
    diagnosis_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("diagnoses.id"), nullable=True
    )

    # e.g. ["denoise", "sharpen", "white_balance"]
    applied_operations: Mapped[list] = mapped_column(JSON, default=list)
    preset: Mapped[str] = mapped_column(String(50), nullable=True)  # "auto" | "portrait" | "landscape" | ...

    enhanced_storage_url: Mapped[str] = mapped_column(String(1000), nullable=False)
    enhanced_storage_public_id: Mapped[str] = mapped_column(String(500), nullable=False)

    quality_before: Mapped[float] = mapped_column(Float, nullable=True)
    quality_after: Mapped[float] = mapped_column(Float, nullable=True)
    improvement_percent: Mapped[float] = mapped_column(Float, nullable=True)

    processing_time_ms: Mapped[int] = mapped_column(Float, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    image = relationship("Image", back_populates="enhancements")
    diagnosis = relationship("Diagnosis", back_populates="enhancements")
