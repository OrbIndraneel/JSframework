from typing import List, Optional
from pydantic import BaseModel, Field

class ExtractedEducation(BaseModel):
    degree: Optional[str] = None
    institution: Optional[str] = None
    graduation_year: Optional[int] = None
    cgpa: Optional[float] = None

class ExtractedProject(BaseModel):
    title: str
    description: Optional[str] = None
    technologies: List[str] = Field(default_factory=list)

class ExtractedExperience(BaseModel):
    role: Optional[str] = None
    organization: Optional[str] = None
    duration: Optional[str] = None
    description: Optional[str] = None

class ResumeParseResponse(BaseModel):
    success: bool
    candidate_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    skills: List[str] = Field(default_factory=list)
    education: List[ExtractedEducation] = Field(default_factory=list)
    projects: List[ExtractedProject] = Field(default_factory=list)
    certifications: List[str] = Field(default_factory=list)
    experience: List[ExtractedExperience] = Field(default_factory=list)
    raw_text_preview: str = ""
    parsing_errors: List[str] = Field(default_factory=list)
