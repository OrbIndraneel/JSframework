import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout.js';
import { AppLayout } from '../components/layout/AppLayout.js';
import { ProtectedRoute } from './ProtectedRoute.js';

// Public pages
import { LandingPage } from '../pages/public/LandingPage.js';
import { JobsPage } from '../pages/public/JobsPage.js';
import { JobDetailPage } from '../pages/public/JobDetailPage.js';
import { AlumniDirectoryPage } from '../pages/public/AlumniDirectoryPage.js';
import { EventsPage } from '../pages/public/EventsPage.js';
import { LoginPage } from '../pages/public/LoginPage.js';
import { RegisterPage } from '../pages/public/RegisterPage.js';
import { ForgotPasswordPage } from '../pages/public/ForgotPasswordPage.js';
import { UnauthorizedPage } from '../pages/public/UnauthorizedPage.js';
import { NotFoundPage } from '../pages/public/NotFoundPage.js';

// Student Portal pages
import { StudentDashboard } from '../pages/student/StudentDashboard.js';
import { StudentProfilePage } from '../pages/student/StudentProfilePage.js';
import { StudentRecommendationsPage } from '../pages/student/StudentRecommendationsPage.js';
import { StudentApplicationsPage } from '../pages/student/StudentApplicationsPage.js';

// Recruiter Portal pages
import { RecruiterDashboard } from '../pages/recruiter/RecruiterDashboard.js';
import { RecruiterCompanyPage } from '../pages/recruiter/RecruiterCompanyPage.js';
import { RecruiterJobsPage } from '../pages/recruiter/RecruiterJobsPage.js';
import { RecruiterApplicantsPage } from '../pages/recruiter/RecruiterApplicantsPage.js';

// Placement Officer pages
import { PlacementDashboard } from '../pages/placement/PlacementDashboard.js';
import { PlacementUsersPage } from '../pages/placement/PlacementUsersPage.js';
import { PlacementDrivesPage } from '../pages/placement/PlacementDrivesPage.js';
import { PlacementAuditLogsPage } from '../pages/placement/PlacementAuditLogsPage.js';

// Alumni Portal pages
import { AlumniDashboard } from '../pages/alumni/AlumniDashboard.js';
import { AlumniProfilePage } from '../pages/alumni/AlumniProfilePage.js';
import { AlumniMentorshipPage } from '../pages/alumni/AlumniMentorshipPage.js';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes with standard PublicLayout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />
        <Route path="/alumni/directory" element={<AlumniDirectoryPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Role Protected Routes wrapped in Dashboard AppLayout */}
      <Route element={<AppLayout />}>
        {/* Student Portal */}
        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/profile" element={<StudentProfilePage />} />
          <Route path="/student/recommendations" element={<StudentRecommendationsPage />} />
          <Route path="/student/applications" element={<StudentApplicationsPage />} />
        </Route>

        {/* Recruiter Portal */}
        <Route element={<ProtectedRoute allowedRoles={['recruiter']} />}>
          <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
          <Route path="/recruiter/company" element={<RecruiterCompanyPage />} />
          <Route path="/recruiter/jobs" element={<RecruiterJobsPage />} />
          <Route path="/recruiter/jobs/:jobId/applicants" element={<RecruiterApplicantsPage />} />
        </Route>

        {/* Placement Officer ERP */}
        <Route element={<ProtectedRoute allowedRoles={['placement_officer']} />}>
          <Route path="/placement/dashboard" element={<PlacementDashboard />} />
          <Route path="/placement/users" element={<PlacementUsersPage />} />
          <Route path="/placement/drives" element={<PlacementDrivesPage />} />
          <Route path="/placement/audit-logs" element={<PlacementAuditLogsPage />} />
        </Route>

        {/* Alumni Hub */}
        <Route element={<ProtectedRoute allowedRoles={['alumni']} />}>
          <Route path="/alumni/dashboard" element={<AlumniDashboard />} />
          <Route path="/alumni/profile" element={<AlumniProfilePage />} />
          <Route path="/alumni/mentorship" element={<AlumniMentorshipPage />} />
        </Route>
      </Route>
    </Routes>
  );
};
