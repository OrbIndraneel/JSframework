import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  MapPin,
  IndianRupee,
  Calendar,
  Briefcase,
  GraduationCap,
  CheckCircle,
  AlertCircle,
  FileText,
  Send,
} from 'lucide-react';
import { apiClient } from '../../services/api.js';
import { Job, StudentProfile } from '../../types/index.js';
import { useAppSelector } from '../../store/index.js';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.js';
import { Modal } from '../../components/common/Modal.js';

export const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const [job, setJob] = useState<Job | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Application Modal state
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [coverNote, setCoverNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [applySuccess, setApplySuccess] = useState<string | null>(null);
  const [applyError, setApplyError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    apiClient
      .get('/students/jobs')
      .then((res) => {
        const found = res.data.data.jobs.find((j: Job) => j._id === id);
        if (found) {
          setJob(found);
        } else {
          setError('Job posting not found or has concluded.');
        }
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to load job posting.');
      })
      .finally(() => setLoading(false));

    if (isAuthenticated && user?.role === 'student') {
      apiClient.get('/students/profile').then((res) => {
        setProfile(res.data.data);
      });
    }
  }, [id, isAuthenticated, user]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setApplyError(null);
    setApplySuccess(null);

    try {
      const res = await apiClient.post('/students/applications', {
        jobId: id,
        coverNote,
        resumeUrl: profile?.resumeUrl,
      });

      setApplySuccess(
        `Application submitted successfully! Evaluated match score: ${res.data.data?.aiMatchScore ?? 'N/A'}%`
      );
      setTimeout(() => {
        setIsApplyModalOpen(false);
        navigate('/student/applications');
      }, 2000);
    } catch (err: any) {
      setApplyError(err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading job opening..." />;
  if (error || !job) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--navy-900)', marginBottom: '1rem' }}>{error || 'Job Not Found'}</h2>
        <Link to="/jobs" className="btn btn-primary">
          Back to Listings
        </Link>
      </div>
    );
  }

  const isEligible = profile
    ? (!job.minCgpa || profile.cgpa >= job.minCgpa) &&
      (!job.eligibleDepartments.length ||
        job.eligibleDepartments.includes(profile.department) ||
        job.eligibleDepartments.includes('All Departments'))
    : true;

  return (
    <div className="container" style={{ padding: '3rem 1rem', maxWidth: '1000px' }}>
      {/* Back button */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/jobs" style={{ color: 'var(--primary-600)', fontWeight: 500, fontSize: '0.875rem' }}>
          &larr; Back to all openings
        </Link>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '1.5rem',
            flexWrap: 'wrap',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid var(--surface-border)',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '12px',
                background: 'var(--surface-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--surface-border)',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              {job.company?.logoUrl ? (
                <img src={job.company.logoUrl} alt={job.company.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <Building2 size={32} color="var(--primary-600)" />
              )}
            </div>
            <div>
              <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '0.25rem' }}>
                {job.title}
              </h1>
              <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                {job.company?.name || 'Enterprise Employer'} • {job.company?.industry}
              </div>
            </div>
          </div>

          <div>
            {isAuthenticated && user?.role === 'student' ? (
              <button
                onClick={() => setIsApplyModalOpen(true)}
                className="btn btn-primary"
                style={{ padding: '0.75rem 1.75rem', fontSize: '1rem' }}
              >
                Apply for this Position
              </button>
            ) : !isAuthenticated ? (
              <Link to="/login" className="btn btn-primary" style={{ padding: '0.75rem 1.75rem', fontSize: '1rem' }}>
                Sign In to Apply
              </Link>
            ) : (
              <span className="badge badge-neutral">Role: {user?.role}</span>
            )}
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div
          className="grid-4"
          style={{
            background: 'var(--surface-muted)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '2rem',
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>COMPENSATION</div>
            <div style={{ fontWeight: 700, color: 'var(--navy-900)', fontSize: '0.95rem' }}>
              {job.jobType === 'internship'
                ? `₹${job.stipend?.toLocaleString()} / mo`
                : `₹${(job.salaryMin! / 100000).toFixed(1)} - ₹${(job.salaryMax! / 100000).toFixed(1)} LPA`}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>LOCATION</div>
            <div style={{ fontWeight: 700, color: 'var(--navy-900)', fontSize: '0.95rem' }}>
              {job.location} ({job.workplaceType})
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>ELIGIBILITY CGPA</div>
            <div style={{ fontWeight: 700, color: 'var(--navy-900)', fontSize: '0.95rem' }}>
              {job.minCgpa > 0 ? `${job.minCgpa} / 10.0` : 'No CGPA Cutoff'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>DEADLINE</div>
            <div style={{ fontWeight: 700, color: 'var(--navy-900)', fontSize: '0.95rem' }}>
              {new Date(job.deadline).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Eligibility Banner for logged in students */}
        {profile && (
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '2rem',
              background: isEligible ? 'var(--success-bg)' : 'var(--danger-bg)',
              border: `1px solid ${isEligible ? 'var(--success-border)' : 'var(--danger-border)'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            {isEligible ? (
              <>
                <CheckCircle size={20} color="var(--success-text)" />
                <span style={{ fontSize: '0.875rem', color: 'var(--success-text)', fontWeight: 600 }}>
                  You meet the academic eligibility criteria (CGPA: {profile.cgpa}, Dept: {profile.department}).
                </span>
              </>
            ) : (
              <>
                <AlertCircle size={20} color="var(--danger-text)" />
                <span style={{ fontSize: '0.875rem', color: 'var(--danger-text)', fontWeight: 600 }}>
                  Notice: Your current profile does not fulfill one or more eligibility criteria for this opening.
                </span>
              </>
            )}
          </div>
        )}

        {/* Description Section */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.75rem' }}>
            Role Description & Scope
          </h2>
          <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
            {job.description}
          </div>
        </div>

        {/* Technical & Soft Skills Requirements */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.75rem' }}>
            Required Competencies
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
            {job.requiredSkills.map((s) => (
              <span
                key={s}
                style={{
                  background: 'var(--primary-100)',
                  color: 'var(--primary-800)',
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                }}
              >
                {s}
              </span>
            ))}
          </div>

          {job.preferredSkills.length > 0 && (
            <>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Preferred / Value-Add Skills
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {job.preferredSkills.map((s) => (
                  <span
                    key={s}
                    style={{
                      background: 'var(--surface-muted)',
                      color: 'var(--text-secondary)',
                      padding: '0.3rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Department Eligibility */}
        {job.eligibleDepartments.length > 0 && (
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.75rem' }}>
              Eligible Academic Branches
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {job.eligibleDepartments.map((dept) => (
                <span
                  key={dept}
                  className="badge badge-info"
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                >
                  <GraduationCap size={14} /> {dept}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Application Submission Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title={`Apply for ${job.title}`}
      >
        <form onSubmit={handleApply}>
          {applySuccess && (
            <div
              style={{
                padding: '0.75rem',
                borderRadius: '6px',
                background: 'var(--success-bg)',
                color: 'var(--success-text)',
                marginBottom: '1rem',
                fontSize: '0.875rem',
              }}
            >
              {applySuccess}
            </div>
          )}

          {applyError && (
            <div
              style={{
                padding: '0.75rem',
                borderRadius: '6px',
                background: 'var(--danger-bg)',
                color: 'var(--danger-text)',
                marginBottom: '1rem',
                fontSize: '0.875rem',
              }}
            >
              {applyError}
            </div>
          )}

          <div style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Resume Document</label>
            {profile?.resumeUrl ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  background: 'var(--surface-muted)',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                }}
              >
                <FileText size={18} color="var(--primary-600)" />
                <span style={{ fontWeight: 600 }}>{profile.resumeOriginalName || 'Uploaded Profile Resume'}</span>
              </div>
            ) : (
              <div style={{ color: '#ef4444', fontSize: '0.85rem' }}>
                No resume detected on your profile. Please visit your Profile page first to upload your resume.
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Cover Note / Candidacy Rationale (Optional)</label>
            <textarea
              className="form-control"
              rows={4}
              placeholder="Highlight relevant course projects, internship experiences, or reasons you are excited about this opening..."
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsApplyModalOpen(false)}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting || !profile?.resumeUrl}
            >
              <Send size={16} /> {submitting ? 'Submitting Application...' : 'Confirm & Submit Application'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
