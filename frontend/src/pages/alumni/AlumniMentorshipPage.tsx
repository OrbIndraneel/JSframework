import React, { useEffect, useState } from 'react';
import { Send, CheckCircle, XCircle, Clock, Video, Mail } from 'lucide-react';
import { apiClient } from '../../services/api.js';
import { MentorshipRequest } from '../../types/index.js';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.js';
import { EmptyState } from '../../components/common/EmptyState.js';
import { Modal } from '../../components/common/Modal.js';

export const AlumniMentorshipPage: React.FC = () => {
  const [requests, setRequests] = useState<MentorshipRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Response Modal state
  const [selectedRequest, setSelectedRequest] = useState<MentorshipRequest | null>(null);
  const [statusVal, setStatusVal] = useState<'accepted' | 'declined' | 'completed'>('accepted');
  const [responseNote, setResponseNote] = useState('');
  const [meetingDetails, setMeetingDetails] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/alumni/mentorship-requests');
      setRequests(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleOpenRespond = (req: MentorshipRequest, targetStatus: 'accepted' | 'declined' | 'completed') => {
    setSelectedRequest(req);
    setStatusVal(targetStatus);
    setResponseNote(req.responseNote || '');
    setMeetingDetails(req.meetingDetails || 'Google Meet: https://meet.google.com/xyz-alumni-mentor');
  };

  const handleSaveResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;
    setSaving(true);

    try {
      await apiClient.patch(`/alumni/mentorship-requests/${selectedRequest._id}/respond`, {
        status: statusVal,
        responseNote,
        meetingDetails: statusVal === 'accepted' ? meetingDetails : undefined,
      });

      setSelectedRequest(null);
      fetchRequests();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update mentorship request.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message="Retrieving student mentorship requests..." />;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '0.25rem' }}>
          Student Mentorship Inquiries & 1-on-1 Guidance
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Accept guidance requests from enrolled university juniors, arrange mock interviews, and share industry insights.
        </p>
      </div>

      {requests.length === 0 ? (
        <EmptyState
          title="No Mentorship Requests"
          description="When students browse your profile in the alumni directory and request career guidance, inquiries will appear here."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {requests.map((req) => (
            <div key={req._id} className="card" style={{ padding: '1.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  marginBottom: '1rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--navy-900)' }}>
                      {req.topic}
                    </h3>
                    <span
                      className={`badge ${
                        req.status === 'accepted'
                          ? 'badge-success'
                          : req.status === 'declined'
                          ? 'badge-danger'
                          : req.status === 'completed'
                          ? 'badge-neutral'
                          : 'badge-warning'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Student: <strong>{req.student?.name}</strong> ({req.student?.email})
                  </div>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Received: {new Date(req.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* Message from student */}
              <div
                style={{
                  background: 'var(--surface-muted)',
                  padding: '1rem',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  marginBottom: '1.25rem',
                }}
              >
                &ldquo;{req.message}&rdquo;
              </div>

              {/* Meeting Details if accepted */}
              {req.status === 'accepted' && req.meetingDetails && (
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    background: 'var(--primary-50)',
                    border: '1px solid var(--primary-100)',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    color: 'var(--primary-900)',
                    marginBottom: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <Video size={16} color="var(--primary-600)" />
                  <span>
                    <strong>Scheduled Session:</strong> {req.meetingDetails}
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                {req.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleOpenRespond(req, 'accepted')}
                      className="btn btn-primary btn-sm"
                    >
                      <CheckCircle size={14} /> Accept & Share Meeting Link
                    </button>
                    <button
                      onClick={() => handleOpenRespond(req, 'declined')}
                      className="btn btn-secondary btn-sm"
                      style={{ color: '#ef4444' }}
                    >
                      <XCircle size={14} /> Decline
                    </button>
                  </>
                )}

                {req.status === 'accepted' && (
                  <button
                    onClick={() => handleOpenRespond(req, 'completed')}
                    className="btn btn-secondary btn-sm"
                  >
                    Mark as Completed
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Response Modal */}
      <Modal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        title={`Respond to Mentorship Request: ${selectedRequest?.topic}`}
      >
        <form onSubmit={handleSaveResponse}>
          <div className="form-group">
            <label className="form-label">Response Decision</label>
            <select
              className="form-control"
              value={statusVal}
              onChange={(e) => setStatusVal(e.target.value as any)}
            >
              <option value="accepted">Accept Request & Provide Link</option>
              <option value="declined">Decline Request</option>
              <option value="completed">Mark Mentorship Session Completed</option>
            </select>
          </div>

          {statusVal === 'accepted' && (
            <div className="form-group">
              <label className="form-label">Meeting URL & Suggested Timing</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. Google Meet: https://meet.google.com/abc-def-ghi (Saturday 5 PM)"
                value={meetingDetails}
                onChange={(e) => setMeetingDetails(e.target.value)}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Personalized Note to Student</label>
            <textarea
              rows={3}
              className="form-control"
              placeholder="e.g. Looking forward to reviewing your resume! Please bring any questions on system design."
              value={responseNote}
              onChange={(e) => setResponseNote(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setSelectedRequest(null)}
              disabled={saving}
            >
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? 'Saving...' : 'Send Response'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
