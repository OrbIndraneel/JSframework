import React from 'react';
import { GraduationCap, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        background: '#ffffff',
        borderTop: '1px solid var(--surface-border)',
        marginTop: 'auto',
        padding: '3rem 0 1.5rem 0',
      }}
    >
      <div className="container">
        <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.2rem', color: 'var(--navy-900)', marginBottom: '0.75rem' }}>
              <GraduationCap color="var(--primary-600)" />
              <span>CampusConnect</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.6' }}>
              The unified digital placement and alumni relations ecosystem for top university talent, leading enterprises, and graduate mentorship.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.75rem' }}>Platform Navigation</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <Link to="/jobs">Job & Internship Listings</Link>
              <Link to="/alumni/directory">Alumni Network Directory</Link>
              <Link to="/events">Workshops & Campus Drives</Link>
              <Link to="/register">Student & Recruiter Registration</Link>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.75rem' }}>Role Portals</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <Link to="/login">Student Career Portal</Link>
              <Link to="/login">Recruiter Talent Suite</Link>
              <Link to="/login">Placement Officer ERP</Link>
              <Link to="/login">Alumni Mentorship Hub</Link>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.75rem' }}>Placement Cell Desk</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} /> Placement Cell, Academic Block 3
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} /> placements@iiite.ac.in
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} /> +91 (080) 2852-9900
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid var(--surface-border)',
            paddingTop: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} CampusConnect — Indian Institute of Information Technology & Engineering. Academic Project.
          </div>
          <div>Powered by React, Node.js Express, MongoDB, & Python FastAPI AI.</div>
        </div>
      </div>
    </footer>
  );
};
