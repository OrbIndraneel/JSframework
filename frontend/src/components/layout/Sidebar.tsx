import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UserCheck,
  Briefcase,
  FileText,
  Sparkles,
  Building2,
  Users,
  Calendar,
  FileCheck,
  ShieldCheck,
  BookOpen,
  Send,
} from 'lucide-react';
import { useAppSelector } from '../../store/index.js';

export const Sidebar: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) return null;

  const getLinks = () => {
    switch (user.role) {
      case 'student':
        return [
          { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/student/profile', label: 'Profile & Resume', icon: UserCheck },
          { to: '/jobs', label: 'Browse Openings', icon: Briefcase },
          { to: '/student/recommendations', label: 'AI Matches & Skill Gap', icon: Sparkles },
          { to: '/student/applications', label: 'My Applications', icon: FileText },
          { to: '/alumni/directory', label: 'Alumni Network', icon: Users },
          { to: '/events', label: 'Workshops & Events', icon: Calendar },
        ];
      case 'recruiter':
        return [
          { to: '/recruiter/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/recruiter/company', label: 'Company Profile', icon: Building2 },
          { to: '/recruiter/jobs', label: 'Manage Job Postings', icon: Briefcase },
          { to: '/jobs', label: 'Public Listings View', icon: BookOpen },
        ];
      case 'placement_officer':
        return [
          { to: '/placement/dashboard', label: 'Analytics & KPIs', icon: LayoutDashboard },
          { to: '/placement/drives', label: 'Recruitment Drives', icon: Calendar },
          { to: '/placement/users', label: 'User Verification', icon: ShieldCheck },
          { to: '/placement/audit-logs', label: 'Audit Trail', icon: FileCheck },
          { to: '/jobs', label: 'All Campus Postings', icon: Briefcase },
        ];
      case 'alumni':
        return [
          { to: '/alumni/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/alumni/profile', label: 'Alumni Profile', icon: UserCheck },
          { to: '/alumni/mentorship', label: 'Mentorship Requests', icon: Send },
          { to: '/alumni/directory', label: 'Alumni Directory', icon: Users },
          { to: '/events', label: 'Host / View Events', icon: Calendar },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <aside
      style={{
        width: '260px',
        background: '#ffffff',
        borderRight: '1px solid var(--surface-border)',
        minHeight: 'calc(100vh - 68px)',
        padding: '1.5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.35rem',
        flexShrink: 0,
      }}
      className="sidebar-aside"
    >
      <div
        style={{
          padding: '0.5rem 0.75rem',
          fontSize: '0.75rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: 'var(--text-muted)',
          marginBottom: '0.25rem',
        }}
      >
        {user.role.replace('_', ' ')} Navigation
      </div>

      {links.map((link) => {
        const Icon = link.icon;
        return (
          <NavLink
            key={link.to}
            to={link.to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.875rem',
              fontWeight: isActive ? 600 : 500,
              color: isActive ? 'var(--primary-700)' : 'var(--text-secondary)',
              backgroundColor: isActive ? 'var(--primary-50)' : 'transparent',
              transition: 'all 0.15s ease',
            })}
          >
            <Icon size={18} />
            <span>{link.label}</span>
          </NavLink>
        );
      })}

      <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--surface-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'var(--primary-100)',
              color: 'var(--primary-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: '0.8rem',
            }}
          >
            {user.name.charAt(0)}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
              {user.name}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {user.isVerified ? '✓ Verified Account' : 'Pending Verification'}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
