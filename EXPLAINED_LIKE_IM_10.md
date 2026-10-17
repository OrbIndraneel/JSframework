# 🎈 CampusConnect Explained So Simply That Even a 10-Year-Old Can Understand! 🚀

Welcome to the ultimate, super-fun, crystal-clear guide to **CampusConnect**! 

If you have ever wondered:
- *"What does this website actually do?"*
- *"Why are there so many files and folders?"*
- *"How does the smart AI robot know which student is right for which job?"*
- *"What does each little piece of code do?"*

...you are in the right place! No boring technical jargon here. Grab a juice box 🧃, sit back, and let's explore!

---

## 🌟 Table of Contents
1. [🎪 The Big Picture: What is CampusConnect?](#-1-the-big-picture-what-is-campusconnect)
2. [👥 The 4 Main Characters (User Roles)](#-2-the-4-main-characters-user-roles)
3. [🏰 The Three Kingdoms: How the Whole System Works](#-3-the-three-kingdoms-how-the-whole-system-works)
4. [🤖 The AI Brain: How Does the Matchmaker Robot Think?](#-4-the-ai-brain-how-does-the-matchmaker-robot-think)
5. [🗂️ The Grand Tour of EVERY File & Folder](#-5-the-grand-tour-of-every-file--folder)
   - [🌍 The Root Directory (The Castle Gates)](#-the-root-directory-the-castle-gates)
   - [🤖 The AI Service (`ai-service/`)](#-the-ai-service-ai-service)
   - [⚙️ The Main Backend Server (`backend/`)](#-the-main-backend-server-backend)
   - [🎨 The Frontend Screen (`frontend/`)](#-the-frontend-screen-frontend)
   - [📚 The Documentation Library (`docs/`)](#-the-documentation-library-docs)
6. [🎬 Real-Life Stories: What Happens Behind the Scenes?](#-6-real-life-stories-what-happens-behind-the-scenes)
7. [🎓 Quick Cheat Sheet for College Viva & Presentations](#-7-quick-cheat-sheet-for-college-viva--presentations)

---

## 🎪 1. The Big Picture: What is CampusConnect?

Imagine your college is a giant **Hero Training Academy** (like Hogwarts or Superhero High)!

- Every year, hundreds of students graduate with cool skills like writing code, building apps, or analyzing data.
- Big companies (like Microsoft, Google, or TCS) come to the academy asking: *"Hey, who are your best heroes to join our quests?"*
- In the old days, teachers used messy paper files, messy spreadsheets, and lost resumes under piles of dust.
- **CampusConnect is like a magical digital portal** where:
  - Companies post jobs ("We need a Python coder!").
  - Students upload their magical scrolls (resumes).
  - A friendly AI Robot reads the scrolls and says: *"Aha! Rahul matches this job 92%! But wait, does he have good enough grades? Let me check!"*
  - The Principal can see live charts of how many students got hired.
  - Alumni (graduates from 5 years ago) come back to guide younger students.

---

## 👥 2. The 4 Main Characters (User Roles)

Just like in a multiplayer game, each player has a special badge with special powers:

| Character | Real-Life Name | Their Superpower | What They Can Do |
| :--- | :--- | :--- | :--- |
| 🎓 **Student** | The Young Hero | Learning & Applying | Create a profile, upload a PDF resume, see job recommendations with AI scores, apply to jobs, track interview status, and ask Alumni for mentorship. |
| 🏢 **Recruiter** | The Quest Giver | Hiring Talent | Post new jobs, view all student applications, download applicant lists to Excel/CSV, change application status (Shortlisted, Interview, Hired), and schedule interviews. |
| 👑 **Placement Officer** | The Academy Principal | Master Controller | The boss of the campus. Approves new companies, schedules big campus placement drives, views colorful live charts of placement stats, and monitors the security audit log. |
| 🧙‍♂️ **Alumni** | The Wise Elder | Guiding the Next Gen | Senior students who already graduated and work at top companies. They help younger students by accepting mentorship requests and giving career advice. |

> 🔒 **Golden Rule of the Academy:** Nobody can sneak into the Principal's office! You cannot sign up as a Placement Officer on the website—only the college server can appoint one.

---

## 🏰 3. The Three Kingdoms: How the Whole System Works

CampusConnect is split into **three friendly computer programs** that talk to each other over the network, plus one giant **Memory Chest**:

```
 [💻 User's Web Browser]  <-- The Eyes and Hands (Frontend - React)
           │
           ▼ (HTTP API Requests)
 [⚙️ Express Backend Server] <-- The Manager / Butler (Node.js)
    │                  │
    ▼                  ▼
[📦 MongoDB]     [🤖 FastAPI AI Service]
(Memory Chest)    (The Smart Detective Robot - Python)
```

1. **🎨 The Frontend (React + Vite):**
   - This is what you see and click on your screen: buttons, cards, shiny dark mode, navigation bars, and charts.
   - It's like the **waiter in a restaurant** who smiles, gives you the menu, takes your order, and brings back your food.

2. **⚙️ The Backend (Node.js + Express):**
   - This is the **kitchen and manager**.
   - It checks your password, makes sure you are allowed in, saves your data, and makes sure students cannot edit other students' marks.

3. **🤖 The AI Microservice (Python + FastAPI):**
   - This is the **resident math genius detective**.
   - It doesn't worry about web pages or passwords. It only cares about two things:
     1. Reading PDF resumes.
     2. Calculating how close a student's skills match a job description.

4. **📦 The Database (MongoDB):**
   - This is the **giant memory chest**.
   - Even if you turn off your computer, MongoDB remembers every student, every job, every interview, and every message.
   - *Special trick:* If MongoDB is not installed on your laptop, the backend automatically creates a temporary magical in-memory database so the app runs instantly without errors!

---

## 🤖 4. The AI Brain: How Does the Matchmaker Robot Think?

Imagine you are trading Pokémon or Superhero cards with your friend. How do you know if a trade is good?

The AI uses a **3-Step Fair System**:

### Step 1: The Bouncer at the Gate (Hard Eligibility Check 🛑)
Before doing any math, the AI checks the hard rules:
- Does the job require a Minimum CGPA of 7.5? If Rahul has 7.2, he is **NOT ELIGIBLE**.
- Does the job require Computer Science? If Rahul is from Civil Engineering and the job doesn't allow it, he is **NOT ELIGIBLE**.
- **The Rule:** The AI will NEVER let a high similarity score bypass college eligibility rules! Fairness first!

### Step 2: The Skill Detective (Keyword & Overlap Score 🔍)
- The job wants: `React`, `Node.js`, `TypeScript`, `Docker`, `MongoDB` (5 skills).
- Rahul has: `React`, `Node.js`, `TypeScript`, `Python` (3 matches).
- Overlap score = 3 out of 5 = 60%!

### Step 3: The Story Reader (TF-IDF Cosine Similarity 📐)
- **What is TF-IDF?**
  - Think of it like this: words like "the", "and", "is" appear everywhere, so they are boring and score almost 0 points.
  - Words like "Kubernetes", "Microservices", or "Neural Networks" are rare and exciting, so they score huge points!
- **Cosine Similarity:**
  - Imagine turning the student's resume into an arrow in space, and the job description into another arrow.
  - If both arrows point in the exact same direction, the angle between them is 0, which means 100% match!
  - If they point in completely different directions, it is 0% match.

### Step 4: The Final Grade
The AI combines the scores:
$$\text{Final Score} = (0.50 \times \text{Skill Overlap}) + (0.50 \times \text{Story Similarity})$$
If the final score is 85%, Rahul sees:
> ⭐ **85% Match - Great Fit!**
> - ✅ You have: React, Node.js, TypeScript
> - ⚠️ Missing skills to learn: Docker, AWS

---

## 🗂️ 5. The Grand Tour of EVERY File & Folder

Let's walk through every single room in the castle!

---

### 🌍 The Root Directory (The Castle Gates)

| File / Folder | What is it in plain English? |
| :--- | :--- |
| [package.json](file:///d:/College/JSframework/package.json) | The master instruction sheet for the whole project. Lists quick commands like `npm run seed` and tells the computer which helper packages we need. |
| [docker-compose.yml](file:///d:/College/JSframework/docker-compose.yml) | A magical blueprint. With one command (`docker compose up`), it spins up all 3 servers and the database together inside neat little virtual containers. |
| [README.md](file:///d:/College/JSframework/README.md) | The front welcome poster. Explains features, quick start steps, and test commands for teachers and developers. |
| [PROGRESS.md](file:///d:/College/JSframework/PROGRESS.md) | The developer's diary. Notes down what was completed, design decisions, and status checks. |
| [.gitignore](file:///d:/College/JSframework/.gitignore) | A secret list of files to NOT share on GitHub (like temporary files, passwords, or bulky `node_modules`). |

---

### 🤖 The AI Service (`ai-service/`)
*Written in Python — the home of the smart matchmaker.*

| File / Folder | What is it in plain English? |
| :--- | :--- |
| [`requirements.txt`](file:///d:/College/JSframework/ai-service/requirements.txt) | The grocery shopping list for Python (e.g. `fastapi` for the web server, `scikit-learn` for math, `pypdf` for reading PDFs). |
| [`Dockerfile`](file:///d:/College/JSframework/ai-service/Dockerfile) | A recipe card to bake the Python AI service into an isolated Docker container. |
| [`.env.example`](file:///d:/College/JSframework/ai-service/.env.example) | Example environment settings (like what port number to listen on: `8000`). |
| [`app/main.py`](file:///d:/College/JSframework/ai-service/app/main.py) | **The Front Door of the AI.** Sets up the FastAPI server, allows the backend to talk to it, and defines endpoints: `/health`, `/match`, `/recommend`, and `/parse`. |
| [`app/core/config.py`](file:///d:/College/JSframework/ai-service/app/core/config.py) | Configuration manager that reads system settings and sets sensible defaults. |
| [`app/schemas/matching.py`](file:///d:/College/JSframework/ai-service/app/schemas/matching.py) | The "ID Card Form". Defines the exact format that data must take (e.g., student skills must be a list of words, CGPA must be a number between 0 and 10). |
| [`app/services/matcher_service.py`](file:///d:/College/JSframework/ai-service/app/services/matcher_service.py) | **The Core Math Engine.** Calculates TF-IDF cosine similarity, compares skill tags, checks eligibility, and returns the final match score with helpful explanations. |
| [`app/services/parser_service.py`](file:///d:/College/JSframework/ai-service/app/services/parser_service.py) | **The Scroll Reader.** Opens uploaded PDF or Word document (.docx) resumes, extracts text, finds email addresses, phone numbers, and recognizes known programming skills. |
| [`app/services/recommender_service.py`](file:///d:/College/JSframework/ai-service/app/services/recommender_service.py) | **The Leaderboard Maker.** Takes a list of 50 students and ranks them from highest match to lowest match for a recruiter. |
| [`tests/test_ai_service.py`](file:///d:/College/JSframework/ai-service/tests/test_ai_service.py) | The Automated Inspection Robot. 8 robot tests that verify the AI math, eligibility rules, and PDF parser without needing a human to click anything! |

---

### ⚙️ The Main Backend Server (`backend/`)
*Written in TypeScript (Node.js) — the engine that powers all data, security, and communication.*

#### 1. Core Server Files
| File | What is it in plain English? |
| :--- | :--- |
| [`src/server.ts`](file:///d:/College/JSframework/backend/src/server.ts) | The ignition switch of a car. Starts the web server on Port 5000 and connects to the database. |
| [`src/app.ts`](file:///d:/College/JSframework/backend/src/app.ts) | The castle receptionist. Plugs in security armor (cors, helmet, rate-limiter) and routes visitors to the right department. |
| [`src/config/db.ts`](file:///d:/College/JSframework/backend/src/config/db.ts) | The database connector. Tries connecting to real MongoDB first. If MongoDB isn't running on your laptop, it magically starts an in-memory database so everything still works! |
| [`src/scripts/seed.ts`](file:///d:/College/JSframework/backend/src/scripts/seed.ts) | The magic wand that populates the database with realistic sample students (Rahul, Ananya), recruiters (Microsoft, TCS), jobs, and alumni so you can test immediately. |

#### 2. Models (`src/models/`) — The Database Memory Forms
Each file describes one type of paper stored in the database filing cabinet:

| Model File | What does it store? |
| :--- | :--- |
| [`User.ts`](file:///d:/College/JSframework/backend/src/models/User.ts) | The basic account: email, hashed secret password, role (`student`, `recruiter`, `placement_officer`, `alumni`), and whether verified. |
| [`StudentProfile.ts`](file:///d:/College/JSframework/backend/src/models/StudentProfile.ts) | Roll number, college department, graduation year, CGPA, skills, resume link, bio, and LinkedIn. |
| [`RecruiterProfile.ts`](file:///d:/College/JSframework/backend/src/models/RecruiterProfile.ts) | Company name, recruiter designation, corporate email, phone, and verification badge. |
| [`AlumniProfile.ts`](file:///d:/College/JSframework/backend/src/models/AlumniProfile.ts) | Current employer, current job title, passing-out batch year, mentorship availability toggle, and expertise tags. |
| [`Job.ts`](file:///d:/College/JSframework/backend/src/models/Job.ts) | Title, job description, salary package (LPA), required skills, min CGPA, eligible departments, and application deadline. |
| [`Application.ts`](file:///d:/College/JSframework/backend/src/models/Application.ts) | A student's application for a job. Keeps track of status: `applied`, `shortlisted`, `interview_scheduled`, `accepted`, `rejected`. Has a special rule preventing double-applying! |
| [`Interview.ts`](file:///d:/College/JSframework/backend/src/models/Interview.ts) | Scheduled interview round (e.g. Technical Round 1), date, time, meeting link, and feedback notes. |
| [`PlacementDrive.ts`](file:///d:/College/JSframework/backend/src/models/PlacementDrive.ts) | Big campus hiring events (e.g. "TCS Mega Drive 2026") organized by the Placement Officer. |
| [`MentorshipRequest.ts`](file:///d:/College/JSframework/backend/src/models/MentorshipRequest.ts) | Letters sent from students to alumni asking for guidance, with status (`pending`, `accepted`, `declined`). |
| [`Event.ts`](file:///d:/College/JSframework/backend/src/models/Event.ts) | College workshops, webinars, and hackathons with date, location, and guest speakers. |
| [`EventRegistration.ts`](file:///d:/College/JSframework/backend/src/models/EventRegistration.ts) | Records of which students registered for which events. |
| [`Notification.ts`](file:///d:/College/JSframework/backend/src/models/Notification.ts) | Bell alerts (e.g. "Your interview was scheduled for tomorrow at 2 PM!"). |
| [`AuditLog.ts`](file:///d:/College/JSframework/backend/src/models/AuditLog.ts) | The security camera recording who did what and when (e.g. "Admin approved Recruiter X on Oct 17"). |
| [`Company.ts`](file:///d:/College/JSframework/backend/src/models/Company.ts) | Corporate directory details: company logo, industry, website, and office locations. |

#### 3. Controllers (`src/controllers/`) — The Brains of Each Action
| Controller File | What does it do? |
| :--- | :--- |
| [`authController.ts`](file:///d:/College/JSframework/backend/src/controllers/authController.ts) | Handles Login, Signup, Token Refreshing, and Logout. Blocks unauthorized people from registering as admins. |
| [`studentController.ts`](file:///d:/College/JSframework/backend/src/controllers/studentController.ts) | Lets students see their profile, update skills, upload resumes, see AI job matches, apply to jobs, and withdraw applications. |
| [`recruiterController.ts`](file:///d:/College/JSframework/backend/src/controllers/recruiterController.ts) | Lets recruiters post jobs, see applicants, filter by AI score, change status, download CSVs, and schedule interviews. |
| [`placementController.ts`](file:///d:/College/JSframework/backend/src/controllers/placementController.ts) | Lets placement officers see live analytics, verify new accounts, create campus drives, and inspect audit logs. |
| [`alumniController.ts`](file:///d:/College/JSframework/backend/src/controllers/alumniController.ts) | Lets alumni manage their mentor profile, view student mentorship requests, and reply with advice. |
| [`notificationController.ts`](file:///d:/College/JSframework/backend/src/controllers/notificationController.ts) | Fetches user notifications and marks them as read. |

#### 4. Helpers & Middlewares (`src/middleware/`, `src/services/`, `src/utils/`)
| File | What does it do? |
| :--- | :--- |
| [`middleware/authMiddleware.ts`](file:///d:/College/JSframework/backend/src/middleware/authMiddleware.ts) | The security guard. Checks the digital stamp (JWT token) on every request to see who you are. |
| [`middleware/roleMiddleware.ts`](file:///d:/College/JSframework/backend/src/middleware/roleMiddleware.ts) | The VIP bouncer. Ensures only recruiters can post jobs, only students can apply, etc. |
| [`middleware/errorHandler.ts`](file:///d:/College/JSframework/backend/src/middleware/errorHandler.ts) | The safety net. Catches any unexpected code error and returns a clean, friendly message instead of crashing. |
| [`services/aiClient.ts`](file:///d:/College/JSframework/backend/src/services/aiClient.ts) | The phone line between Node.js and Python. Calls the FastAPI AI service. If Python is sleeping, it has a clever fallback algorithm! |
| [`utils/jwt.ts`](file:///d:/College/JSframework/backend/src/utils/jwt.ts) | Generates short-lived Access Passports (15-min tokens) and long-lived Refresh Keys (7-day tokens). |

---

### 🎨 The Frontend Screen (`frontend/`)
*Written in React 18 & TypeScript with pure modern CSS — the interactive user interface.*

#### 1. Core Framework Setup
| File | What does it do? |
| :--- | :--- |
| [`src/main.tsx`](file:///d:/College/JSframework/frontend/src/main.tsx) | The very first file that runs in your browser. Plugs React into your webpage. |
| [`src/App.tsx`](file:///d:/College/JSframework/frontend/src/App.tsx) | The outer picture frame. Wraps the whole app with Redux store (global memory) and URL routing. |
| [`src/routes/AppRoutes.tsx`](file:///d:/College/JSframework/frontend/src/routes/AppRoutes.tsx) | The traffic cop. Reads the URL in your browser bar (`/jobs`, `/dashboard`) and shows the right page. Also blocks students from viewing admin pages. |
| [`src/styles/globals.css`](file:///d:/College/JSframework/frontend/src/styles/globals.css) | The master paint bucket. Defines smooth dark mode colors, responsive layout grids, glassmorphism cards, glowing buttons, and pretty fonts without needing heavy external CSS libraries. |
| [`src/services/api.ts`](file:///d:/College/JSframework/frontend/src/services/api.ts) | The messenger bird (Axios). Sends requests to Port 5000 and silently refreshes your login token if it expires so you don't get kicked out! |
| [`src/store/index.ts`](file:///d:/College/JSframework/frontend/src/store/index.ts) | The brain memory (Redux). Remembers who is logged in and stores unread notification badges. |

#### 2. Reusable Building Blocks (`src/components/`)
- **`layout/Navbar.tsx`**: The top header bar with the CampusConnect logo, menu links, notifications bell, and avatar logout button.
- **`layout/Sidebar.tsx`**: The side navigation drawer with quick links for the student, recruiter, or admin dashboard.
- **`layout/Footer.tsx`**: The bottom footer showing college links and copyright.
- **`common/Card.tsx`, `Modal.tsx`, `Badge.tsx`, `Spinner.tsx`**: Reusable LEGO bricks used across all pages for cards, popups, colored badges, and loading wheels.

#### 3. The Web Pages (`src/pages/`)
##### 🌐 Public Pages (Anyone can visit without logging in)
- **`LandingPage.tsx`**: The flashy homepage with hero banners, placement stats, testimonials, and features.
- **`JobsPage.tsx` & `JobDetailPage.tsx`**: Browse all public jobs, filter by branch/salary, and read full job descriptions.
- **`AlumniDirectoryPage.tsx`**: Search for senior graduates by company or graduation year.
- **`EventsPage.tsx`**: Calendar of upcoming campus workshops and drives.
- **`LoginPage.tsx`**: Sign in screen with **1-Click Demo Buttons** so teachers and testers can log in instantly with one click!
- **`RegisterPage.tsx`**: Create a new account as Student, Recruiter, or Alumni.

##### 🎓 Student Portal (`src/pages/student/`)
- **`StudentDashboard.tsx`**: The student command center showing applied jobs, upcoming interviews, and recent alerts.
- **`StudentProfilePage.tsx`**: Edit personal details, add skills, and upload PDF resumes with instant AI extraction!
- **`StudentRecommendationsPage.tsx`**: The AI job matches page showing percentage match bars, matching skills (green), and missing skills (orange).
- **`StudentApplicationsPage.tsx`**: Track your job applications in real time and withdraw if needed.

##### 🏢 Recruiter Portal (`src/pages/recruiter/`)
- **`RecruiterDashboard.tsx`**: Summary cards of active jobs, applicant counts, and interviews scheduled.
- **`RecruiterJobsPage.tsx`**: Create, edit, and close job postings.
- **`RecruiterApplicantsPage.tsx`**: View all candidate applications, inspect their AI match score, download the candidate list to CSV, change status, and schedule interview rounds.
- **`RecruiterCompanyPage.tsx`**: Edit the corporate profile and company description.

##### 👑 Placement Officer Portal (`src/pages/placement/`)
- **`PlacementDashboard.tsx`**: The ultimate high-level control panel with **live colorful Recharts** showing:
  - Placement rate percentages
  - Top hiring companies
  - Department-wise placement distribution
  - Average salary packages
- **`PlacementUsersPage.tsx`**: Verify and approve newly registered recruiters and students.
- **`PlacementDrivesPage.tsx`**: Create and organize campus-wide placement drives.
- **`PlacementAuditLogsPage.tsx`**: View real-time security logs of all actions on campus.

##### 🧙‍♂️ Alumni Portal (`src/pages/alumni/`)
- **`AlumniDashboard.tsx`**: Overview of active mentorship requests and upcoming campus talks.
- **`AlumniMentorshipPage.tsx`**: View messages from students seeking career advice and accept or decline requests.
- **`AlumniProfilePage.tsx`**: Update current company, job role, and expertise areas.

---

### 📚 The Documentation Library (`docs/`)
Comprehensive academic documentation for university reports:
- **`01_project_overview_and_abstract.md`**: Project overview and executive summary.
- **`02_system_requirements.md`**: Functional & non-functional requirements and user stories.
- **`03_system_architecture_and_diagrams.md`**: Complete Mermaid diagrams (Architecture, ERD, DFD Levels 0 & 1, Sequence, and Use Case).
- **`04_api_and_database_specification.md`**: Full REST API endpoints and Mongoose schemas.
- **`05_ai_recommendation_and_testing.md`**: Mathematical formulas for the AI engine, testing plan, and viva questions.

---

## 🎬 6. Real-Life Stories: What Happens Behind the Scenes?

### Story 1: Rahul Applies for a Job at Microsoft
1. Rahul (a 4th-year Computer Science student) logs into CampusConnect.
2. He clicks on **AI Recommendations**.
3. The frontend asks the backend: *"Hey, what jobs fit Rahul?"*
4. The backend calls the Python AI service: *"Check Rahul's skills (`React`, `Node.js`, `MongoDB`, CGPA 8.7) against all active jobs!"*
5. The AI calculates similarity and says: *"Microsoft's Full Stack Engineer role is a 92% match!"*
6. Rahul clicks **Apply Now**.
7. The backend checks if Rahul already applied (to prevent double applications). Everything looks good, so it saves the application with status `applied`.
8. The Recruiter at Microsoft gets an instant notification!

---

### Story 2: Recruiter Maya Hires Rahul
1. Maya (Recruiter at Microsoft) logs in and opens **Applicants for Full Stack Engineer**.
2. She sees Rahul at the top of the list with a shining **92% AI Match** badge.
3. She clicks **Schedule Interview**, chooses tomorrow at 2:00 PM on Teams, and clicks Send.
4. Rahul gets an alert: *"Interview scheduled for Oct 18, 2:00 PM!"*
5. After the interview, Maya clicks **Mark as Selected (Hired)**.
6. The Placement Officer's dashboard instantly updates its live Recharts bar: **Microsoft Hires +1!**

---

## 🎓 7. Quick Cheat Sheet for College Viva & Presentations

If your college professor or external examiner asks you questions, here are the easiest ways to answer like a pro:

| Examiner's Question | Easy 10-Year-Old Analogy Answer | Professional Buzzwords to Use |
| :--- | :--- | :--- |
| **Why did you use Python for AI and Node.js for Backend?** | Node.js is like a super-fast traffic cop who can talk to thousands of web browsers at once without slowing down. Python is like a mathematician who has special calculator tools (`scikit-learn`, `numpy`) for reading resumes and doing math. Keeping them separate is called **Microservices**! | Microservices architecture, separation of concerns, asynchronous I/O, scikit-learn. |
| **How does your AI actually match resumes?** | It uses a combination of hard eligibility (CGPA and branch bouncer) and soft relevance (TF-IDF vectorization and Cosine Similarity) plus skill overlap percentages. | TF-IDF, Cosine Similarity vector space model, weighted linear combination. |
| **How do you keep passwords safe?** | We never save real passwords! We scramble them with `bcrypt` using cryptographic salt so nobody—not even the database administrator—can ever see your password. | bcrypt salting & hashing, SHA-256 token hashing. |
| **How do you handle security permissions?** | We use JWT (JSON Web Tokens). When you log in, you get a digital passport. If a student tries to open an admin door, the server checks the passport, sees they are a `student`, and shows "403 Forbidden". | Role-Based Access Control (RBAC), JWT authentication, HTTP 403 Forbidden. |
| **What happens if MongoDB is not installed?** | The system automatically fires up `mongodb-memory-server` in the background, creating a zero-configuration sandbox so anyone can evaluate the project immediately. | In-memory embedded database fallback, zero-friction developer experience. |

---

### 🎉 That's It!
You now know every single piece, every file, and every secret behind **CampusConnect**! 🚀
Enjoy exploring and presenting the project!
