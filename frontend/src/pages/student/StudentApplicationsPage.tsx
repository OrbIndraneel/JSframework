import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Calendar,
  Clock,
  Video,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { apiClient } from '../../services/api.js';
import { Application } from '../../types/index.js';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.js';
import { EmptyState } from '../../components/common/EmptyState.js';

export const StudentApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/students/applications');
      setApplications(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleWithdraw = async (applicationId: string) => {
    if (!window.confirm('Are you sure you want to withdraw this application? This action cannot be reversed.')) {
      return;
    }

    setWithdrawingId(applicationId);
    try {
      await apiClient.post(`/students/applications/${applicationId}/withdraw`);
      fetchApplications();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to withdraw application.');
    } finally {
      setWithdrawingId(null);
    }
  };

  if (loading) return <LoadingSpinner message="Loading your submitted applications..." />;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '0.25rem' }}>
          My Campus Applications & Interview Schedule
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Track recruitment progression, review status histories, and access upcoming corporate interviews.
        </p>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          title="No Submitted Applications"
          description="You haven't submitted any campus recruitment applications yet."
          actionText="Browse Openings"
          onAction={() => (window.location.href = '/jobs')}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {applications.map((app) => {
            const isExpanded = expandedId === app._id;
            const canWithdraw = ['applied', 'under_review'].includes(app.status);

            return (
              <div key={app._id} className="card" style={{ padding: '1.5rem' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--navy-900)' }}>
                        {app.job?.title}
                      </h3>
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
                    </div>

                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                      {app.job?.company?.name} • {app.job?.location}
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                      Submitted on: {new Date(app.appliedAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {canWithdraw && (
                      <button
                        onClick={() => handleWithdraw(app._id)}
                        disabled={withdrawingId === app._id}
                        className="btn btn-secondary btn-sm"
                        style={{ color: '#ef4444' }}
                      >
                        {withdrawingId === app._id ? 'Withdrawing...' : 'Withdraw'}
                      </button>
                    )}

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : app._id)}
                      className="btn btn-secondary btn-sm"
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      {isExpanded ? 'Hide History' : 'View Status History'}
                    </button>
                  </div>
                </div>

                {/* Scheduled Interview Callout Banner */}
                {app.interview && (
                  <div
                    style={{
                      marginTop: '1.25rem',
                      padding: '1rem',
                      background: 'var(--warning-bg)',
                      border: '1px solid var(--warning-border)',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--warning-text)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Clock size={16} /> Upcoming Interview: {app.interview.round}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--warning-text)', marginTop: '2px' }}>
                        Scheduled for: {new Date(app.interview.scheduledAt).toLocaleString()} ({app.interview.durationMinutes} mins)
                      </div>
                    </div>

                    {app.interview.meetingLink && (
                      <a
                        href={app.interview.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm"
                        style={{ background: '#d97706', color: '#ffffff' }}
                      >
                        <Video size={14} /> Join Interview Link
                      </a>
                    )}
                  </div>
                )}

                {/* Status History Timeline (Expandable) */}
                {isExpanded && (
                  <div
                    style={{
                      marginTop: '1.25rem',
                      paddingTop: '1.25rem',
                      borderTop: '1px solid var(--surface-border)',
                    }}
                  >
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.75rem' }}>
                      Application Lifecycle Audit
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {app.statusHistory?.map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            gap: '0.75rem',
                            fontSize: '0.825rem',
                            borderLeft: '2px solid var(--primary-600)',
                            paddingLeft: '0.75rem',
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--navy-900)', textTransform: 'capitalize' }}>
                              {item.status.replace('_', ' ')}
                            </div>
                            <div style={{ color: 'var(--text-secondary)' }}>
                              {item.note || 'Status recorded.'}
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '2px' }}>
                              {new Date(item.changedAt).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
