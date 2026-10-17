import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Send, Calendar, CheckCircle2, Building, ArrowRight } from 'lucide-react';
import { apiClient } from '../../services/api.js';
import { AlumniProfile, MentorshipRequest } from '../../types/index.js';
import { useAppSelector } from '../../store/index.js';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.js';

export const AlumniDashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [profile, setProfile] = useState<AlumniProfile | null>(null);
  const [requests, setRequests] = useState<MentorshipRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiClient.get('/alumni/profile'),
      apiClient.get('/alumni/mentorship-requests'),
    ])
      .then(([profRes, reqRes]) => {
        setProfile(profRes.data.data);
        setRequests(reqRes.data.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner message="Loading alumni portal workspace..." />;

  const pendingCount = requests.filter((r) => r.status === 'pending').length;
  const acceptedCount = requests.filter((r) => r.status === 'accepted').length;

  return (
    <div>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
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
            ALUMNI RELATIONS & MENTORSHIP HUB
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.25rem' }}>
            Welcome, {user?.name}!
          </h1>
          <p style={{ opacity: 0.9, fontSize: '0.95rem', marginTop: '0.35rem' }}>
            {profile?.designation} at {profile?.currentCompany} • Batch of {profile?.graduationYear} ({profile?.department})
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/alumni/mentorship" className="btn btn-secondary btn-sm" style={{ fontWeight: 600 }}>
            <Send size={16} /> Mentorship Requests ({pendingCount} Pending)
          </Link>
          <Link to="/events" className="btn btn-primary btn-sm" style={{ background: '#ffffff', color: '#1e3a8a', fontWeight: 600 }}>
            <Calendar size={16} /> View & Host Events
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid-3" style={{ marginBottom: '2.5rem' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7', color: '#b45309' }}>
            <Send size={24} />
          </div>
          <div>
            <div className="stat-val">{pendingCount}</div>
            <div className="stat-label">Pending Student Requests</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#ecfdf5', color: '#047857' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="stat-val">{acceptedCount}</div>
            <div className="stat-label">Active Mentorship Connections</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
            <Users size={24} />
          </div>
          <div>
            <div className="stat-val">{requests.length}</div>
            <div className="stat-label">Total Guidance Inquiries</div>
          </div>
        </div>
      </div>

      {/* Recent Mentorship Inquiries Table */}
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
            Recent Student Mentorship Inquiries
          </h2>
          <Link to="/alumni/mentorship" style={{ color: 'var(--primary-600)', fontSize: '0.85rem', fontWeight: 600 }}>
            Manage All Requests &rarr;
          </Link>
        </div>

        {requests.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 1rem' }}>
            No student mentorship requests received yet.
          </p>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student Candidate</th>
                  <th>Topic</th>
                  <th>Status</th>
                  <th>Requested Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.slice(0, 5).map((req) => (
                  <tr key={req._id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{req.student?.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{req.student?.email}</div>
                    </td>
                    <td>{req.topic}</td>
                    <td>
                      <span
                        className={`badge ${
                          req.status === 'accepted'
                            ? 'badge-success'
                            : req.status === 'declined'
                            ? 'badge-danger'
                            : 'badge-warning'
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Link to="/alumni/mentorship" className="btn btn-outline-primary btn-sm">
                        Respond & Schedule
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
