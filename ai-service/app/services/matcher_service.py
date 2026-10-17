import re
from typing import List, Tuple, Set, Dict, Any
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

from app.schemas.matching import (
    JobRequirement,
    StudentProfileInput,
    MatchResult,
    ScoreBreakdown,
)

# Common skill aliases and synonyms for robust normalization
SKILL_ALIASES: Dict[str, str] = {
    "js": "javascript",
    "ts": "typescript",
    "py": "python",
    "py3": "python",
    "react": "react.js",
    "reactjs": "react.js",
    "node": "node.js",
    "nodejs": "node.js",
    "express": "express.js",
    "expressjs": "express.js",
    "vue": "vue.js",
    "vuejs": "vue.js",
    "next": "next.js",
    "nextjs": "next.js",
    "mongo": "mongodb",
    "postgres": "postgresql",
    "pg": "postgresql",
    "k8s": "kubernetes",
    "aws": "amazon web services",
    "gcp": "google cloud platform",
    "ml": "machine learning",
    "ai": "artificial intelligence",
    "dl": "deep learning",
    "nlp": "natural language processing",
    "cv": "computer vision",
    "c++": "cpp",
    "c#": "csharp",
    "docker containers": "docker",
    "rest": "rest api",
    "restful": "rest api",
    "rest apis": "rest api",
}

DEPARTMENT_ALIASES: Dict[str, Set[str]] = {
    "cse": {"cse", "computer science", "computer science and engineering", "cs"},
    "it": {"it", "information technology"},
    "ece": {"ece", "electronics and communication", "electronics and communication engineering"},
    "eee": {"eee", "electrical and electronics", "electrical and electronics engineering"},
    "mech": {"mech", "mechanical", "mechanical engineering"},
    "civil": {"civil", "civil engineering"},
    "ai_ds": {"ai&ds", "aids", "artificial intelligence and data science", "data science"},
}


def normalize_token(text: str) -> str:
    """Standardizes string tokens by trimming, lowercasing and stripping special chars."""
    if not text:
        return ""
    clean = text.lower().strip()
    clean = re.sub(r"[\s_]+", " ", clean)
    return SKILL_ALIASES.get(clean, clean)


def normalize_skill_set(skills: List[str]) -> Set[str]:
    """Converts skill list into a set of normalized unique skill identifiers."""
    return {normalize_token(s) for s in skills if normalize_token(s)}


def check_department_eligibility(student_dept: str, allowed_depts: List[str]) -> bool:
    """Verifies whether the student's department satisfies the job requirements."""
    if not allowed_depts:
        return True
    
    clean_student_dept = student_dept.lower().strip()
    
    # Expand student dept aliases
    matched_group: Set[str] = {clean_student_dept}
    for _, group in DEPARTMENT_ALIASES.items():
        if any(alias in clean_student_dept or clean_student_dept in alias for alias in group):
            matched_group = matched_group.union(group)
            break

    for allowed in allowed_depts:
        clean_allowed = allowed.lower().strip()
        if clean_allowed in matched_group:
            return True
        for group in DEPARTMENT_ALIASES.values():
            if clean_allowed in group and any(s in group for s in matched_group):
                return True
    return False


def calculate_match(student: StudentProfileInput, job: JobRequirement) -> MatchResult:
    """
    Computes rigorous skill match, academic eligibility, and explainable recommendation.
    Scoring Formula:
      - Required Skill Overlap: (matched_required / total_required) * 100 (50% weight)
      - Preferred Skill Overlap: (matched_preferred / total_preferred) * 100 (20% weight)
      - TF-IDF Text Cosine Similarity: 0 to 100 (20% weight)
      - Academic Performance Factor: (cgpa / 10.0) * 100 (10% weight)
      
    Strict Eligibility:
      - A high skill match CANNOT override mandatory eligibility criteria (CGPA, Department, Grad Year).
      - If ineligible, is_eligible is False, and raw score is capped and penalized.
    """
    eligibility_reasons: List[str] = []
    is_eligible = True

    # 1. CGPA Threshold Check
    if job.min_cgpa > 0 and student.cgpa < job.min_cgpa:
        is_eligible = False
        eligibility_reasons.append(
            f"Student CGPA ({student.cgpa:.2f}) does not meet the minimum required CGPA ({job.min_cgpa:.2f})."
        )

    # 2. Department Eligibility Check
    if job.eligible_departments:
        dept_match = check_department_eligibility(student.department, job.eligible_departments)
        if not dept_match:
            is_eligible = False
            eligibility_reasons.append(
                f"Department '{student.department}' is not in the eligible branches: {', '.join(job.eligible_departments)}."
            )

    # 3. Target Graduation Year Check
    if job.target_graduation_years and student.graduation_year not in job.target_graduation_years:
        is_eligible = False
        eligibility_reasons.append(
            f"Graduation year ({student.graduation_year}) is not in eligible batches: {job.target_graduation_years}."
        )

    # 4. Skill Overlap Calculation
    student_skills_set = normalize_skill_set(student.skills)
    job_required_set = normalize_skill_set(job.required_skills)
    job_preferred_set = normalize_skill_set(job.preferred_skills)

    # Also extract skills mentioned in student projects & certifications
    extra_text = " ".join(student.projects + student.certifications).lower()
    for req in job_required_set:
        if req in extra_text:
            student_skills_set.add(req)
    for pref in job_preferred_set:
        if pref in extra_text:
            student_skills_set.add(pref)

    matched_required = job_required_set.intersection(student_skills_set)
    missing_required = job_required_set - student_skills_set

    matched_preferred = job_preferred_set.intersection(student_skills_set)
    missing_preferred = job_preferred_set - student_skills_set

    all_matched_skills = sorted(list(matched_required.union(matched_preferred)))
    all_missing_skills = sorted(list(missing_required))

    # Compute Overlap Ratios
    req_ratio = len(matched_required) / max(len(job_required_set), 1)
    pref_ratio = len(matched_preferred) / max(len(job_preferred_set), 1) if job_preferred_set else 1.0

    # 5. Scikit-learn TF-IDF Text Cosine Similarity
    student_corpus = " ".join(
        list(student_skills_set) + student.projects + student.certifications + [student.department]
    )
    job_corpus = " ".join(
        [job.title, job.description] + list(job_required_set) + list(job_preferred_set)
    )

    tfidf_sim = 0.0
    try:
        if student_corpus.strip() and job_corpus.strip():
            vectorizer = TfidfVectorizer(stop_words="english")
            tfidf_matrix = vectorizer.fit_transform([student_corpus, job_corpus])
            cosine_sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
            tfidf_sim = float(np.clip(cosine_sim, 0.0, 1.0))
        else:
            tfidf_sim = req_ratio
    except Exception:
        tfidf_sim = req_ratio

    # 6. Academic Score component
    academic_factor = float(np.clip(student.cgpa / 10.0, 0.0, 1.0))

    # 7. Raw Score Calculation
    raw_score = (
        (0.50 * req_ratio)
        + (0.20 * pref_ratio)
        + (0.20 * tfidf_sim)
        + (0.10 * academic_factor)
    ) * 100.0

    score_breakdown = ScoreBreakdown(
        required_skill_overlap=round(req_ratio * 100.0, 1),
        preferred_skill_overlap=round(pref_ratio * 100.0, 1),
        text_relevance_similarity=round(tfidf_sim * 100.0, 1),
        academic_score=round(academic_factor * 100.0, 1),
        overall_raw_score=round(raw_score, 1),
    )

    # 8. Eligibility Enforcement
    if is_eligible:
        final_score = round(min(max(raw_score, 0.0), 100.0), 1)
        eligibility_reasons.append("Candidate meets all mandatory academic and department criteria.")
        explanation = (
            f"Eligible profile with {len(matched_required)}/{len(job_required_set)} required skills matched "
            f"({score_breakdown.required_skill_overlap}%) and {score_breakdown.text_relevance_similarity}% content relevance."
        )
        if final_score >= 75:
            rationale = "Strongly Recommended: High alignment between candidate skill set and opening requirements."
        elif final_score >= 50:
            rationale = "Recommended: Moderate match. Additional preparation in missing skills will improve interview success."
        else:
            rationale = "Potential Match: Foundational eligibility met, but candidate lacks key required technical competencies."
    else:
        # Strict rule: high skill match cannot override eligibility failure
        final_score = round(min(raw_score * 0.40, 45.0), 1)
        explanation = (
            f"Application Ineligible: {'; '.join(eligibility_reasons)} "
            f"Although technical relevance is {score_breakdown.overall_raw_score:.1f}%, mandatory criteria are not satisfied."
        )
        rationale = "Not Recommended: Candidate does not fulfill university or company mandatory eligibility thresholds."

    # Suggested skills are prioritized missing required skills first, then preferred
    suggested_skills = all_missing_skills[:5]
    if len(suggested_skills) < 5 and missing_preferred:
        for pref in sorted(list(missing_preferred)):
            if pref not in suggested_skills:
                suggested_skills.append(pref)
            if len(suggested_skills) >= 5:
                break

    return MatchResult(
        job_id=job.job_id,
        title=job.title,
        company_name=job.company_name,
        match_score=final_score,
        is_eligible=is_eligible,
        eligibility_reasons=eligibility_reasons,
        matched_skills=all_matched_skills,
        missing_skills=all_missing_skills,
        score_breakdown=score_breakdown,
        explanation=explanation,
        suggested_skills=suggested_skills,
        recommendation_rationale=rationale,
    )
