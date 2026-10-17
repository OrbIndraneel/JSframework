import React, { useEffect, useState } from 'react';
import {
  FileText,
  Upload,
  Sparkles,
  CheckCircle,
  Plus,
  Trash2,
  ExternalLink,
  Save,
  AlertCircle,
} from 'lucide-react';
import { apiClient } from '../../services/api.js';
import { StudentProfile } from '../../types/index.js';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.js';

export const StudentProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Resume Upload & AI Parser state
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [parseResult, setParseResult] = useState<any | null>(null);

  // Tag inputs
  const [newSkill, setNewSkill] = useState('');
  const [newCert, setNewCert] = useState('');

  // Project input modal state
  const [projTitle, setProjTitle] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projTech, setProjTech] = useState('');

  useEffect(() => {
    apiClient
      .get('/students/profile')
      .then((res) => setProfile(res.data.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      const res = await apiClient.put('/students/profile', profile);
      setProfile(res.data.data);
      setSaveSuccess('Profile successfully updated.');
      setTimeout(() => setSaveSuccess(null), 3000);
    } catch (err: any) {
      setSaveError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) return;
    setUploadingResume(true);
    setParseResult(null);

    const formData = new FormData();
    formData.append('resume', resumeFile);

    try {
      const res = await apiClient.post('/students/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProfile(res.data.data.profile);
      setParseResult(res.data.data.extractedData);
      setSaveSuccess('Resume uploaded and parsed via Python AI microservice!');
    } catch (err: any) {
      setSaveError(err.response?.data?.message || 'Failed to upload and parse resume.');
    } finally {
      setUploadingResume(false);
      setResumeFile(null);
    }
  };

  const handleAddSkill = () => {
    if (!newSkill.trim() || !profile) return;
    if (!profile.skills.includes(newSkill.trim())) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill.trim()],
      });
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    if (!profile) return;
    setProfile({
      ...profile,
      skills: profile.skills.filter((s) => s !== skillToRemove),
    });
  };

  const handleAddProject = () => {
    if (!projTitle.trim() || !profile) return;
    const techArray = projTech
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    setProfile({
      ...profile,
      projects: [
        ...profile.projects,
        {
          title: projTitle.trim(),
          description: projDesc.trim(),
          technologies: techArray,
        },
      ],
    });
    setProjTitle('');
    setProjDesc('');
    setProjTech('');
  };

  const handleRemoveProject = (index: number) => {
    if (!profile) return;
    setProfile({
      ...profile,
      projects: profile.projects.filter((_, i) => i !== index),
    });
  };

  if (loading || !profile) return <LoadingSpinner message="Loading student profile..." />;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '0.25rem' }}>
          Student Academic Profile & Resume
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Keep your academic record, technical competencies, and verified resume updated for placement eligibility.
        </p>
      </div>

      {saveSuccess && (
        <div style={{ padding: '0.85rem', background: 'var(--success-bg)', color: 'var(--success-text)', borderRadius: '6px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
          <CheckCircle size={18} /> {saveSuccess}
        </div>
      )}

      {saveError && (
        <div style={{ padding: '0.85rem', background: 'var(--danger-bg)', color: 'var(--danger-text)', borderRadius: '6px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
          <AlertCircle size={18} /> {saveError}
        </div>
      )}

      {/* Completeness Indicator */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--navy-900)' }}>
            Profile Completeness Index
          </span>
          <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--primary-600)' }}>
            {profile.completeness}%
          </span>
        </div>
        <div style={{ height: '8px', background: 'var(--surface-muted)', borderRadius: '4px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${profile.completeness}%`,
              background: 'linear-gradient(90deg, #3b82f6, #2563eb)',
              borderRadius: '4px',
              transition: 'width 0.4s ease',
            }}
          />
        </div>
      </div>

      {/* Resume Upload & AI Parser Module */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={20} color="var(--primary-600)" /> Official Resume Document & AI Parser
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Upload your resume in PDF or DOCX format. The Python FastAPI microservice will parse and extract your skills and projects automatically.
        </p>

        {profile.resumeUrl ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem',
              background: 'var(--primary-50)',
              border: '1px solid var(--primary-100)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <FileText size={24} color="var(--primary-600)" />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary-900)' }}>
                  {profile.resumeOriginalName || 'Uploaded_Resume.pdf'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--primary-700)' }}>
                  Last uploaded: {profile.resumeUploadedAt ? new Date(profile.resumeUploadedAt).toLocaleString() : 'Recently'}
                </div>
              </div>
            </div>
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-primary btn-sm"
            >
              <ExternalLink size={14} /> View File
            </a>
          </div>
        ) : (
          <div style={{ padding: '1rem', background: 'var(--surface-muted)', borderRadius: '6px', marginBottom: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            No resume uploaded yet. Recruiters require a resume document for application review.
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="file"
            accept=".pdf,.docx"
            id="resume-file-input"
            onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
            style={{ fontSize: '0.85rem' }}
          />
          <button
            type="button"
            onClick={handleResumeUpload}
            disabled={!resumeFile || uploadingResume}
            className="btn btn-primary btn-sm"
          >
            <Upload size={15} /> {uploadingResume ? 'Analyzing with Python AI...' : 'Upload & Parse Resume'}
          </button>
        </div>

        {/* AI Extracted preview */}
        {parseResult && (
          <div
            style={{
              marginTop: '1.5rem',
              padding: '1.25rem',
              background: '#f8fafc',
              border: '1px solid var(--surface-border)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
              <Sparkles size={16} color="var(--primary-600)" /> AI Parser Output
            </div>
            {parseResult.candidate_name && (
              <div style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <strong>Extracted Name:</strong> {parseResult.candidate_name}
              </div>
            )}
            {parseResult.email && (
              <div style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                <strong>Extracted Email:</strong> {parseResult.email}
              </div>
            )}
            <div style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              <strong>Extracted Skills ({parseResult.skills?.length || 0}):</strong>{' '}
              {parseResult.skills?.join(', ') || 'None found'}
            </div>
          </div>
        )}
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSaveProfile}>
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '1.25rem' }}>
            Academic Credentials
          </h2>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Enrollment / Roll Number</label>
              <input
                type="text"
                required
                className="form-control"
                value={profile.rollNumber}
                onChange={(e) => setProfile({ ...profile, rollNumber: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Department / Branch</label>
              <select
                className="form-control"
                value={profile.department}
                onChange={(e) => setProfile({ ...profile, department: e.target.value })}
              >
                <option value="Computer Science and Engineering">Computer Science (CSE)</option>
                <option value="Information Technology">Information Technology (IT)</option>
                <option value="Electronics and Communication">Electronics & Comm. (ECE)</option>
                <option value="Artificial Intelligence and Data Science">AI & Data Science</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Degree Program</label>
              <input
                type="text"
                className="form-control"
                value={profile.degree}
                onChange={(e) => setProfile({ ...profile, degree: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Graduation Year</label>
              <input
                type="number"
                className="form-control"
                value={profile.graduationYear}
                onChange={(e) => setProfile({ ...profile, graduationYear: Number(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Cumulative GPA (CGPA out of 10.0)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                className="form-control"
                value={profile.cgpa}
                onChange={(e) => setProfile({ ...profile, cgpa: Number(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Phone</label>
              <input
                type="text"
                className="form-control"
                placeholder="+91 98765 43210"
                value={profile.phone || ''}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Professional Summary / Bio</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Brief summary of your academic interests and career goals..."
              value={profile.bio || ''}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            />
          </div>
        </div>

        {/* Skills Section */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
            Technical & Domain Skills
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            These skills are indexed by the AI matching engine to calculate recommendation scores for campus jobs.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            {profile.skills.map((skill) => (
              <span
                key={skill}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.3rem 0.65rem',
                  background: 'var(--primary-50)',
                  color: 'var(--primary-700)',
                  border: '1px solid var(--primary-100)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                }}
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-700)', padding: 0 }}
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
              placeholder="e.g. Docker, Python, React"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
            />
            <button type="button" onClick={handleAddSkill} className="btn btn-secondary btn-sm">
              <Plus size={16} /> Add Skill
            </button>
          </div>
        </div>

        {/* Projects Section */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '1rem' }}>
            Academic & Capstone Projects
          </h2>

          {profile.projects.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              {profile.projects.map((proj, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '1rem',
                    background: 'var(--surface-muted)',
                    borderRadius: '6px',
                    position: 'relative',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleRemoveProject(idx)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '12px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#ef4444',
                    }}
                    title="Remove Project"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--navy-900)' }}>
                    {proj.title}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.35rem 0' }}>
                    {proj.description}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.5rem' }}>
                    {proj.technologies?.map((tech) => (
                      <span
                        key={tech}
                        style={{
                          background: '#ffffff',
                          border: '1px solid var(--surface-border)',
                          fontSize: '0.75rem',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '4px',
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '6px', border: '1px solid var(--surface-border)' }}>
            <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.75rem' }}>Add New Project</div>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Project Title"
                value={projTitle}
                onChange={(e) => setProjTitle(e.target.value)}
              />
            </div>
            <div className="form-group">
              <textarea
                className="form-control"
                rows={2}
                placeholder="Brief description of the problem solved and architecture..."
                value={projDesc}
                onChange={(e) => setProjDesc(e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Technologies used (comma separated, e.g. React, Node.js, Docker)"
                value={projTech}
                onChange={(e) => setProjTech(e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={handleAddProject}
              className="btn btn-secondary btn-sm"
              disabled={!projTitle.trim()}
            >
              <Plus size={16} /> Add to Project Roster
            </button>
          </div>
        </div>

        {/* Action button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '3rem' }}>
          <button type="submit" disabled={saving} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
            <Save size={18} /> {saving ? 'Saving Changes...' : 'Save Profile Details'}
          </button>
        </div>
      </form>
    </div>
  );
};
