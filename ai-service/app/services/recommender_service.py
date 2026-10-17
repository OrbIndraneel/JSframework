from typing import List
from app.schemas.matching import (
    StudentProfileInput,
    JobRequirement,
    MatchResult,
    BatchRecommendationResponse,
)
from app.services.matcher_service import calculate_match


def rank_recommendations(
    student: StudentProfileInput, jobs: List[JobRequirement]
) -> BatchRecommendationResponse:
    """
    Evaluates and ranks jobs for a student.
    Eligible jobs are prioritized, followed by match score descending.
    """
    results: List[MatchResult] = []
    for job in jobs:
        match_res = calculate_match(student, job)
        results.append(match_res)

    # Sort key: eligible first (True > False), then higher match score
    results.sort(key=lambda x: (1 if x.is_eligible else 0, x.match_score), reverse=True)

    return BatchRecommendationResponse(
        student_id=student.student_id,
        total_jobs_evaluated=len(jobs),
        recommendations=results,
    )
