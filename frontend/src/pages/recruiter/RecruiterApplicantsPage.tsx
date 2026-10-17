import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Download,
  Users,
  Calendar,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  FileText,
  Building2,
} from 'lucide-react';
import { apiClient } from '../../services/api.js';
import { Application, Job } from '../../types/index.js';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.js';
import { EmptyState } from '../../components/common/EmptyState.js';
import { Modal } from '../../components/common/Modal.js';

export const RecruiterApplicantsPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [applicants, setApplicants] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // Status Update state
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [statusVal, setStatusVal] = useState<string>('shortlisted');
  const [statusNote, setStatusNote] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Interview Schedule state
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [interviewApp, setInterviewApp] = useState<Application | null>(null);
  const [interviewRound, setInterviewRound] = useState('Technical Round 1');
  const [interviewDate, setInterviewDate] = useState('');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/xyz-recruitment');
  const [interviewerNotes, setInterviewerNotes] = useState('');
  const [scheduling, setScheduling] = useState(false);

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/recruiters/jobs/${jobId}/applicants`);
      setJob(res.data.data.job);
      setApplicants(res.data.data.applicants);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;
    setUpdatingStatus(true);
    try {
      await apiClient.patch(`/recruiters/applicants/${selectedApp._id}/status`, {
        status: statusVal,
        note: statusNote,
      });
      setSelectedApp(null);
      setStatusNote('');
      fetchApplicants();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update candidate status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleScheduleInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewApp) return;
    setScheduling(true);
    try {
      await apiClient.post('/recruiters/interviews', {
        applicationId: interviewApp._id,
        round: interviewRound,
        scheduledAt: interviewDate,
        meetingLink,
        interviewerNotes,
      });
      setIsInterviewModalOpen(false);
      setInterviewApp(null);
      fetchApplicants();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to schedule interview.');
    } finally {
      setScheduling(false);
    }
  };

  const handleExportCsv = () => {
    window.open(`/api/recruiters/jobs/${jobId}/export`, '_blank');
  };

  if (loading) return <LoadingSpinner message="Retrieving applicant profiles and resume files..." />;

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/recruiter/jobs" style={{ color: 'var(--primary-600)', fontSize: '0.85rem', fontWeight: 500 }}>
          &larr; Back to Job Postings
        </Link>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '0.25rem' }}>
            Applicant Roster: {job?.title}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Review candidate resumes, evaluate AI match scores, record interview decisions, and export reports.
          </p>
        </div>

        <button onClick={handleExportCsv} className="btn btn-secondary">
          <Download size={16} /> Export Applicant List (.CSV)
        </button>
      </div>

      {applicants.length === 0 ? (
        <EmptyState
          title="No Applicants Yet"
          description="Candidates matching the eligibility criteria will appear here once they submit their applications."
        />
      ) : (
        <div className="card">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Roll No & Dept</th>
                  <th>CGPA</th>
                  <th>AI Match Score</th>
                  <th>Status</th>
                  <th>Resume</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((app) => {
                  const student = app.student;
                  const profile = app.studentProfile;

                  return (
                    <tr key={app._id}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--navy-900)' }}>{student?.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{student?.email}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{profile?.rollNumber || 'N/A'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{profile?.department || 'CSE'}</div>
                      </td>
                      <td>
                        <strong style={{ color: 'var(--navy-900)' }}>{profile?.cgpa || 'N/A'}</strong>
                      </td>
                      <td>
                        {app.aiMatchScore ? (
                          <div>
                            <span
                              style={{
                                fontWeight: 800,
                                color: app.aiMatchScore >= 75 ? '#059669' : '#2563eb',
                              }}
                            >
                              {app.aiMatchScore}%
                            </span>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                              {app.aiMatchedSkills?.length || 0} skills matched
                            </div>
                          </div>
                        ) : (
                          'N/A'
                        )}
                      </td>
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
                        {app.resumeUrl ? (
                          <a
                            href={app.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary btn-sm"
                            title="Open Resume"
                          >
                            <FileText size={14} /> Resume
                          </a>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>None</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            onClick={() => {
                              setSelectedApp(app);
                              setStatusVal(app.status);
                            }}
                            className="btn btn-secondary btn-sm"
                          >
                            Update Status
                          </button>
                          <button
                            onClick={() => {
                              setInterviewApp(app);
                              setIsInterviewModalOpen(true);
                            }}
                            className="btn btn-outline-primary btn-sm"
                          >
                            <Calendar size={14} /> Interview
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      <Modal
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        title={`Update Candidate Status: ${selectedApp?.student?.name}`}
      >
        <form onSubmit={handleStatusUpdate}>
          <div className="form-group">
            <label className="form-label">Recruitment Status</label>
            <select
              className="form-control"
              value={statusVal}
              onChange={(e) => setStatusVal(e.target.value)}
            >
              <option value="under_review">Under Review</option>
              <option value="shortlisted">Shortlisted for Assessment / Interview</option>
              <option value="interview_scheduled">Interview Scheduled</option>
              <option value="selected">Selected / Offer Extended</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Review Note / Feedback (Dispatched to Candidate)</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="e.g. Cleared technical screening. Invited to final HR round."
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setSelectedApp(null)}
              disabled={updatingStatus}
            >
              Cancel
            </button>
            <button type="submit" disabled={updatingStatus} className="btn btn-primary">
              {updatingStatus ? 'Saving...' : 'Update & Notify Student'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Schedule Interview Modal */}
      <Modal
        isOpen={isInterviewModalOpen}
        onClose={() => setIsInterviewModalOpen(false)}
        title={`Schedule Interview: ${interviewApp?.student?.name}`}
      >
        <form onSubmit={handleScheduleInterview}>
          <div className="form-group">
            <label className="form-label">Interview Round</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="e.g. Technical Round 1: Live Coding"
              value={interviewRound}
              onChange={(e) => setInterviewRound(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Date & Time</label>
            <input
              type="datetime-local"
              required
              className="form-control"
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Meeting URL / Campus Room Location</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="Google Meet, Microsoft Teams link or Campus Interview Room B"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Interviewer Notes</label>
            <textarea
              className="form-control"
              rows={2}
              placeholder="Internal evaluation criteria or preparation instructions for the candidate..."
              value={interviewerNotes}
              onChange={(e) => setInterviewerNotes(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsInterviewModalOpen(false)}
              disabled={scheduling}
            >
              Cancel
            </button>
            <button type="submit" disabled={scheduling} className="btn btn-primary">
              {scheduling ? 'Scheduling...' : 'Confirm Schedule & Notify'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
