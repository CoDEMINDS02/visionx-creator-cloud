from app.database.models.image import Image
from app.services.diagnosis_service import get_latest_diagnosis
from app.services.enhancement_service import get_latest_enhancement
from app.schemas.result import ResultOut
from app.schemas.diagnosis import DiagnosisOut
from app.schemas.enhancement import EnhancementOut
from app.schemas.upload import ImageOut
from sqlalchemy.orm import Session


def build_result(db: Session, image: Image) -> ResultOut:
    diagnosis = get_latest_diagnosis(db, image.id)
    enhancement = get_latest_enhancement(db, image.id)

    return ResultOut(
        image=ImageOut.model_validate(image),
        diagnosis=DiagnosisOut.model_validate(diagnosis) if diagnosis else None,
        enhancement=EnhancementOut.model_validate(enhancement) if enhancement else None,
    )
