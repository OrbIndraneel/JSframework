import React, { useEffect, useState } from 'react';
import { Search, Building, GraduationCap, Sparkles, Send, CheckCircle, Linkedin } from 'lucide-react';
import { apiClient } from '../../services/api.js';
import { AlumniProfile } from '../../types/index.js';
import { useAppSelector } from '../../store/index.js';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.js';
import { EmptyState } from '../../components/common/EmptyState.js';
import { Modal } from '../../components/common/Modal.js';

export const AlumniDirectoryPage: React.FC = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [alumni, setAlumni] = useState<AlumniProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('all');
  const [mentorshipOnly, setMentorshipOnly] = useState(false);

  // Mentorship Request Modal
  const [selectedAlumni, setSelectedAlumni] = useState<AlumniProfile | null>(null);
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);

  const fetchAlumni = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (search) params.search = search;
      if (department !== 'all') params.department = department;
      if (mentorshipOnly) params.mentorshipOnly = 'true';

      const res = await apiClient.get('/alumni/directory', { params });
      setAlumni(res.data.data.profiles);
    } catch (err) {
      console.error('Failed to load alumni directory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, [department, mentorshipOnly]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAlumni();
  };

  const handleSendMentorshipRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlumni) return;

    setRequestSubmitting(true);
    setRequestError(null);
    setRequestSuccess(null);

    try {
      await apiClient.post('/alumni/mentorship-requests', {
        alumniUserId: selectedAlumni.user._id || (selectedAlumni.user as any).id,
        topic,
        message,
      });

      setRequestSuccess('Mentorship request sent successfully! The mentor will be notified.');
      setTimeout(() => {
        setSelectedAlumni(null);
        setTopic('');
        setMessage('');
        setRequestSuccess(null);
      }, 2000);
    } catch (err: any) {
      setRequestError(err.response?.data?.message || 'Failed to submit mentorship request.');
    } finally {
      setRequestSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '0.4rem' }}>
          Alumni Career & Mentorship Network
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Connect with accomplished graduates across top product companies, venture funds, and graduate research institutions.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search by name, company, designation, expertise..."
              style={{ paddingLeft: '38px' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ minWidth: '180px' }}>
            <select
              className="form-control"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="all">All Departments</option>
              <option value="Computer Science and Engineering">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics and Communication">Electronics (ECE)</option>
            </select>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={mentorshipOnly}
              onChange={(e) => setMentorshipOnly(e.target.checked)}
            />
            Available for Mentorship Only
          </label>

          <button type="submit" className="btn btn-primary btn-sm">
            Search Alumni
          </button>
        </form>
      </div>

      {/* Directory Grid */}
      {loading ? (
        <LoadingSpinner message="Retrieving alumni directory..." />
      ) : alumni.length === 0 ? (
        <EmptyState
          title="No Alumni Found"
          description="Try modifying search keywords or clearing department filters."
          actionText="Reset Directory Filters"
          onAction={() => {
            setSearch('');
            setDepartment('all');
            setMentorshipOnly(false);
          }}
        />
      ) : (
        <div className="grid-3">
          {alumni.map((profile) => (
            <div key={profile._id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    background: 'var(--primary-100)',
                    color: 'var(--primary-700)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    overflow: 'hidden',
                  }}
                >
                  {profile.user?.avatarUrl ? (
                    <img src={profile.user.avatarUrl} alt={profile.user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    profile.user?.name?.charAt(0) || 'A'
                  )}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy-900)' }}>
                    {profile.user?.name}
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--primary-700)', fontWeight: 600 }}>
                    {profile.designation}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {profile.currentCompany}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <GraduationCap size={15} color="var(--text-muted)" />
                  <span>Batch of {profile.graduationYear} • {profile.department}</span>
                </div>
                {profile.isAvailableForMentorship ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#059669', fontWeight: 600 }}>
                    <CheckCircle size={15} /> Mentorship Open
                  </div>
                ) : (
                  <div style={{ color: 'var(--text-muted)' }}>Mentorship Currently Paused</div>
                )}
              </div>

              {profile.bio && (
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {profile.bio}
                </p>
              )}

              {/* Expertise tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
                {profile.expertise.slice(0, 4).map((exp) => (
                  <span
                    key={exp}
                    style={{
                      background: 'var(--surface-muted)',
                      color: 'var(--text-secondary)',
                      fontSize: '0.725rem',
                      fontWeight: 500,
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                    }}
                  >
                    {exp}
                  </span>
                ))}
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--surface-border)', display: 'flex', gap: '0.5rem' }}>
                {profile.isAvailableForMentorship && (
                  <button
                    onClick={() => {
                      if (!isAuthenticated) {
                        alert('Please sign in as a student to request mentorship.');
                        return;
                      }
                      if (user?.role !== 'student') {
                        alert('Mentorship requests are reserved for registered students.');
                        return;
                      }
                      setSelectedAlumni(profile);
                    }}
                    className="btn btn-outline-primary btn-sm"
                    style={{ flex: 1 }}
                  >
                    <Send size={14} /> Request Mentorship
                  </button>
                )}
                {profile.linkedIn && (
                  <a
                    href={profile.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm"
                    title="LinkedIn Profile"
                  >
                    <Linkedin size={15} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mentorship Request Modal */}
      <Modal
        isOpen={!!selectedAlumni}
        onClose={() => setSelectedAlumni(null)}
        title={`Request Career Guidance from ${selectedAlumni?.user?.name}`}
      >
        <form onSubmit={handleSendMentorshipRequest}>
          {requestSuccess && (
            <div style={{ padding: '0.75rem', borderRadius: '6px', background: 'var(--success-bg)', color: 'var(--success-text)', marginBottom: '1rem', fontSize: '0.875rem' }}>
              {requestSuccess}
            </div>
          )}

          {requestError && (
            <div style={{ padding: '0.75rem', borderRadius: '6px', background: 'var(--danger-bg)', color: 'var(--danger-text)', marginBottom: '1rem', fontSize: '0.875rem' }}>
              {requestError}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Mentorship Topic / Focus Area</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="e.g. System Design Mock Interview / FAANG Resume Review"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Message & Introduction</label>
            <textarea
              required
              rows={4}
              className="form-control"
              placeholder="Introduce yourself, your academic year, specific challenges you're facing, and what advice you're looking for..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setSelectedAlumni(null)}
              disabled={requestSubmitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={requestSubmitting}>
              {requestSubmitting ? 'Sending Request...' : 'Submit Mentorship Request'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
