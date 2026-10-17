# CampusConnect — Academic Project Report & Specification

## 1. Project Abstract

**CampusConnect** is a unified, intelligent, full-stack enterprise resource planning (ERP) platform designed specifically for university placement cells, corporate talent recruiters, graduating students, and alumni networks. 

Conventional campus recruitment processes rely on disjointed spreadsheets, physical noticeboards, manual resume filtering, and fragmented alumni communications, introducing significant administrative overhead, verification bottlenecks, and missed placement opportunities.

CampusConnect resolves these systemic inefficiencies through a microservice-oriented web architecture:
- A high-performance **React 18 + Vite + TypeScript** single-page application with Redux Toolkit and Recharts.
- A robust **Node.js Express + TypeScript** REST backend providing role-based access control (RBAC), JWT token rotation with SHA-256 blacklisting, and persistent **MongoDB** document operations.
- An independent **Python FastAPI** AI microservice utilizing **scikit-learn** TF-IDF semantic vectorization, weighted skill taxonomy matching, strict academic threshold enforcement (CGPA, department, graduation batch), and document text parsing for PDF and Word DOCX formats with scanned-PDF detection.

---

## 2. Problem Statement

University placement cells face multifaceted challenges:
1. **Manual Inefficiency & Errors:** Tracking thousands of student applications, interview rounds, and offer letters via disconnected spreadsheets leads to administrative burnout, communication latency, and human errors.
2. **Eligibility Compliance Failures:** Recruiters specify strict criteria (e.g., minimum CGPA cutoffs, allowed engineering branches). Manually validating each candidate application across hundreds of openings is error-prone.
3. **Black-Box Resume Screening:** Students frequently lack feedback on why their applications are rejected or which technical competencies they lack for desired roles.
4. **Underutilized Alumni Networks:** Graduated alumni working in prestigious tech firms rarely have structured, friction-free workflows to mentor current students or conduct targeted mock interview sessions.

---

## 3. Project Objectives

- **Centralized Placement Management:** Provide dedicated, role-segregated portals for Students, Recruiters, Placement Officers, and Alumni.
- **Explainable AI Matching:** Implement transparent job-skill matching distinguishing between hard eligibility (CGPA, branch) and semantic relevance.
- **Zero-Trust Security & Role Safeguarding:** Enforce strict backend role authorization and prevent unauthorized administrative role selection during public registration.
- **Persistent Data & Auditing:** Record immutable audit logs for all administrative actions (user verification, drive scheduling, account status toggles).
- **Data-Driven Decision Making:** Supply placement officers with live database-backed analytics, conversion funnels, department distributions, and CSV report exports.
