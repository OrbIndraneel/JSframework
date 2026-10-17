from fastapi import APIRouter, HTTPException
from app.schemas.matching import BatchRecommendationRequest, BatchRecommendationResponse
from app.services.recommender_service import rank_recommendations

router = APIRouter()

@router.post("/recommend", response_model=BatchRecommendationResponse, tags=["Recommendations"])
async def get_job_recommendations(request: BatchRecommendationRequest):
    try:
        result = rank_recommendations(request.student, request.jobs)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating recommendations: {str(e)}")
