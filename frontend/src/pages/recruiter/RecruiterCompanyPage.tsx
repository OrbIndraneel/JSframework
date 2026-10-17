import React, { useEffect, useState } from 'react';
import { Building2, Save, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react';
import { apiClient } from '../../services/api.js';
import { Company } from '../../types/index.js';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.js';

export const RecruiterCompanyPage: React.FC = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient
      .get('/recruiters/company')
      .then((res) => setCompany(res.data.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await apiClient.put('/recruiters/company', company);
      setCompany(res.data.data);
      setSuccess('Company profile updated successfully.');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update company details.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading corporate profile..." />;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '0.25rem' }}>
          Employer Corporate Profile
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Manage your organization details displayed across campus recruitment listings.
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

      <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--primary-100)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
              University Verification Status
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {company?.isVerified
                ? 'Your company is officially verified by the University Placement Office.'
                : 'Pending placement office verification review.'}
            </div>
          </div>
        </div>

        <span className={`badge ${company?.isVerified ? 'badge-success' : 'badge-warning'}`}>
          {company?.isVerified ? '✓ Verified Partner' : 'Verification Pending'}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="card">
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Company Name</label>
            <input
              type="text"
              required
              className="form-control"
              value={company?.name || ''}
              onChange={(e) => setCompany({ ...company!, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Industry Sector</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="e.g. Cloud Computing & AI Services"
              value={company?.industry || ''}
              onChange={(e) => setCompany({ ...company!, industry: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Official Website</label>
            <input
              type="url"
              className="form-control"
              placeholder="https://www.company.com"
              value={company?.website || ''}
              onChange={(e) => setCompany({ ...company!, website: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Headquarters / Campus Hiring Office</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="e.g. Hyderabad, India"
              value={company?.location || ''}
              onChange={(e) => setCompany({ ...company!, location: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Talent Team Contact Email</label>
            <input
              type="email"
              required
              className="form-control"
              value={company?.contactEmail || ''}
              onChange={(e) => setCompany({ ...company!, contactEmail: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contact Phone</label>
            <input
              type="text"
              className="form-control"
              placeholder="+91 80 1234 5678"
              value={company?.contactPhone || ''}
              onChange={(e) => setCompany({ ...company!, contactPhone: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Company Description & Mission</label>
          <textarea
            required
            rows={4}
            className="form-control"
            value={company?.description || ''}
            onChange={(e) => setCompany({ ...company!, description: e.target.value })}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button type="submit" disabled={saving} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
            <Save size={18} /> {saving ? 'Saving...' : 'Save Corporate Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};
