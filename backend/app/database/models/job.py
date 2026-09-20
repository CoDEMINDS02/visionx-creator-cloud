import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class Job(Base):
    """
    Tracks the lifecycle of a diagnosis/enhancement task for an image.
    Even though processing here is synchronous for now, this keeps the
    door open for moving to a background queue (Celery/RQ) later without
    changing the API shape.
    """

    __tablename__ = "jobs"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    image_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("images.id"), nullable=False)

    job_type: Mapped[str] = mapped_column(String(50), nullable=False)  # "diagnosis" | "enhancement"
    status: Mapped[str] = mapped_column(String(50), default="pending")  # pending|processing|completed|failed
    error_message: Mapped[str] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc)
    )

    image = relationship("Image", back_populates="jobs")
