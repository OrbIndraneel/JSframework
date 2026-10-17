# CampusConnect — College Placement & Alumni Portal

[![Node.js](https://img.shields.io/badge/Node.js-v20%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-teal.svg)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-brightgreen.svg)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)

> **Academic Full-Stack Project**: A complete, modern ERP web application connecting university students, verified enterprise recruiters, college placement officers, and graduate alumni. Powered by a React single-page frontend, an Express REST backend with MongoDB, and an explainable Python FastAPI AI recommendation & resume parsing microservice.
>
> 🎈 **New to the project or preparing for viva?** Check out [**CampusConnect Explained for a 10-Year-Old**](file:///d:/College/JSframework/EXPLAINED_LIKE_IM_10.md) for a crystal-clear, fun tour of every file and feature!

---

## 1. Mandatory Technology Stack

Every required technology has been fully integrated into the working project:

| Layer / Technology | Specification & Implementation Details |
| :--- | :--- |
| **Frontend Framework** | **React 18** with **Vite 6** and **TypeScript** |
| **Global State Management**| **Redux Toolkit** (`authSlice`, `notificationSlice`) |
| **Client-Side Routing** | **React Router 7** with role-protected route guards |
| **HTTP Client** | **Axios** with centralized request/response interceptors & token refresh |
| **UI Styling** | **Vanilla CSS Design System** (Professional university ERP blue-and-white theme) |
| **Analytics & Visuals** | **Recharts** (Application conversion funnel, department distribution pie chart) |
| **Main Backend** | **Node.js** + **Express.js** in **TypeScript** |
| **Database & ODM** | **MongoDB** with **Mongoose 8** models, compound indexes, and auto in-memory fallback |
| **Authentication** | **JWT** access tokens + rotating refresh tokens with SHA-256 hash persistence & **bcryptjs** |
| **Validation** | **Zod** schema validation for environment variables, auth, and job payloads |
| **AI / Python Microservice**| **Python 3.11+**, **FastAPI**, **Pydantic v2**, **scikit-learn**, **NumPy**, **Pandas**, `pypdf`, `python-docx` |
| **DevOps & Containers** | **Docker** & **Docker Compose** multi-service orchestration |
| **Automated Testing** | **Jest & Supertest** (Backend), **Vitest** (Frontend), **Pytest & HTTPX** (AI Service) |

---

## 2. Seeded Demo Accounts (One-Click Login Ready)

The development seed script (`npm run seed`) populates realistic Indian academic, corporate, and alumni records. The login page also includes **instant 1-click autofill buttons**:

| User Role | Seeded Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Placement Officer** (Admin) | `admin@campusconnect.edu` | `Password@123` | Dr. Rajesh Sharma, Placement Cell Head |
| **Corporate Recruiter** | `recruiter.msft@microsoft.com` | `Password@123` | Neha Kulkarni, Microsoft India |
| **Corporate Recruiter** | `recruiter.tcs@tcs.com` | `Password@123` | Priya Nair, Tata Consultancy Services |
| **Student** (High Match) | `rahul.sharma@student.iiite.ac.in`| `Password@123` | Rahul Sharma (CSE, CGPA: 8.85, 2025 batch) |
| **Student** (Placed) | `ananya.verma@student.iiite.ac.in` | `Password@123` | Ananya Verma (IT, CGPA: 9.32, Selected at MSFT) |
| **Alumni Mentor** | `alumni.amit@gmail.com` | `Password@123` | Amit Saxena, Senior SWE at Google (Batch 2021) |

---

## 3. Quick Start Guide

### Option A: Local Development (Without Docker)

CampusConnect features **zero-setup embedded MongoDB fallback**: if no local MongoDB instance is running, the backend automatically spins up an in-memory instance, allowing you to run the system immediately.

#### Step 1: Install Dependencies
```bash
# In the project root:
npm run install:all
```

#### Step 2: Seed the Database
```bash
npm run seed
```

#### Step 3: Start All Three Services
Open three terminal windows:

**Terminal 1 (AI Microservice — Port 8000):**
```bash
cd ai-service
python -m uvicorn app.main:app --port 8000 --reload
```
*API docs available at `http://localhost:8000/api/v1/docs`*

**Terminal 2 (Express Backend — Port 5000):**
```bash
npm run dev:backend
```
*Health check at `http://localhost:5000/api/health`*

**Terminal 3 (React Frontend — Port 5173):**
```bash
npm run dev:frontend
```
*Access the web application at `http://localhost:5173`*

---

### Option B: Docker Compose Multi-Service Deployment

To spin up all services (MongoDB, FastAPI AI, Express API, and Nginx React Frontend) in isolated containers:

```bash
docker compose up --build
```

- Web Application: `http://localhost:80`
- Express API: `http://localhost:5000`
- FastAPI AI Microservice: `http://localhost:8000/api/v1/docs`
- MongoDB: `localhost:27017`

---

## 4. Running Automated Tests

All services include comprehensive automated test suites:

```bash
# Run all tests across backend, frontend, and AI microservice:
npm test

# Or run service-specific tests individually:
npm run test:backend   # Jest + Supertest (13 tests passing)
npm run test:frontend  # Vitest (3 tests passing)
npm run test:ai        # Pytest + HTTPX (8 tests passing)
```

---

## 5. Repository Structure

```
campusconnect/
├── ai-service/                # Python FastAPI Microservice
│   ├── app/
│   │   ├── api/v1/            # Match, recommend, resume parse endpoints
│   │   ├── core/              # Config, logging
│   │   ├── schemas/           # Pydantic request & response contracts
│   │   └── services/          # Scikit-learn TF-IDF matching & pypdf parser
│   ├── tests/                 # 8 Pytest unit tests (100% pass)
│   ├── Dockerfile
│   └── requirements.txt
├── backend/                   # Node.js + Express + TypeScript Backend
│   ├── src/
│   │   ├── config/            # Typed Zod env config & MongoDB connection
│   │   ├── controllers/       # Auth, Student, Recruiter, Placement, Alumni
│   │   ├── middleware/        # JWT auth, RBAC, Multer upload, Audit logger
│   │   ├── models/            # 14 Mongoose models with compound indexes
│   │   ├── routes/            # REST route declarations
│   │   ├── scripts/           # seed.ts database populator
│   │   └── services/          # aiClient.ts bridge to FastAPI
│   ├── tests/                 # 13 Jest integration tests (100% pass)
│   ├── Dockerfile
│   └── package.json
├── frontend/                  # React 18 + Vite + TypeScript Frontend
│   ├── src/
│   │   ├── components/        # Navbar, Sidebar, Modal, Tables, Badges
│   │   ├── pages/
│   │   │   ├── public/        # Landing, Jobs, JobDetail, AlumniDirectory, Events, Auth
│   │   │   ├── student/       # Dashboard, Profile, AI Recommendations, Applications
│   │   │   ├── recruiter/     # Dashboard, Company, Jobs, Applicants & CSV Export
│   │   │   ├── placement/     # Analytics, User Verification, Drives, Audit Logs
│   │   │   └── alumni/        # Dashboard, Mentorship Requests, Profile
│   │   ├── routes/            # AppRoutes & ProtectedRoute by role
│   │   ├── services/          # Axios client with automatic token refresh
│   │   ├── store/             # Redux Toolkit store (authSlice, notificationSlice)
│   │   ├── styles/            # University ERP design system tokens
│   │   └── types/             # TypeScript interfaces
│   ├── Dockerfile
│   └── package.json
├── docs/                      # Comprehensive Academic Documentation
│   ├── 01_project_overview_and_abstract.md
│   ├── 02_system_requirements.md
│   ├── 03_system_architecture_and_diagrams.md
│   ├── 04_api_and_database_specification.md
│   └── 05_ai_recommendation_and_testing.md
├── docker-compose.yml         # Containerized orchestration
├── PROGRESS.md                # Development milestone tracker
└── README.md                  # Master documentation
```

---

## 6. Academic Documentation & Demonstration

Full academic documentation, including Mermaid diagrams, problem statements, use cases, ER diagrams, data flow diagrams (Level 0 and 1), and viva presentation walkthroughs, is available in the [`docs/`](./docs/) directory.
