import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '480px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary-100)', color: 'var(--primary-700)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <HelpCircle size={36} />
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
          Page Not Found (404)
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
          The university portal URL you requested does not exist or has been relocated.
        </p>
        <Link to="/" className="btn btn-primary">
          Back to CampusConnect Home
        </Link>
      </div>
    </div>
  );
};
