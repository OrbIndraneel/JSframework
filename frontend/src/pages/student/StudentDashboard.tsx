import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import { apiClient } from '../../services/api.js';
import { Application, StudentProfile } from '../../types/index.js';
import { useAppSelector } from '../../store/index.js';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.js';

export const StudentDashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [recommendationsCount, setRecommendationsCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiClient.get('/students/profile'),
      apiClient.get('/students/applications'),
      apiClient.get('/students/recommendations').catch(() => ({ data: { data: { recommendations: [] } } })),
    ])
      .then(([profRes, appRes, recRes]) => {
        setProfile(profRes.data.data);
        setApplications(appRes.data.data);
        setRecommendationsCount(recRes.data.data?.recommendations?.length || 0);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner message="Loading student workspace..." />;

  const interviewsCount = applications.filter((a) => a.status === 'interview_scheduled').length;
  const selectedCount = applications.filter((a) => a.status === 'selected').length;

  return (
    <div>
      {/* Welcome Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
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
            STUDENT PLACEMENT PORTAL
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.25rem' }}>
            Welcome back, {user?.name}!
          </h1>
          <p style={{ opacity: 0.9, fontSize: '0.95rem', marginTop: '0.35rem' }}>
            {profile?.department} • Roll No: {profile?.rollNumber} • CGPA: {profile?.cgpa}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/student/recommendations" className="btn btn-secondary btn-sm" style={{ fontWeight: 600 }}>
            <Sparkles size={16} /> AI Matches ({recommendationsCount})
          </Link>
          <Link to="/jobs" className="btn btn-primary btn-sm" style={{ background: '#ffffff', color: '#1e3a8a', fontWeight: 600 }}>
            Browse Openings &rarr;
          </Link>
        </div>
      </div>

      {/* Profile Completeness Alert if < 100% */}
      {profile && profile.completeness < 100 && (
        <div
          style={{
            background: 'var(--warning-bg)',
            border: '1px solid var(--warning-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertTriangle size={22} color="var(--warning-text)" />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--warning-text)' }}>
                Profile Completeness: {profile.completeness}%
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--warning-text)' }}>
                Upload your resume document and add your projects to maximize recruiter visibility and AI recommendation accuracy.
              </div>
            </div>
          </div>
          <Link to="/student/profile" className="btn btn-sm" style={{ background: '#d97706', color: '#ffffff' }}>
            Complete Profile
          </Link>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
            <FileText size={24} />
          </div>
          <div>
            <div className="stat-val">{applications.length}</div>
            <div className="stat-label">Applications Submitted</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7', color: '#b45309' }}>
            <Clock size={24} />
          </div>
          <div>
            <div className="stat-val">{interviewsCount}</div>
            <div className="stat-label">Interviews Scheduled</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#ecfdf5', color: '#047857' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="stat-val">{selectedCount}</div>
            <div className="stat-label">Job Offers Extended</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f3e8ff', color: '#7e22ce' }}>
            <Sparkles size={24} />
          </div>
          <div>
            <div className="stat-val">{recommendationsCount}</div>
            <div className="stat-label">Eligible AI Matches</div>
          </div>
        </div>
      </div>

      {/* Recent Applications Section */}
      <div className="card" style={{ marginBottom: '2rem' }}>
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
            Recent Application Updates
          </h2>
          <Link to="/student/applications" style={{ color: 'var(--primary-600)', fontSize: '0.85rem', fontWeight: 600 }}>
            View All ({applications.length}) &rarr;
          </Link>
        </div>

        {applications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
            <p>You haven&apos;t submitted any job applications yet.</p>
            <Link to="/jobs" className="btn btn-primary btn-sm" style={{ marginTop: '0.75rem' }}>
              Browse Campus Openings
            </Link>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>AI Match</th>
                  <th>Applied On</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.slice(0, 5).map((app) => (
                  <tr key={app._id}>
                    <td style={{ fontWeight: 600 }}>{app.job?.title}</td>
                    <td>{app.job?.company?.name}</td>
                    <td style={{ textTransform: 'capitalize' }}>{app.job?.jobType?.replace('_', ' ')}</td>
                    <td>
                      <span
                        className={`badge ${
                          app.status === 'selected'
                            ? 'badge-success'
                            : app.status === 'rejected' || app.status === 'withdrawn'
                            ? 'badge-danger'
                            : app.status === 'interview_scheduled'
                            ? 'badge-warning'
                            : 'badge-info'
                        }`}
                      >
                        {app.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      {app.aiMatchScore ? (
                        <span style={{ fontWeight: 700, color: app.aiMatchScore >= 75 ? '#059669' : '#2563eb' }}>
                          {app.aiMatchScore}%
                        </span>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                    <td>
                      <Link to="/student/applications" className="btn btn-secondary btn-sm">
                        View History
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
