import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class Image(Base):
    __tablename__ = "images"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

    original_filename: Mapped[str] = mapped_column(String(500), nullable=False)
    content_type: Mapped[str] = mapped_column(String(100), nullable=True)
    width: Mapped[int] = mapped_column(Integer, nullable=True)
    height: Mapped[int] = mapped_column(Integer, nullable=True)
    file_size_bytes: Mapped[int] = mapped_column(Integer, nullable=True)

    # Cloud storage (Cloudinary) location of the ORIGINAL uploaded image
    storage_url: Mapped[str] = mapped_column(String(1000), nullable=False)
    storage_public_id: Mapped[str] = mapped_column(String(500), nullable=False)

    # pending -> diagnosed -> enhanced -> failed
    status: Mapped[str] = mapped_column(String(50), default="pending")

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    owner = relationship("User", back_populates="images")
    diagnoses = relationship("Diagnosis", back_populates="image", cascade="all, delete-orphan")
    enhancements = relationship("Enhancement", back_populates="image", cascade="all, delete-orphan")
    jobs = relationship("Job", back_populates="image", cascade="all, delete-orphan")
