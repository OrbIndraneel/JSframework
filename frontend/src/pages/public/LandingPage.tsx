import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Briefcase,
  Users,
  ShieldCheck,
  ArrowRight,
  MapPin,
  Calendar,
  Building2,
  CheckCircle,
} from 'lucide-react';
import { apiClient } from '../../services/api.js';
import { Job } from '../../types/index.js';

export const LandingPage: React.FC = () => {
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  useEffect(() => {
    // Fetch live opportunities from the API for genuine preview
    apiClient
      .get('/students/jobs', { params: { limit: 3 } })
      .then((res) => {
        if (res.data.data?.jobs) {
          setRecentJobs(res.data.data.jobs);
        }
      })
      .catch(() => {
        setRecentJobs([]);
      })
      .finally(() => {
        setLoadingJobs(false);
      });
  }, []);

  return (
    <div>
      {/* 1. Hero Section (Design1.md: Concise headline, two clear CTAs, calm campus canvas) */}
      <section
        style={{
          background: 'var(--color-canvas)',
          padding: '4rem 0 3.5rem 0',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="container" style={{ maxWidth: '840px', textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.3rem 0.75rem',
              background: 'var(--color-primary-soft)',
              color: 'var(--color-primary)',
              borderRadius: 'var(--rounded-input)',
              fontSize: '13px',
              fontWeight: 600,
              marginBottom: '1.25rem',
              border: '1px solid #bfdbfe',
            }}
          >
            University Placement & Alumni Workspace
          </div>

          <h1
            style={{
              fontSize: '32px',
              fontWeight: 700,
              color: 'var(--color-ink)',
              lineHeight: 1.25,
              marginBottom: '1rem',
              letterSpacing: '-0.02em',
            }}
          >
            Connecting campus talent with verified career opportunities.
          </h1>

          <p
            style={{
              fontSize: '16px',
              color: 'var(--color-muted)',
              lineHeight: 1.6,
              marginBottom: '2rem',
              maxWidth: '680px',
              margin: '0 auto 2rem auto',
            }}
          >
            CampusConnect brings academic placement drives, verified corporate recruitment, and graduate alumni mentorship into one transparent, dependable campus workspace.
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              flexWrap: 'wrap',
            }}
          >
            <Link to="/jobs" className="btn btn-primary" style={{ height: '42px', padding: '0 1.25rem' }}>
              Find opportunities <ArrowRight size={16} />
            </Link>
            <Link to="/register" className="btn btn-secondary" style={{ height: '42px', padding: '0 1.25rem' }}>
              Recruit talent
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Campus Recruitment Workflow Section */}
      <section style={{ padding: '3.5rem 0', background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 2.5rem auto' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '0.5rem' }}>
              Built for the work campus stakeholders actually need to do
            </h2>
            <p style={{ color: 'var(--color-muted)', fontSize: '14px' }}>
              Role-focused workflows designed for eligibility compliance, transparent review stages, and audited outcomes.
            </p>
          </div>

          <div className="grid-4">
            <div className="card">
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--rounded-input)',
                  background: 'var(--color-primary-soft)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <GraduationCap size={20} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '0.4rem' }}>
                Students
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--color-muted)', lineHeight: 1.55, marginBottom: '1rem' }}>
                Verify department eligibility, apply to open drives, track review stages in real-time, and get actionable skill overlap feedback.
              </p>
              <Link to="/jobs" style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '13px' }}>
                Explore openings &rarr;
              </Link>
            </div>

            <div className="card">
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--rounded-input)',
                  background: 'var(--color-warning-soft)',
                  color: 'var(--color-warning)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <Briefcase size={20} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '0.4rem' }}>
                Recruiters
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--color-muted)', lineHeight: 1.55, marginBottom: '1rem' }}>
                Publish criteria-bound openings, review candidate resumes, manage shortlisted pools, schedule rounds, and export rosters.
              </p>
              <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '13px' }}>
                Post openings &rarr;
              </Link>
            </div>

            <div className="card">
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--rounded-input)',
                  background: 'var(--color-success-soft)',
                  color: 'var(--color-success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <ShieldCheck size={20} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '0.4rem' }}>
                Placement Cell
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--color-muted)', lineHeight: 1.55, marginBottom: '1rem' }}>
                Oversee campus recruitment schedules, verify partner credentials, monitor application volumes, and maintain audit-ready records.
              </p>
              <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '13px' }}>
                Cell dashboard &rarr;
              </Link>
            </div>

            <div className="card">
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--rounded-input)',
                  background: '#f3e8ff',
                  color: '#7e22ce',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <Users size={20} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '0.4rem' }}>
                Alumni Network
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--color-muted)', lineHeight: 1.55, marginBottom: '1rem' }}>
                Share domain expertise with graduating batches, review student inquiries, and host career preparation workshops.
              </p>
              <Link to="/alumni/directory" style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '13px' }}>
                View directory &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Current Campus Opportunities Preview (Populated directly from API) */}
      <section style={{ padding: '3.5rem 0', background: 'var(--color-canvas)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '0.25rem' }}>
                Current Campus Recruitment Openings
              </h2>
              <p style={{ color: 'var(--color-muted)', fontSize: '13px' }}>
                Verified campus opportunities actively accepting applications.
              </p>
            </div>
            <Link to="/jobs" className="btn btn-secondary btn-sm">
              View all openings &rarr;
            </Link>
          </div>

          {loadingJobs ? (
            <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-muted)', fontSize: '14px' }}>
              Loading active campus opportunities...
            </div>
          ) : recentJobs.length > 0 ? (
            <div className="grid-3">
              {recentJobs.map((job) => (
                <div key={job._id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span className="badge badge-info">{job.jobType.replace('_', ' ')}</span>
                    <span style={{ fontSize: '12px', color: 'var(--color-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={13} /> {new Date(job.deadline).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '0.35rem' }}>
                    {job.title}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '13px', color: 'var(--color-muted)', marginBottom: '0.85rem' }}>
                    <Building2 size={14} />
                    <span>{typeof job.company === 'object' && job.company?.name ? job.company.name : 'Verified Campus Partner'}</span>
                    <span>&bull;</span>
                    <MapPin size={14} />
                    <span>{job.location}</span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
                    {(job.requiredSkills || []).slice(0, 3).map((skill: string, i: number) => (
                      <span
                        key={i}
                        style={{
                          background: 'var(--color-canvas)',
                          border: '1px solid var(--color-border)',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          color: 'var(--color-ink)',
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                    {(job.requiredSkills || []).length > 3 && (
                      <span style={{ fontSize: '11px', color: 'var(--color-muted)', alignSelf: 'center' }}>
                        +{(job.requiredSkills || []).length - 3} more
                      </span>
                    )}
                  </div>

                  <div style={{ marginTop: 'auto', paddingTop: '0.85rem', borderTop: '1px solid var(--color-border)' }}>
                    <Link to={`/jobs/${job._id}`} className="btn btn-outline-primary btn-sm" style={{ width: '100%' }}>
                      View eligibility & apply
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '2.5rem' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '0.25rem' }}>
                No active openings currently open
              </div>
              <p style={{ color: 'var(--color-muted)', fontSize: '13px' }}>
                When corporate recruiters publish recruitment drives, they will appear directly here.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 4. Placement Coordination & Mentorship Support */}
      <section style={{ padding: '3.5rem 0', background: 'var(--color-surface)' }}>
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center', gap: '2.5rem' }}>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '0.75rem' }}>
                Clear coordination across every placement stage
              </h2>
              <p style={{ color: 'var(--color-muted)', fontSize: '14px', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                CampusConnect eliminates communication delays between campus placement offices, company recruiters, and student applicants.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '14px', color: 'var(--color-ink)' }}>
                  <CheckCircle size={18} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Eligibility enforcement:</strong> Automatically verifies academic criteria (CGPA, Branch, Graduation Year) before allowing drive submission.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '14px', color: 'var(--color-ink)' }}>
                  <CheckCircle size={18} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Explicit application status:</strong> Tracks stages clearly from Applied and Under Review to Shortlisted, Interview, and Offer.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '14px', color: 'var(--color-ink)' }}>
                  <CheckCircle size={18} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Alumni guidance:</strong> Direct mentorship requests connecting students with verified alumni working across top enterprises.</span>
                </div>
              </div>
            </div>

            <div className="card" style={{ background: 'var(--color-canvas)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '0.75rem' }}>
                Ready to participate in upcoming campus drives?
              </div>
              <p style={{ fontSize: '13px', color: 'var(--color-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Sign in with your university student email or corporate recruiter account to access active placement drives.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link to="/login" className="btn btn-primary">
                  Sign in to portal
                </Link>
                <Link to="/register" className="btn btn-secondary">
                  Create new account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
