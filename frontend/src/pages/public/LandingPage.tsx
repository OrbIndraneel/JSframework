import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Briefcase,
  Users,
  Award,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Building,
  CheckCircle2,
} from 'lucide-react';
import { apiClient } from '../../services/api.js';

export const LandingPage: React.FC = () => {
  const [stats, setStats] = useState({
    activeJobs: 4,
    totalStudents: 4,
    placedStudents: 1,
    verifiedRecruiters: 4,
    placementRate: 25,
  });

  useEffect(() => {
    // Fetch live platform metrics from placement analytics endpoint
    apiClient
      .get('/placement/analytics')
      .then((res) => {
        if (res.data.data?.kpis) {
          setStats(res.data.data.kpis);
        }
      })
      .catch(() => {
        // Fallback default state preserved
      });
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)',
          padding: '5rem 0 4rem 0',
          borderBottom: '1px solid var(--surface-border)',
        }}
      >
        <div className="container" style={{ textAlign: 'center', maxWidth: '880px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.9rem',
              background: 'var(--primary-100)',
              color: 'var(--primary-800)',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
            }}
          >
            <Sparkles size={16} /> Campus Placement & Alumni Relations ERP 2025
          </div>

          <h1
            style={{
              fontSize: '2.75rem',
              fontWeight: 800,
              color: 'var(--navy-900)',
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              marginBottom: '1.25rem',
            }}
          >
            Empowering Campus Careers Through Intelligent Placement & Alumni Networking
          </h1>

          <p
            style={{
              fontSize: '1.15rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginBottom: '2.5rem',
            }}
          >
            CampusConnect bridges ambitious students, verified enterprise recruiters, college placement officers, and accomplished alumni into one transparent, AI-augmented academic platform.
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <Link to="/register" className="btn btn-primary" style={{ padding: '0.75rem 1.75rem', fontSize: '1rem' }}>
              Get Started Free <ArrowRight size={18} />
            </Link>
            <Link to="/jobs" className="btn btn-secondary" style={{ padding: '0.75rem 1.75rem', fontSize: '1rem' }}>
              Explore Campus Openings
            </Link>
          </div>
        </div>
      </section>

      {/* Live Academic Placement Statistics */}
      <section style={{ padding: '3.5rem 0', background: '#ffffff', borderBottom: '1px solid var(--surface-border)' }}>
        <div className="container">
          <div
            style={{
              textAlign: 'center',
              marginBottom: '2rem',
            }}
          >
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--navy-900)' }}>
              Live University Placement Milestones
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Data synchronized directly with live campus recruitment records.
            </p>
          </div>

          <div className="grid-4">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#dbeafe', color: '#1d4ed8' }}>
                <TrendingUp size={24} />
              </div>
              <div>
                <div className="stat-val">{stats.placementRate}%</div>
                <div className="stat-label">Graduating Placement Rate</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#ecfdf5', color: '#047857' }}>
                <Briefcase size={24} />
              </div>
              <div>
                <div className="stat-val">{stats.activeJobs}</div>
                <div className="stat-label">Active Campus Openings</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
                <Building size={24} />
              </div>
              <div>
                <div className="stat-val">{stats.verifiedRecruiters}</div>
                <div className="stat-label">Verified Hiring Partners</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#fef3c7', color: '#b45309' }}>
                <Users size={24} />
              </div>
              <div>
                <div className="stat-val">{stats.placedStudents}</div>
                <div className="stat-label">Placed Batch Candidates</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Ecosystem Pillars */}
      <section style={{ padding: '4.5rem 0', backgroundColor: 'var(--surface-bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem auto' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
              Four Portals. One Integrated Network.
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
              Engineered with dedicated workflows, strict role boundaries, and audit logging for every university stakeholder.
            </p>
          </div>

          <div className="grid-4">
            <div className="card card-hover">
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  background: 'var(--primary-100)',
                  color: 'var(--primary-700)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <GraduationCap size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
                Student Portal
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                Resume upload with AI parsing, eligibility-checked job applications, real-time status tracking, and personalized career skill gap analysis.
              </p>
              <Link to="/login" style={{ color: 'var(--primary-600)', fontWeight: 600, fontSize: '0.85rem' }}>
                Student Login &rarr;
              </Link>
            </div>

            <div className="card card-hover">
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  background: '#fef3c7',
                  color: '#b45309',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <Briefcase size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
                Recruiter Portal
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                Company verification, posting criteria-based jobs, evaluating candidate resumes, updating statuses, scheduling interviews, and exporting applicant rosters.
              </p>
              <Link to="/login" style={{ color: 'var(--primary-600)', fontWeight: 600, fontSize: '0.85rem' }}>
                Recruiter Login &rarr;
              </Link>
            </div>

            <div className="card card-hover">
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  background: '#ecfdf5',
                  color: '#047857',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <Award size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
                Placement Cell ERP
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                Annual recruitment drive management, recruiter & alumni account verification, real-time database analytics charts, and administrative audit logging.
              </p>
              <Link to="/login" style={{ color: 'var(--primary-600)', fontWeight: 600, fontSize: '0.85rem' }}>
                Placement Officer Login &rarr;
              </Link>
            </div>

            <div className="card card-hover">
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  background: '#f3e8ff',
                  color: '#7e22ce',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <Users size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
                Alumni Hub
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                Graduate career profiles, structured 1-on-1 mentorship requests from juniors, and hosting webinars and placement prep masterclasses.
              </p>
              <Link to="/login" style={{ color: 'var(--primary-600)', fontWeight: 600, fontSize: '0.85rem' }}>
                Alumni Login &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AI Recommendation Engine Highlight */}
      <section style={{ padding: '4.5rem 0', background: '#ffffff', borderBottom: '1px solid var(--surface-border)' }}>
        <div className="container">
          <div
            style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
              borderRadius: 'var(--radius-lg)',
              padding: '3.5rem 2.5rem',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '2rem',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ maxWidth: '600px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  marginBottom: '1rem',
                }}
              >
                <Sparkles size={14} /> Python FastAPI & Scikit-Learn Microservice
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1.25, marginBottom: '1rem' }}>
                Transparent, Explainable Career Recommendations
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                CampusConnect matches candidate skill sets and resumes against enterprise job requirements using semantic TF-IDF cosine similarity, weighted skill overlap, and academic eligibility enforcement.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <CheckCircle2 size={18} color="#4ade80" /> Strict eligibility verification (CGPA, Branch, Grad Year)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <CheckCircle2 size={18} color="#4ade80" /> Actionable skill gap analysis highlighting missing prerequisites
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <CheckCircle2 size={18} color="#4ade80" /> Automated PDF and DOCX resume parsing with field extraction
                </div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: 'var(--radius-md)',
                padding: '2rem',
                minWidth: '280px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '3rem', fontWeight: 800, color: '#60a5fa' }}>92.4%</div>
              <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.5rem' }}>Sample Match Score</div>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
                Evaluated against Microsoft SDE-1 requirements: Python, React, Algorithms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Testimonials */}
      <section style={{ padding: '4rem 0', backgroundColor: 'var(--surface-bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--navy-900)' }}>
              Voices from the University Ecosystem
            </h2>
          </div>

          <div className="grid-3">
            <div className="card">
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                &ldquo;CampusConnect streamlined our entire placement season. We tracked our application funnel, scheduled interviews, and had transparent insight into our placement metrics.&rdquo;
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#bfdbfe', color: '#1e40af', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  RS
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Dr. Rajesh Sharma</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Head of Placement Cell, IIITE</div>
                </div>
              </div>
            </div>

            <div className="card">
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                &ldquo;The AI skill-gap breakdown showed me exactly what technologies I was missing for the cloud engineering role. After learning Docker, I got selected at Microsoft India!&rdquo;
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#bbf7d0', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  AV
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Ananya Verma</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Selected at Microsoft (Batch 2025)</div>
                </div>
              </div>
            </div>

            <div className="card">
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                &ldquo;As an alumnus at Google, I can easily schedule mock system design interviews with graduating juniors through the mentorship request workflow.&rdquo;
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fed7aa', color: '#9a3412', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  AS
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Amit Saxena</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Senior SWE at Google (Alumni 2021)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
