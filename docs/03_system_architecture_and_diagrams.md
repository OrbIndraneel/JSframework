# System Architecture & Technical Diagrams

## 1. System Architecture Diagram

The CampusConnect platform utilizes a decoupled microservices architecture with a dedicated client SPA, main business logic backend, database storage layer, and an AI recommendation microservice.

```mermaid
graph TD
    subgraph ClientLayer ["Client Layer (Browser)"]
        UI["React 18 + Vite SPA"]
        RTK["Redux Toolkit (Auth & Notification State)"]
        RTR["React Router (Role Protected Routing)"]
        UI --> RTK
        UI --> RTR
    end

    subgraph Gateway ["Express.js REST API (Port 5000)"]
        CORS["CORS & Helmet Security"]
        AUTH_MW["JWT Auth & RBAC Middleware"]
        ROUTES["API Controllers & Services"]
        CORS --> AUTH_MW --> ROUTES
    end

    subgraph DataStorage ["Data & File Storage"]
        MONGO[("MongoDB Database (Mongoose ODM)")]
        FS["File Storage (/uploads/resumes)"]
    end

    subgraph AIService ["Python FastAPI AI Service (Port 8000)"]
        FA_API["FastAPI Endpoints (/api/v1)"]
        MATCHER["Job-Skill Matcher & TF-IDF Vectorizer"]
        PARSER["PDF / DOCX Resume Text Parser"]
        FA_API --> MATCHER
        FA_API --> PARSER
    end

    UI -- "HTTPS / Axios REST" --> Gateway
    ROUTES -- "Mongoose ODM (Port 27017)" --> MONGO
    ROUTES -- "Multer Local Storage" --> FS
    ROUTES -- "Internal HTTP / Streaming" --> FA_API
```

---

## 2. Use Case Diagram

```mermaid
graph LR
    actor Student as "Student"
    actor Recruiter as "Recruiter"
    actor Officer as "Placement Officer"
    actor Alumni as "Alumni Mentor"

    subgraph CampusConnectPlatform ["CampusConnect Platform Use Cases"]
        UC1["Register & Authenticate"]
        UC2["Upload Resume & View AI Parse"]
        UC3["Browse Eligible Openings"]
        UC4["View AI Recommendations & Skill Gap"]
        UC5["Submit / Withdraw Application"]
        UC6["Post & Manage Campus Jobs"]
        UC7["Review Applicants & Download CSV"]
        UC8["Schedule Interviews"]
        UC9["Verify Recruiters & Alumni"]
        UC10["Manage Placement Drives"]
        UC11["View Real-Time DB Analytics"]
        UC12["Inspect Audit Logs"]
        UC13["Update Mentorship Availability"]
        UC14["Respond to Mentorship Requests"]
        UC15["Host Workshops & Register Events"]
    end

    Student --> UC1
    Student --> UC2
    Student --> UC3
    Student --> UC4
    Student --> UC5
    Student --> UC15

    Recruiter --> UC1
    Recruiter --> UC6
    Recruiter --> UC7
    Recruiter --> UC8

    Officer --> UC1
    Officer --> UC9
    Officer --> UC10
    Officer --> UC11
    Officer --> UC12

    Alumni --> UC1
    Alumni --> UC13
    Alumni --> UC14
    Alumni --> UC15
```

---

## 3. Entity Relationship (ER) Diagram

```mermaid
erDiagram
    USER ||--o| STUDENT_PROFILE : "has"
    USER ||--o| RECRUITER_PROFILE : "has"
    USER ||--o| ALUMNI_PROFILE : "has"
    USER ||--o{ COMPANY : "owns (as recruiter)"
    COMPANY ||--o{ JOB : "offers"
    PLACEMENT_DRIVE ||--o{ JOB : "includes"
    JOB ||--o{ APPLICATION : "receives"
    USER ||--o{ APPLICATION : "submits (as student)"
    APPLICATION ||--o{ INTERVIEW : "has"
    USER ||--o{ MENTORSHIP_REQUEST : "requests (student)"
    USER ||--o{ MENTORSHIP_REQUEST : "receives (alumni)"
    USER ||--o{ EVENT : "organizes"
    EVENT ||--o{ EVENT_REGISTRATION : "has"
    USER ||--o{ EVENT_REGISTRATION : "attends"
    USER ||--o{ NOTIFICATION : "receives"
    USER ||--o{ AUDIT_LOG : "triggers"

    USER {
        ObjectId _id PK
        string name
        string email UK
        string password
        string role
        boolean isVerified
        boolean isActive
    }

    STUDENT_PROFILE {
        ObjectId _id PK
        ObjectId user FK
        string rollNumber
        string department
        string degree
        number graduationYear
        number cgpa
        string[] skills
        string resumeUrl
    }

    JOB {
        ObjectId _id PK
        ObjectId company FK
        ObjectId recruiter FK
        string title
        string jobType
        number salaryMin
        number salaryMax
        string[] requiredSkills
        number minCgpa
        string status
        date deadline
    }

    APPLICATION {
        ObjectId _id PK
        ObjectId job FK
        ObjectId student FK
        string resumeUrl
        string status
        number aiMatchScore
        string aiExplanation
        date appliedAt
    }
```

---

## 4. Data Flow Diagram (DFD Level 0 & Level 1)

### Level 0 DFD (Context Diagram)

```mermaid
graph TD
    User["Stakeholder (Student / Recruiter / Officer / Alumni)"]
    CC["CampusConnect System"]
    MongoDB[("MongoDB Database")]
    AIService["FastAPI Recommendation Engine"]

    User -- "Credentials, Resumes, Postings, Applications" --> CC
    CC -- "Dashboards, Recommendations, Analytics, Statuses" --> User
    CC <--> MongoDB
    CC <--> AIService
```

### Level 1 DFD (Process Decomposition)

```mermaid
graph TD
    U["User"]
    P1["1.0 Authentication & Session Management"]
    P2["2.0 Profile & Resume Management"]
    P3["3.0 Job Posting & Discovery"]
    P4["4.0 AI Matching & Recommendations"]
    P5["5.0 Application Lifecycle & Interviews"]
    P6["6.0 Placement Drives & Analytics"]
    P7["7.0 Alumni Mentorship & Events"]

    DB[("MongoDB Collections")]
    AI["FastAPI Python Microservice"]

    U --> P1
    P1 --> DB
    U --> P2
    P2 --> DB
    P2 --> AI
    U --> P3
    P3 --> DB
    P2 & P3 --> P4
    P4 <--> AI
    P4 --> U
    U --> P5
    P5 --> DB
    U --> P6
    P6 --> DB
    U --> P7
    P7 --> DB
```

---

## 5. Authentication & Authorization Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor Client as React Frontend
    participant Server as Express Backend
    participant DB as MongoDB
    participant Python as FastAPI AI

    Client->>Server: POST /api/auth/login (email, password)
    Server->>DB: Query User by email (with +password)
    DB-->>Server: Return User document
    Server->>Server: bcrypt.compare(password, user.password)
    Server->>Server: Generate Access Token (JWT 2h) & Refresh Token (7d)
    Server->>DB: Store SHA-256 hash of Refresh Token
    Server-->>Client: 200 OK (User metadata, accessToken, refreshToken)

    Note over Client,Server: Authenticated Request to Protected Route
    Client->>Server: GET /api/students/recommendations (Bearer accessToken)
    Server->>Server: Verify JWT signature & expiration
    Server->>Server: Enforce authorize('student') RBAC check
    Server->>DB: Fetch Student Profile + Active Jobs
    DB-->>Server: Return records
    Server->>Python: POST /api/v1/recommend (student, jobs)
    Python->>Python: TF-IDF vectorization, Skill Overlap & Academic Filters
    Python-->>Server: Ranked recommendations with explanations
    Server-->>Client: 200 OK (Enriched recommendations)
```
