import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users, Edit2, XCircle, CheckCircle, Briefcase, IndianRupee } from 'lucide-react';
import { apiClient } from '../../services/api.js';
import { Job } from '../../types/index.js';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.js';
import { Modal } from '../../components/common/Modal.js';

export const RecruiterJobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Job Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [jobType, setJobType] = useState<'full_time' | 'internship'>('full_time');
  const [workplaceType, setWorkplaceType] = useState<'on_site' | 'remote' | 'hybrid'>('on_site');
  const [location, setLocation] = useState('Bengaluru, India');
  const [salaryMin, setSalaryMin] = useState<number>(600000);
  const [salaryMax, setSalaryMax] = useState<number>(1000000);
  const [stipend, setStipend] = useState<number>(35000);
  const [requiredSkills, setRequiredSkills] = useState('Python, SQL, React');
  const [preferredSkills, setPreferredSkills] = useState('Docker, AWS');
  const [eligibleDepartments, setEligibleDepartments] = useState('CSE, IT, ECE');
  const [minCgpa, setMinCgpa] = useState<number>(7.0);
  const [positions, setPositions] = useState<number>(5);
  const [deadline, setDeadline] = useState('2025-06-30');
  const [status, setStatus] = useState<'draft' | 'active' | 'closed'>('active');

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/recruiters/jobs');
      setJobs(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const openCreateModal = () => {
    setEditingJob(null);
    setTitle('');
    setDescription('');
    setJobType('full_time');
    setWorkplaceType('on_site');
    setLocation('Bengaluru, India');
    setSalaryMin(600000);
    setSalaryMax(1000000);
    setStipend(35000);
    setRequiredSkills('Python, SQL, React');
    setPreferredSkills('Docker, AWS');
    setEligibleDepartments('CSE, IT, ECE');
    setMinCgpa(7.0);
    setPositions(5);
    setDeadline('2025-06-30');
    setStatus('active');
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (job: Job) => {
    setEditingJob(job);
    setTitle(job.title);
    setDescription(job.description);
    setJobType(job.jobType);
    setWorkplaceType(job.workplaceType);
    setLocation(job.location);
    setSalaryMin(job.salaryMin || 600000);
    setSalaryMax(job.salaryMax || 1000000);
    setStipend(job.stipend || 35000);
    setRequiredSkills(job.requiredSkills.join(', '));
    setPreferredSkills(job.preferredSkills?.join(', ') || '');
    setEligibleDepartments(job.eligibleDepartments?.join(', ') || '');
    setMinCgpa(job.minCgpa || 0);
    setPositions(job.positions || 1);
    setDeadline(job.deadline.split('T')[0]);
    setStatus(job.status);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);

    const payload = {
      title,
      description,
      jobType,
      workplaceType,
      location,
      salaryMin: jobType === 'full_time' ? Number(salaryMin) : undefined,
      salaryMax: jobType === 'full_time' ? Number(salaryMax) : undefined,
      stipend: jobType === 'internship' ? Number(stipend) : undefined,
      requiredSkills: requiredSkills.split(',').map((s) => s.trim()).filter(Boolean),
      preferredSkills: preferredSkills.split(',').map((s) => s.trim()).filter(Boolean),
      eligibleDepartments: eligibleDepartments.split(',').map((s) => s.trim()).filter(Boolean),
      minCgpa: Number(minCgpa),
      positions: Number(positions),
      deadline,
      status,
    };

    try {
      if (editingJob) {
        await apiClient.put(`/recruiters/jobs/${editingJob._id}`, payload);
      } else {
        await apiClient.post('/recruiters/jobs', payload);
      }
      setIsModalOpen(false);
      fetchJobs();
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to save job posting.');
    } finally {
      setSaving(false);
    }
  };

  const handleCloseJob = async (jobId: string) => {
    if (!window.confirm('Are you sure you want to close this job posting to further applicants?')) {
      return;
    }
    try {
      await apiClient.delete(`/recruiters/jobs/${jobId}`);
      fetchJobs();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to close job.');
    }
  };

  if (loading) return <LoadingSpinner message="Loading job management workspace..." />;

  return (
    <div>
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
            Company Job Postings
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Publish new job opportunities, define candidate eligibility, and track applicants.
          </p>
        </div>

        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus size={18} /> Post New Campus Opening
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Type</th>
                <th>Location</th>
                <th>Min CGPA</th>
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
                  <td>{job.minCgpa > 0 ? `${job.minCgpa}` : 'None'}</td>
                  <td>{new Date(job.deadline).toLocaleDateString()}</td>
                  <td>
                    <span className="badge badge-info" style={{ fontWeight: 700 }}>
                      {job.applicantCount || 0} Applicants
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${job.status === 'active' ? 'badge-success' : 'badge-neutral'}`}>
                      {job.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <Link
                        to={`/recruiter/jobs/${job._id}/applicants`}
                        className="btn btn-primary btn-sm"
                        title="Review Applicants"
                      >
                        <Users size={14} /> Applicants ({job.applicantCount || 0})
                      </Link>
                      <button
                        onClick={() => openEditModal(job)}
                        className="btn btn-secondary btn-sm"
                        title="Edit Details"
                      >
                        <Edit2 size={14} />
                      </button>
                      {job.status === 'active' && (
                        <button
                          onClick={() => handleCloseJob(job._id)}
                          className="btn btn-secondary btn-sm"
                          style={{ color: '#ef4444' }}
                          title="Close Posting"
                        >
                          <XCircle size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Post / Edit Job Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingJob ? 'Edit Campus Job Posting' : 'Post New Campus Recruitment Opening'}
        maxWidth="680px"
      >
        <form onSubmit={handleSaveJob}>
          {formError && (
            <div style={{ padding: '0.75rem', background: 'var(--danger-bg)', color: 'var(--danger-text)', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>
              {formError}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Job Title</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="e.g. Associate Software Engineer / Data Analyst"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Employment Type</label>
              <select
                className="form-control"
                value={jobType}
                onChange={(e) => setJobType(e.target.value as any)}
              >
                <option value="full_time">Full-time Placement</option>
                <option value="internship">Internship</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Workplace Model</label>
              <select
                className="form-control"
                value={workplaceType}
                onChange={(e) => setWorkplaceType(e.target.value as any)}
              >
                <option value="on_site">On-Site Campus / Office</option>
                <option value="hybrid">Hybrid</option>
                <option value="remote">Remote</option>
              </select>
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. Bengaluru, Hyderabad, Pune"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            {jobType === 'full_time' ? (
              <div className="form-group">
                <label className="form-label">Salary Range (CTC in INR)</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Min (e.g. 700000)"
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(Number(e.target.value))}
                  />
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Max (e.g. 1100000)"
                    value={salaryMax}
                    onChange={(e) => setSalaryMax(Number(e.target.value))}
                  />
                </div>
              </div>
            ) : (
              <div className="form-group">
                <label className="form-label">Monthly Stipend (INR)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="e.g. 45000"
                  value={stipend}
                  onChange={(e) => setStipend(Number(e.target.value))}
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Required Skills (Comma separated)</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="e.g. Python, SQL, React, Data Structures"
              value={requiredSkills}
              onChange={(e) => setRequiredSkills(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Preferred / Good-to-have Skills</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Docker, AWS, Kubernetes"
              value={preferredSkills}
              onChange={(e) => setPreferredSkills(e.target.value)}
            />
          </div>

          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">Eligible Branches</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. CSE, IT, ECE"
                value={eligibleDepartments}
                onChange={(e) => setEligibleDepartments(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Min CGPA Threshold</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                className="form-control"
                value={minCgpa}
                onChange={(e) => setMinCgpa(Number(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Open Positions</label>
              <input
                type="number"
                min="1"
                className="form-control"
                value={positions}
                onChange={(e) => setPositions(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Application Deadline</label>
              <input
                type="date"
                required
                className="form-control"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Posting Status</label>
              <select
                className="form-control"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
              >
                <option value="active">Active (Visible to Students)</option>
                <option value="draft">Draft (Private)</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Job Description & Requirements</label>
            <textarea
              required
              rows={5}
              className="form-control"
              placeholder="Outline project responsibilities, team structure, assessment process, and growth opportunities..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsModalOpen(false)}
              disabled={saving}
            >
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? 'Saving...' : editingJob ? 'Update Posting' : 'Publish Campus Opening'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
