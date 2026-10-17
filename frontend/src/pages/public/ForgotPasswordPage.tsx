import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../../services/api.js';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.post('/auth/forgot-password', { email });
      setMessage(res.data.message);
      setStep('reset');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to process request.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.post('/auth/reset-password', { email, newPassword });
      setMessage(res.data.message);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div className="card" style={{ padding: '2rem' }}>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
            {step === 'request' ? 'Password Recovery' : 'Set New Password'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            {step === 'request'
              ? 'Enter your institutional email to begin password recovery.'
              : 'Enter your new password to restore account access.'}
          </p>

          {message && (
            <div style={{ padding: '0.75rem', background: 'var(--success-bg)', color: 'var(--success-text)', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={16} />
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div style={{ padding: '0.75rem', background: 'var(--danger-bg)', color: 'var(--danger-text)', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              {error}
            </div>
          )}

          {step === 'request' ? (
            <form onSubmit={handleRequest}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }} />
                  <input
                    type="email"
                    required
                    className="form-control"
                    placeholder="name@college.edu"
                    style={{ paddingLeft: '38px' }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
                {loading ? 'Processing...' : 'Continue to Reset Password'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleReset}>
              <div className="form-group">
                <label className="form-label">Account Email</label>
                <input type="email" disabled className="form-control" value={email} />
              </div>

              <div className="form-group">
                <label className="form-label">New Password (min 6 chars)</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  className="form-control"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
                {loading ? 'Updating Password...' : 'Save New Password & Sign In'}
              </button>
            </form>
          )}

          <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
            <Link to="/login" style={{ color: 'var(--primary-600)', fontSize: '0.85rem', fontWeight: 600 }}>
              &larr; Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
