from fastapi import APIRouter
from app.api.endpoints import health, match, recommend, resume

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(match.router)
api_router.include_router(recommend.router)
api_router.include_router(resume.router)
