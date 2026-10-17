import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, Calendar, CheckCircle, Plus, Building2, Download } from 'lucide-react';
import { apiClient } from '../../services/api.js';
import { Job, Company } from '../../types/index.js';
import { useAppSelector } from '../../store/index.js';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.js';

export const RecruiterDashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([apiClient.get('/recruiters/jobs'), apiClient.get('/recruiters/company')])
      .then(([jobRes, compRes]) => {
        setJobs(jobRes.data.data);
        setCompany(compRes.data.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner message="Loading recruiter talent workspace..." />;

  const activeJobs = jobs.filter((j) => j.status === 'active');
  const totalApplicants = jobs.reduce((sum, j) => sum + (j.applicantCount || 0), 0);

  return (
    <div>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem 2.5rem',
          color: '#ffffff',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div>
          <div style={{ fontSize: '0.85rem', opacity: 0.85, fontWeight: 500 }}>
            CORPORATE RECRUITMENT SUITE
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.25rem' }}>
            {company?.name || 'Enterprise Employer'}
          </h1>
          <p style={{ opacity: 0.9, fontSize: '0.95rem', marginTop: '0.35rem' }}>
            Recruiter: {user?.name} ({user?.email}) •{' '}
            {company?.isVerified ? '✓ Verified Partner' : 'Verification In Progress'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/recruiter/jobs" className="btn btn-primary btn-sm" style={{ background: '#ffffff', color: '#1e3a8a', fontWeight: 600 }}>
            <Plus size={16} /> Post New Job
          </Link>
          <Link to="/recruiter/company" className="btn btn-secondary btn-sm" style={{ fontWeight: 600 }}>
            <Building2 size={16} /> Company Profile
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid-3" style={{ marginBottom: '2.5rem' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
            <Briefcase size={24} />
          </div>
          <div>
            <div className="stat-val">{activeJobs.length}</div>
            <div className="stat-label">Active Job Openings</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#ecfdf5', color: '#047857' }}>
            <Users size={24} />
          </div>
          <div>
            <div className="stat-val">{totalApplicants}</div>
            <div className="stat-label">Total Student Applicants</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7', color: '#b45309' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <div className="stat-val">{jobs.length}</div>
            <div className="stat-label">Total Postings Created</div>
          </div>
        </div>
      </div>

      {/* Active Jobs Table */}
      <div className="card">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid var(--surface-border)',
          }}
        >
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--navy-900)' }}>
            Active Campus Job Postings
          </h2>
          <Link to="/recruiter/jobs" style={{ color: 'var(--primary-600)', fontSize: '0.85rem', fontWeight: 600 }}>
            Manage All Postings &rarr;
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
            <p>You haven&apos;t created any job postings yet.</p>
            <Link to="/recruiter/jobs" className="btn btn-primary btn-sm" style={{ marginTop: '0.75rem' }}>
              Create Your First Job Posting
            </Link>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Deadline</th>
                  <th>Applicants</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job._id}>
                    <td style={{ fontWeight: 600 }}>{job.title}</td>
                    <td style={{ textTransform: 'capitalize' }}>{job.jobType.replace('_', ' ')}</td>
                    <td>{job.location}</td>
                    <td>{new Date(job.deadline).toLocaleDateString()}</td>
                    <td>
                      <span className="badge badge-info" style={{ fontWeight: 700 }}>
                        {job.applicantCount || 0} Candidates
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${job.status === 'active' ? 'badge-success' : 'badge-neutral'}`}>
                        {job.status}
                      </span>
                    </td>
                    <td>
                      <Link to={`/recruiter/jobs/${job._id}/applicants`} className="btn btn-outline-primary btn-sm">
                        Review Applicants ({job.applicantCount || 0})
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
