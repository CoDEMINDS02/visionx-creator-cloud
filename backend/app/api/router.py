from fastapi import APIRouter

from app.api.routes import auth, diagnosis, enhancement, health, history, results, upload

api_router = APIRouter()

api_router.include_router(health.router)
api_router.include_router(auth.router)
api_router.include_router(upload.router)
api_router.include_router(diagnosis.router)
api_router.include_router(enhancement.router)
api_router.include_router(results.router)
api_router.include_router(history.router)
