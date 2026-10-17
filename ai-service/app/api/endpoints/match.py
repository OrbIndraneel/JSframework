from fastapi import APIRouter, HTTPException
from app.schemas.matching import MatchRequest, MatchResult
from app.services.matcher_service import calculate_match

router = APIRouter()

@router.post("/match", response_model=MatchResult, tags=["Matching"])
async def match_single_job(request: MatchRequest):
    try:
        result = calculate_match(request.student, request.job)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error evaluating match: {str(e)}")
