import React, { useEffect, useState } from 'react';
import { Calendar, Plus, Building2, CheckCircle, Clock } from 'lucide-react';
import { apiClient } from '../../services/api.js';
import { PlacementDrive } from '../../types/index.js';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.js';
import { Modal } from '../../components/common/Modal.js';

export const PlacementDrivesPage: React.FC = () => {
  const [drives, setDrives] = useState<PlacementDrive[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [eligibleDepartments, setEligibleDepartments] = useState('CSE, IT, ECE');
  const [minCgpa, setMinCgpa] = useState<number>(6.5);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchDrives = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/placement/drives');
      setDrives(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrives();
  }, []);

  const handleCreateDrive = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);

    const payload = {
      name,
      academicYear,
      description,
      startDate,
      endDate,
      eligibleDepartments: eligibleDepartments.split(',').map((d) => d.trim()).filter(Boolean),
      minCgpa: Number(minCgpa),
    };

    try {
      await apiClient.post('/placement/drives', payload);
      setIsModalOpen(false);
      setName('');
      setDescription('');
      fetchDrives();
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to create placement drive.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading recruitment drives..." />;

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
            Campus Recruitment Drives
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Schedule and coordinate multi-employer recruitment drives for graduating batches.
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <Plus size={18} /> Schedule New Placement Drive
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {drives.map((drive) => (
          <div key={drive._id} className="card" style={{ padding: '1.5rem' }}>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--navy-900)' }}>
                    {drive.name}
                  </h3>
                  <span
                    className={`badge ${
                      drive.status === 'ongoing'
                        ? 'badge-success'
                        : drive.status === 'completed'
                        ? 'badge-neutral'
                        : 'badge-info'
                    }`}
                  >
                    {drive.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Academic Batch: <strong>{drive.academicYear}</strong> • Min CGPA: {drive.minCgpa || 'None'}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <Calendar size={16} color="var(--primary-600)" />
                <span>
                  {new Date(drive.startDate).toLocaleDateString()} — {new Date(drive.endDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            {drive.description && (
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                {drive.description}
              </p>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {drive.eligibleDepartments.map((dept) => (
                <span key={dept} className="badge badge-neutral">
                  {dept}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Create Drive Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule New Campus Placement Drive"
      >
        <form onSubmit={handleCreateDrive}>
          {formError && (
            <div style={{ padding: '0.75rem', background: 'var(--danger-bg)', color: 'var(--danger-text)', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>
              {formError}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Drive Title</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="e.g. Annual Campus Recruitment Drive 2024-2025"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Academic Year</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="2024-2025"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Min CGPA Cutoff</label>
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
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                required
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">End Date</label>
              <input
                type="date"
                required
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Eligible Departments (Comma separated)</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="CSE, IT, ECE, AI & DS"
              value={eligibleDepartments}
              onChange={(e) => setEligibleDepartments(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Drive Description & Scope</label>
            <textarea
              rows={3}
              className="form-control"
              placeholder="Guidelines for students and visiting recruitment teams..."
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
              {saving ? 'Creating...' : 'Create Recruitment Drive'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
