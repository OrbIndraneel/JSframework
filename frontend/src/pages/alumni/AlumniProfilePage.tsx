import React, { useEffect, useState } from 'react';
import { UserCheck, Save, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import { apiClient } from '../../services/api.js';
import { AlumniProfile } from '../../types/index.js';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.js';

export const AlumniProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<AlumniProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newExpertise, setNewExpertise] = useState('');

  useEffect(() => {
    apiClient
      .get('/alumni/profile')
      .then((res) => setProfile(res.data.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await apiClient.put('/alumni/profile', profile);
      setProfile(res.data.data);
      setSuccess('Alumni career profile updated successfully.');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update alumni profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddExpertise = () => {
    if (!newExpertise.trim() || !profile) return;
    if (!profile.expertise.includes(newExpertise.trim())) {
      setProfile({
        ...profile,
        expertise: [...profile.expertise, newExpertise.trim()],
      });
    }
    setNewExpertise('');
  };

  const handleRemoveExpertise = (tag: string) => {
    if (!profile) return;
    setProfile({
      ...profile,
      expertise: profile.expertise.filter((e) => e !== tag),
    });
  };

  if (loading) return <LoadingSpinner message="Loading your alumni profile..." />;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '0.25rem' }}>
          Alumni Professional Profile & Mentorship Settings
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Update your employment details, core domains of expertise, and toggle mentorship availability for students.
        </p>
      </div>

      {success && (
        <div style={{ padding: '0.85rem', background: 'var(--success-bg)', color: 'var(--success-text)', borderRadius: '6px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
          <CheckCircle size={18} /> {success}
        </div>
      )}

      {error && (
        <div style={{ padding: '0.85rem', background: 'var(--danger-bg)', color: 'var(--danger-text)', borderRadius: '6px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
          <AlertCircle size={18} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card">
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Current Employer / Company</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="e.g. Google India"
              value={profile?.currentCompany || ''}
              onChange={(e) => setProfile({ ...profile!, currentCompany: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Current Designation / Role</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="e.g. Senior Software Engineer"
              value={profile?.designation || ''}
              onChange={(e) => setProfile({ ...profile!, designation: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Graduation Batch Year</label>
            <input
              type="number"
              required
              className="form-control"
              value={profile?.graduationYear || 2021}
              onChange={(e) => setProfile({ ...profile!, graduationYear: Number(e.target.value) })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Graduating Department</label>
            <input
              type="text"
              required
              className="form-control"
              value={profile?.department || ''}
              onChange={(e) => setProfile({ ...profile!, department: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">LinkedIn Profile URL</label>
          <input
            type="url"
            className="form-control"
            placeholder="https://linkedin.com/in/your-profile"
            value={profile?.linkedIn || ''}
            onChange={(e) => setProfile({ ...profile!, linkedIn: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Professional Biography & Mentorship Approach</label>
          <textarea
            rows={4}
            className="form-control"
            placeholder="Share your career journey, tech stack, and areas where you can best support graduating students..."
            value={profile?.bio || ''}
            onChange={(e) => setProfile({ ...profile!, bio: e.target.value })}
          />
        </div>

        {/* Mentorship toggle */}
        <div
          style={{
            padding: '1rem',
            background: 'var(--surface-muted)',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
              Accept Mentorship Requests from Students
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              When enabled, your profile is highlighted in the Alumni Directory with a &ldquo;Request Mentorship&rdquo; button.
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '0.5rem' }}>
            <input
              type="checkbox"
              style={{ width: '18px', height: '18px' }}
              checked={profile?.isAvailableForMentorship ?? true}
              onChange={(e) => setProfile({ ...profile!, isAvailableForMentorship: e.target.checked })}
            />
            <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>
              {profile?.isAvailableForMentorship ? 'Open' : 'Paused'}
            </span>
          </label>
        </div>

        {/* Expertise tags */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label className="form-label">Mentorship Topics & Skill Expertise</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
            {profile?.expertise.map((tag) => (
              <span
                key={tag}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.3rem 0.65rem',
                  background: 'var(--primary-50)',
                  color: 'var(--primary-700)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                }}
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveExpertise(tag)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-700)' }}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', maxWidth: '400px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. System Design, Google Interview Prep"
              value={newExpertise}
              onChange={(e) => setNewExpertise(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddExpertise();
                }
              }}
            />
            <button type="button" onClick={handleAddExpertise} className="btn btn-secondary btn-sm">
              <Plus size={16} /> Add
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button type="submit" disabled={saving} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
            <Save size={18} /> {saving ? 'Saving...' : 'Save Profile Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};
