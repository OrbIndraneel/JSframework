from typing import List, Optional
from pydantic import BaseModel, Field

class JobRequirement(BaseModel):
    job_id: str
    title: str
    company_name: str
    required_skills: List[str] = Field(default_factory=list)
    preferred_skills: List[str] = Field(default_factory=list)
    eligible_departments: List[str] = Field(default_factory=list)
    min_cgpa: float = 0.0
    target_graduation_years: List[int] = Field(default_factory=list)
    experience_required_months: int = 0
    job_type: str = "full_time"
    description: str = ""

class StudentProfileInput(BaseModel):
    student_id: str
    department: str
    cgpa: float = Field(ge=0.0, le=10.0)
    graduation_year: int
    skills: List[str] = Field(default_factory=list)
    certifications: List[str] = Field(default_factory=list)
    projects: List[str] = Field(default_factory=list)
    experience_months: int = 0

class ScoreBreakdown(BaseModel):
    required_skill_overlap: float = 0.0
    preferred_skill_overlap: float = 0.0
    text_relevance_similarity: float = 0.0
    academic_score: float = 0.0
    overall_raw_score: float = 0.0

class MatchResult(BaseModel):
    job_id: str
    title: str
    company_name: str
    match_score: float = Field(ge=0.0, le=100.0)
    is_eligible: bool
    eligibility_reasons: List[str] = Field(default_factory=list)
    matched_skills: List[str] = Field(default_factory=list)
    missing_skills: List[str] = Field(default_factory=list)
    score_breakdown: ScoreBreakdown
    explanation: str
    suggested_skills: List[str] = Field(default_factory=list)
    recommendation_rationale: str

class MatchRequest(BaseModel):
    student: StudentProfileInput
    job: JobRequirement

class BatchRecommendationRequest(BaseModel):
    student: StudentProfileInput
    jobs: List[JobRequirement]

class BatchRecommendationResponse(BaseModel):
    student_id: str
    total_jobs_evaluated: int
    recommendations: List[MatchResult]
