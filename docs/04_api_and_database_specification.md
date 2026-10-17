# API & Database Technical Specification

## 1. RESTful API Endpoint Directory

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Public | Register new `student`, `recruiter`, or `alumni`. (Safeguards against `placement_officer` selection). |
| `POST` | `/login` | Public | Authenticates credentials, issues JWT access token and refresh token. |
| `POST` | `/refresh` | Public | Rotates tokens using valid, unrevoked refresh token. |
| `POST` | `/logout` | Authenticated | Clears stored refresh token hash. |
| `GET` | `/me` | Authenticated | Retrieves current authenticated session user and profile. |
| `POST` | `/forgot-password` | Public | Initiates password recovery. |
| `POST` | `/reset-password` | Public | Resets password with secure validation. |

### Students (`/api/students`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/profile` | Student | Retrieves own student academic profile. |
| `PUT` | `/profile` | Student | Updates academic details, skills, certifications, and projects. |
| `POST` | `/resume` | Student | Uploads resume PDF/DOCX; triggers FastAPI microservice parser. |
| `GET` | `/jobs` | Public / Student | Discovers active jobs with keyword, branch, and salary filtering. |
| `GET` | `/recommendations`| Student | Retrieves ranked job recommendations from Python FastAPI service. |
| `POST` | `/applications` | Student | Submits application; enforces duplicate prevention; evaluates AI match score. |
| `GET` | `/applications` | Student | Lists applications with status histories and scheduled interviews. |
| `POST` | `/applications/:id/withdraw` | Student | Withdraws active pending application. |

### Recruiters (`/api/recruiters`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/company` | Recruiter | Retrieves company profile. |
| `PUT` | `/company` | Recruiter | Updates company description, website, and location. |
| `GET` | `/jobs` | Recruiter | Lists jobs created by this recruiter with applicant counts. |
| `POST` | `/jobs` | Recruiter | Publishes new campus job opening. |
| `PUT` | `/jobs/:id` | Recruiter | Modifies job details (ownership verified). |
| `DELETE` | `/jobs/:id` | Recruiter | Closes job posting. |
| `GET` | `/jobs/:jobId/applicants` | Recruiter | Views applicants for owned job (cross-company access prohibited). |
| `PATCH` | `/applicants/:id/status` | Recruiter | Updates applicant status and dispatches student in-app notification. |
| `POST` | `/interviews` | Recruiter | Schedules candidate interview round with meeting link. |
| `GET` | `/jobs/:jobId/export` | Recruiter | Streams applicant roster as CSV. |

### Placement Officers (`/api/placement`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/users` | Placement Officer | Searches and lists all platform users with role filters. |
| `PATCH` | `/users/:id/verify` | Placement Officer | Verifies/activates recruiter and alumni accounts; logs audit event. |
| `PATCH` | `/users/:id/toggle-active` | Placement Officer | Suspends or reactivates account; logs audit event. |
| `GET` | `/drives` | Placement Officer | Lists campus recruitment drives. |
| `POST` | `/drives` | Placement Officer | Creates new recruitment drive for an academic year. |
| `GET` | `/analytics` | Placement Officer | Aggregates real MongoDB records for KPIs, conversion funnels, and department distributions. |
| `GET` | `/audit-logs` | Placement Officer | Retrieves immutable administrative audit trail. |
| `GET` | `/export-report` | Placement Officer | Exports annual placement summary as CSV. |

### Alumni (`/api/alumni`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/directory` | Public | Searchable directory of public verified alumni. |
| `GET` | `/events` | Public | Lists upcoming campus workshops and webinars. |
| `GET` | `/profile` | Alumni | Retrieves alumni professional profile. |
| `PUT` | `/profile` | Alumni | Updates designation, company, bio, and mentorship availability. |
| `POST` | `/mentorship-requests`| Student | Submits 1-on-1 mentorship request to an alumnus. |
| `GET` | `/mentorship-requests` | Student/Alumni | Lists mentorship requests involving current user. |
| `PATCH` | `/mentorship-requests/:id/respond` | Alumni | Accepts, declines, or completes request with meeting link. |
| `POST` | `/events` | Alumni / Officer | Creates a new workshop or tech talk. |
| `POST` | `/events/:id/register` | Student/Alumni | Registers for event (prevents duplicate registrations). |

---

## 2. Database Schema & Indexing Strategy

### Index Optimization Table
| Collection | Indexes | Type | Purpose |
| :--- | :--- | :--- | :--- |
| `users` | `email` | Unique, Single | Fast credential lookup during login & unique account enforcement. |
| `users` | `role`, `isVerified` | Compound | Fast filtering of verified recruiters and alumni in directory and admin lists. |
| `studentprofiles` | `user` | Unique, Single | 1:1 relationship binding user to student record. |
| `studentprofiles` | `department`, `cgpa` | Compound | Rapid evaluation during placement drive batch eligibility checks. |
| `companies` | `recruiter` | Single | Fast company lookup by recruiter user ID. |
| `jobs` | `status`, `createdAt` | Compound | High-performance public job discovery queries. |
| `jobs` | `recruiter` | Single | Fast retrieval of jobs owned by a specific recruiter. |
| `applications` | `job`, `student` | Unique Compound | **Enforces duplicate application prevention at the database engine level.** |
| `applications` | `status` | Single | Rapid aggregation for conversion funnels and placement statistics. |
| `eventregistrations` | `event`, `user` | Unique Compound | Prevents duplicate event registrations. |
| `auditlogs` | `actor`, `createdAt` | Compound | High-speed audit trail queries ordered by timestamp. |
