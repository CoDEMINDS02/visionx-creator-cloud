"""
Declarative base + a place that imports every model so that
`Base.metadata.create_all(...)` (or Alembic autogenerate) can see them all.
"""

from sqlalchemy.orm import declarative_base

Base = declarative_base()

# Import models so they register themselves on Base.metadata.
# (Keep this import at the bottom to avoid circular imports.)
from app.database.models import user, image, diagnosis, enhancement, job  # noqa: E402,F401
