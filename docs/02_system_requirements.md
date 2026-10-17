# System Requirements Specification (SRS)

## 1. Existing System Limitations vs Proposed CampusConnect Solution

| Feature / Aspect | Conventional Placement System | CampusConnect Proposed Solution |
| :--- | :--- | :--- |
| **Eligibility Verification** | Manual checks of student CGPA and branch lists in spreadsheets. | Automated strict backend evaluation against company criteria. |
| **Resume Handling** | Email attachments or physical printouts; no skill extraction. | Secure PDF/DOCX storage with Python AI document parsing and preview. |
| **Career Recommendations** | None or static generic advice. | Dynamic TF-IDF semantic cosine similarity + skill gap analysis. |
| **Alumni Relations** | Informal messaging apps with high friction and low engagement. | Structured 1-on-1 mentorship requests, scheduling, and workshop hosting. |
| **Administrative Auditing** | No audit trail for status changes or user activations. | Tamper-evident AuditLog collection storing actor IP, timestamp, and details. |
| **Placement Analytics** | Manual post-season compilation from fragmented files. | Live aggregation on MongoDB records with Recharts funnel and distributions. |

---

## 2. Functional Requirements

### 2.1 Authentication & Authorization
- **FR-01:** Secure registration and login using JWT access tokens (short-lived) and rotating refresh tokens with SHA-256 hashing.
- **FR-02:** Role-based access control (RBAC) protecting endpoints for four roles: `student`, `recruiter`, `placement_officer`, `alumni`.
- **FR-03:** Safeguarded public registration: Registration restricts selection of the `placement_officer` role; administrative accounts must be provisioned via secure bootstrap scripts.

### 2.2 Student Portal
- **FR-04:** Profile management including enrollment ID, department, degree, graduation year, CGPA, skills, certifications, and projects.
- **FR-05:** Automated completeness calculation tracking profile data density (0% - 100%).
- **FR-06:** Resume document upload (PDF/DOCX) with automatic text extraction of candidate contact info, education, and technical skills.
- **FR-07:** Filtered job browsing by keywords, department, employment type (full-time vs internship), and salary.
- **FR-08:** One-click job application with duplicate prevention enforced by unique compound indexes (`job + student`).
- **FR-09:** Application status tracking with lifecycle audit histories and application withdrawal capability.

### 2.3 Recruiter Portal
- **FR-10:** Employer organization profile management and verification status tracking.
- **FR-11:** Job posting CRUD operations with salary/stipend ranges, required/preferred skills, target batches, and application deadlines.
- **FR-12:** Applicant review roster with direct access to authorized resume files and AI match scores.
- **FR-13:** Candidate status progression (`under_review`, `shortlisted`, `interview_scheduled`, `selected`, `rejected`) with automated student in-app notifications.
- **FR-14:** Interview scheduling with meeting URL, time, duration, and notes.
- **FR-15:** Applicant list export in standardized CSV format.

### 2.4 Placement Officer ERP
- **FR-16:** User directory administration: search, filter, verify/unverify corporate recruiters and alumni, and suspend/reactivate accounts.
- **FR-17:** Placement drive creation and scheduling for graduating academic years.
- **FR-18:** Real-time database analytics dashboard displaying key placement indicators (total candidates, placed students, placement rate formula, conversion funnel, department distribution, company hiring counts).
- **FR-19:** Immutable administrative audit logging for sensitive actions.
- **FR-20:** Master campus placement report export to CSV.

### 2.5 Alumni Network
- **FR-21:** Public alumni directory with privacy controls, company, designation, batch year, and expertise tags.
- **FR-22:** Mentorship availability toggle and 1-on-1 mentorship request workflow (`pending`, `accepted`, `declined`, `completed`).
- **FR-23:** Campus workshop and webinar scheduling with student event registration and capacity limits.

---

## 3. Non-Functional Requirements

- **Security:** Password hashing using `bcryptjs` with salt rounds. Protection against MongoDB operator injection and XSS via sanitized queries and Helmet HTTP security headers.
- **Performance:** Sub-100ms average backend API latency. Frontend bundle size under 250KB gzipped via Vite code splitting.
- **Scalability:** Stateless JWT authentication and modular service architecture ready for containerized horizontal scaling.
- **Reliability:** Graceful error handling in Express and fallback baseline recommendations if the AI microservice is temporarily unavailable.
- **Accessibility & UX:** High-contrast professional blue-and-white theme complying with WCAG 2.1 AA contrast ratios, accessible form controls, and loading states.

---

## 4. Software & Hardware Requirements

### Software Environment
- **Client OS / Browser:** Modern evergreen browsers (Chrome, Edge, Firefox, Safari).
- **Server Runtime:** Node.js v20.x or higher, Python 3.11+.
- **Database:** MongoDB Community Server v7.0+ or embedded MongoMemoryServer for development.
- **Frameworks:** React 18, Vite 6, Express 4, FastAPI 0.115+.
- **Containerization:** Docker Engine v24+ and Docker Compose v2+.

### Minimum Hardware Specifications
- **Development/Host System:** Dual-core 2.0 GHz CPU or higher, 8 GB RAM, 10 GB free disk space.
