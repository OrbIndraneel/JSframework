import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, Lock, Mail, AlertCircle, KeyRound } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/index.js';
import { loginUser, clearAuthError, fetchCurrentUser } from '../../store/slices/authSlice.js';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const from = (location.state as any)?.from?.pathname || null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearAuthError());

    const resultAction = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(resultAction)) {
      const meAction = await dispatch(fetchCurrentUser());
      if (fetchCurrentUser.fulfilled.match(meAction)) {
        const user = meAction.payload.user;
        if (from) {
          navigate(from, { replace: true });
        } else {
          switch (user.role) {
            case 'student':
              navigate('/student/dashboard');
              break;
            case 'recruiter':
              navigate('/recruiter/dashboard');
              break;
            case 'placement_officer':
              navigate('/placement/dashboard');
              break;
            case 'alumni':
              navigate('/alumni/dashboard');
              break;
            default:
              navigate('/');
          }
        }
      }
    }
  };

  const handleDemoFill = (demoEmail: string, demoPass: string = 'Password@123') => {
    setEmail(demoEmail);
    setPassword(demoPass);
    dispatch(clearAuthError());
  };

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
      }}
    >
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 6px rgba(37,99,235,0.25)',
              marginBottom: '0.75rem',
            }}
          >
            <GraduationCap size={28} />
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--navy-900)' }}>
            Sign In to CampusConnect
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Unified ERP Portal for Students, Recruiters, Officers & Alumni
          </p>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem',
                borderRadius: '6px',
                background: 'var(--danger-bg)',
                color: 'var(--danger-text)',
                fontSize: '0.85rem',
                marginBottom: '1.25rem',
                border: '1px solid var(--danger-border)',
              }}
            >
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">University / Institutional Email</label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={18}
                  style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }}
                />
                <input
                  type="email"
                  required
                  className="form-control"
                  placeholder="name@college.edu or corporate email"
                  style={{ paddingLeft: '38px' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Password</label>
                <Link
                  to="/forgot-password"
                  style={{ fontSize: '0.75rem', color: 'var(--primary-600)', fontWeight: 500 }}
                >
                  Forgot password?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={18}
                  style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }}
                />
                <input
                  type="password"
                  required
                  className="form-control"
                  placeholder="••••••••"
                  style={{ paddingLeft: '38px' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Demo Credentials Autofill */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--surface-border)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <KeyRound size={13} /> CLICK TO AUTOFILL SEEDED DEMO ACCOUNTS:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleDemoFill('rahul.sharma@student.iiite.ac.in')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem' }}
              >
                🎓 Student
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('recruiter.msft@microsoft.com')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem' }}
              >
                🏢 Recruiter (MSFT)
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('admin@campusconnect.edu')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem' }}
              >
                🛡️ Placement Officer
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('alumni.amit@gmail.com')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem' }}
              >
                🤝 Alumni Mentor
              </button>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Don&apos;t have an account yet?{' '}
          <Link to="/register" style={{ color: 'var(--primary-600)', fontWeight: 600 }}>
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};
