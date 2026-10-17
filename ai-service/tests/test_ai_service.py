import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import pytest
from starlette.testclient import TestClient
from app.main import app
from app.schemas.matching import StudentProfileInput, JobRequirement
from app.services.matcher_service import calculate_match
from app.services.recommender_service import rank_recommendations
from app.services.parser_service import parse_resume_content

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "campusconnect-ai"


def test_matcher_high_skill_match_and_eligibility():
    student = StudentProfileInput(
        student_id="std_101",
        department="Computer Science and Engineering",
        cgpa=8.5,
        graduation_year=2025,
        skills=["python", "fastapi", "react", "docker", "sql"],
        projects=["Built full-stack placement portal using React and Python"],
        certifications=["AWS Certified Cloud Practitioner"],
    )

    job = JobRequirement(
        job_id="job_201",
        title="Full Stack Software Engineer",
        company_name="Infosys Ltd",
        required_skills=["Python", "React", "SQL"],
        preferred_skills=["Docker", "AWS"],
        eligible_departments=["CSE", "IT"],
        min_cgpa=7.0,
        target_graduation_years=[2025],
        description="Looking for an energetic engineer proficient in Python and React."
    )

    result = calculate_match(student, job)
    assert result.is_eligible is True
    assert result.match_score >= 70.0
    assert "python" in result.matched_skills
    # 'react' was normalized to 'react.js'
    assert "react.js" in result.matched_skills or "react" in result.matched_skills
    assert len(result.missing_skills) == 0
    assert "Recommended" in result.recommendation_rationale


def test_matcher_strict_eligibility_failure_cgpa():
    # Student with high skills but CGPA below cutoff
    student = StudentProfileInput(
        student_id="std_102",
        department="CSE",
        cgpa=6.2,  # Below 7.5
        graduation_year=2025,
        skills=["python", "react", "docker", "kubernetes", "aws", "sql"],
    )

    job = JobRequirement(
        job_id="job_202",
        title="Senior Cloud Associate",
        company_name="TCS Digital",
        required_skills=["Python", "Docker", "AWS"],
        min_cgpa=7.5,
        eligible_departments=["CSE"],
        target_graduation_years=[2025],
    )

    result = calculate_match(student, job)
    # Must NOT be marked eligible even with high skill match
    assert result.is_eligible is False
    assert any("CGPA" in reason for reason in result.eligibility_reasons)
    # Score capped because ineligible
    assert result.match_score <= 45.0
    assert "Ineligible" in result.explanation


def test_matcher_strict_eligibility_failure_department():
    student = StudentProfileInput(
        student_id="std_103",
        department="Mechanical Engineering",
        cgpa=8.8,
        graduation_year=2025,
        skills=["python", "c++"],
    )

    job = JobRequirement(
        job_id="job_203",
        title="Embedded Software Developer",
        company_name="Qualcomm",
        required_skills=["C++"],
        eligible_departments=["CSE", "ECE"],  # Mechanical not eligible
        min_cgpa=7.0,
    )

    result = calculate_match(student, job)
    assert result.is_eligible is False
    assert any("Department" in reason for reason in result.eligibility_reasons)


def test_missing_skills_and_suggestions():
    student = StudentProfileInput(
        student_id="std_104",
        department="IT",
        cgpa=7.8,
        graduation_year=2025,
        skills=["html", "css", "javascript"],
    )

    job = JobRequirement(
        job_id="job_204",
        title="Backend Developer",
        company_name="Wipro",
        required_skills=["Java", "Spring Boot", "SQL"],
        preferred_skills=["Docker", "Kubernetes"],
    )

    result = calculate_match(student, job)
    assert "java" in result.missing_skills
    assert "sql" in result.missing_skills
    # Suggestions should include missing required skills
    assert any(s in result.suggested_skills for s in ["java", "sql", "docker", "kubernetes"])


def test_ranked_recommendations():
    student = StudentProfileInput(
        student_id="std_105",
        department="CSE",
        cgpa=8.0,
        graduation_year=2025,
        skills=["react", "javascript", "node.js"],
    )

    # Job A: Eligible, good match
    job_a = JobRequirement(
        job_id="job_a",
        title="Frontend Dev",
        company_name="Acme Tech",
        required_skills=["React", "Javascript"],
        min_cgpa=6.5,
        eligible_departments=["CSE"],
        target_graduation_years=[2025],
    )

    # Job B: Ineligible (high CGPA requirement)
    job_b = JobRequirement(
        job_id="job_b",
        title="Quant Developer",
        company_name="Goldman Sachs",
        required_skills=["React", "Javascript"],
        min_cgpa=9.5,  # Ineligible
        eligible_departments=["CSE"],
    )

    batch_res = rank_recommendations(student, [job_b, job_a])
    assert batch_res.total_jobs_evaluated == 2
    # First recommendation MUST be the eligible job A
    assert batch_res.recommendations[0].job_id == "job_a"
    assert batch_res.recommendations[0].is_eligible is True
    assert batch_res.recommendations[1].job_id == "job_b"
    assert batch_res.recommendations[1].is_eligible is False


def test_resume_parser_unsupported_file():
    result = parse_resume_content(b"dummy data", "sample.txt")
    assert result.success is False
    assert any("Unsupported" in err for err in result.parsing_errors)


def test_resume_parser_scanned_pdf_error():
    import pypdf
    from io import BytesIO

    writer = pypdf.PdfWriter()
    writer.add_blank_page(width=72, height=72)
    stream = BytesIO()
    writer.write(stream)
    pdf_bytes = stream.getvalue()

    result = parse_resume_content(pdf_bytes, "scanned_resume.pdf")
    # Must report scanned PDF / OCR not configured error
    assert any("Scanned" in err for err in result.parsing_errors)
