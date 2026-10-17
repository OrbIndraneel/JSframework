# AI Recommendation Engine, Testing Strategy & Academic Walkthrough

## 1. AI Recommendation Engine Architecture

The CampusConnect recommendation service is built as a genuine, independently runnable Python microservice powered by **FastAPI**, **scikit-learn**, **NumPy**, and **Pandas**.

### 1.1 Scoring Methodology & Formula

The matching engine employs an explainable, multi-factor scoring formula:

$$\text{Raw Score} = (0.50 \times \text{Required Overlap}) + (0.20 \times \text{Preferred Overlap}) + (0.20 \times \text{TF-IDF Cosine Similarity}) + (0.10 \times \text{Academic Factor})$$

Where:
1. **Required Skill Overlap:** $\frac{|\text{Matched Required Skills}|}{\max(|\text{Job Required Skills}|, 1)} \times 100$
2. **Preferred Skill Overlap:** $\frac{|\text{Matched Preferred Skills}|}{\max(|\text{Job Preferred Skills}|, 1)} \times 100$
3. **TF-IDF Cosine Similarity:** Computes semantic text vector similarity between the student profile corpus (skills, project descriptions, department) and job corpus (title, description, required skills) using `sklearn.feature_extraction.text.TfidfVectorizer`.
4. **Academic Performance Factor:** $\min(\frac{\text{CGPA}}{10.0}, 1.0) \times 100$.

### 1.2 Strict Academic Eligibility Enforcement

A critical design requirement is that a high skill match score **must never override a mandatory eligibility failure**.
- **CGPA Threshold:** If job `min_cgpa > 0` and student `cgpa < min_cgpa`, `is_eligible` is set to `False`.
- **Department Eligibility:** If job `eligible_departments` is defined and student branch is not in the allowed list, `is_eligible` is set to `False`.
- **Batch Year Eligibility:** If student `graduation_year` is not targeted, `is_eligible` is set to `False`.
- **Score Penalization:** When ineligible, the candidate's match score is capped ($\le 45.0$), and the explanation explicitly details the unmet threshold.

### 1.3 Resume Parsing Engine

- Extracts raw text using `pypdf` for PDF documents and `python-docx` for Word DOCX files.
- Employs regex heuristics and an expanded technical skill taxonomy to extract candidate contact info, degrees, CGPAs, projects, and certifications.
- **Scanned PDF Detection:** When a multi-page document yields fewer than 30 characters of text, the service safely alerts that Optical Character Recognition (OCR) is required, avoiding false parsing claims.

---

## 2. Automated Testing Suite & Results

The system implements automated unit and integration tests across all three services.

### 2.1 Python FastAPI AI Service (`ai-service/tests/`)
- Framework: `pytest`, `httpx`
- Executed via: `python -m pytest tests`
- **Result: 8 / 8 tests passing (100% pass rate)**
- Covered tests:
  - `test_health_endpoint`: validates microservice readiness.
  - `test_matcher_high_skill_match_and_eligibility`: verifies scoring when all requirements match.
  - `test_matcher_strict_eligibility_failure_cgpa`: validates score capping when CGPA cutoff is breached.
  - `test_matcher_strict_eligibility_failure_department`: validates eligibility failure for unlisted branches.
  - `test_missing_skills_and_suggestions`: tests skill gap identification.
  - `test_ranked_recommendations`: ensures eligible jobs rank above ineligible ones.
  - `test_resume_parser_unsupported_file`: verifies 400 rejection on invalid file extensions.
  - `test_resume_parser_scanned_pdf_error`: validates OCR warning on empty/scanned PDFs.

### 2.2 Express Backend Service (`backend/tests/`)
- Framework: `jest`, `supertest`, `ts-jest`
- Executed via: `npm test`
- **Result: 13 / 13 tests passing (100% pass rate)**
- Covered tests:
  - `GET /api/health`: service health.
  - `POST /api/auth/register`: blocks `placement_officer` role selection during public registration.
  - Student registration & JWT token generation.
  - Credential login and invalid password 401 rejections.
  - Role-based restriction: prevents students from accessing recruiter management routes (403 Forbidden).
  - Recruiter job creation, discovery, and student application submission.
  - **Duplicate prevention test:** Verifies that a student attempting to apply twice for the same opening receives a 409 Conflict.
  - Recruiter applicant review and cross-company access restrictions.
  - Status updates and applicant notifications.

### 2.3 React Frontend Service (`frontend/src/tests/`)
- Framework: `vitest`
- Executed via: `npm test`
- **Result: 3 / 3 tests passing (100% pass rate)**
- Verification: Full production bundle builds cleanly via Vite (`npm run build`) in under 36 seconds with zero errors.

---

## 3. Academic Demonstration Walkthrough Script

For project evaluation and viva demonstration, follow this step-by-step walkthrough:

1. **Step 1: Explore Public Portal**
   - Navigate to `http://localhost:5173`.
   - Inspect the landing page, live database placement milestone counters, and core ERP pillars.
   - Click "Browse Openings" and filter jobs by department (e.g. CSE) and employment type.
   - Click "Alumni Network" and view verified graduates from Google and Amazon.
2. **Step 2: Authenticate as Student (Rahul Sharma)**
   - Click "Sign In" and use the 1-click demo button for **Student (Rahul)**.
   - Observe the Student Dashboard with KPI cards, profile completeness index, and recent application updates.
   - Navigate to "AI Matches & Skill Gap" (`/student/recommendations`): view the match breakdown, semantic relevance scores, matched skills (green), and missing skills (orange).
   - Navigate to "Profile & Resume": upload a PDF resume and observe the Python AI parser extracting skills.
   - Apply for an active opening and verify the application status is recorded.
3. **Step 3: Authenticate as Recruiter (Microsoft India)**
   - Switch account and log in using **Recruiter (MSFT)**.
   - Access the Recruiter Dashboard displaying candidate applicant counts.
   - Open "Manage Job Postings" and click "Applicants" for the SDE-1 opening.
   - Review Ananya Verma's profile, inspect her AI match score (88.5%), and schedule an interview.
   - Click "Export Applicant List (.CSV)" and download the candidate spreadsheet.
4. **Step 4: Authenticate as Placement Officer (Dr. Rajesh Sharma)**
   - Sign in using **Placement Officer**.
   - Review live analytics: Placement rate formula ($\frac{\text{Placed Students}}{\text{Total Students}} \times 100$), Recharts application funnel, and department distribution.
   - Access "User Verification": toggle recruiter/alumni verification status.
   - Access "Audit Trail": observe immutable audit records capturing every administrative action with actor email and IP address.
5. **Step 5: Authenticate as Alumni Mentor (Amit Saxena)**
   - Sign in using **Alumni Mentor (Google)**.
   - Review incoming mentorship inquiries from junior students.
   - Accept Rahul's mentorship request and provide a meeting link.
