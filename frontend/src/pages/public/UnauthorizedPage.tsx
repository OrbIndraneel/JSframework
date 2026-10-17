import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export const UnauthorizedPage: React.FC = () => {
  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '480px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fee2e2', color: '#dc2626', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <ShieldAlert size={36} />
        </div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
          Access Restricted (403)
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
          Your current account role does not have authorization to access this administrative or role-restricted module.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <Link to="/" className="btn btn-secondary">
            Return Home
          </Link>
          <Link to="/login" className="btn btn-primary">
            Switch Account
          </Link>
        </div>
      </div>
    </div>
  );
};
