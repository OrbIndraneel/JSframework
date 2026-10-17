from fastapi import APIRouter

router = APIRouter()

@router.get("/health", tags=["Health"])
async def get_health():
    return {
        "status": "healthy",
        "service": "campusconnect-ai",
        "version": "1.0.0",
        "description": "CampusConnect AI Recommendation & Resume Parsing Microservice"
    }
