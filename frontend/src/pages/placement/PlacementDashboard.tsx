import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Users,
  Building2,
  Briefcase,
  FileText,
  Award,
  Download,
  Calendar,
  ShieldCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';
import { apiClient } from '../../services/api.js';
import { PlacementAnalytics } from '../../types/index.js';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.js';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

export const PlacementDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<PlacementAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get('/placement/analytics')
      .then((res) => {
        setAnalytics(res.data.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleExportCsv = () => {
    window.open('/api/placement/export-report', '_blank');
  };

  if (loading || !analytics) return <LoadingSpinner message="Calculating real-time database placement analytics..." />;

  // Prepare Funnel Data for Recharts
  const funnelData = [
    { stage: 'Applied', count: analytics.funnel.applied || 0 },
    { stage: 'Under Review', count: analytics.funnel.under_review || 0 },
    { stage: 'Shortlisted', count: analytics.funnel.shortlisted || 0 },
    { stage: 'Interview', count: analytics.funnel.interview_scheduled || 0 },
    { stage: 'Selected (Hired)', count: analytics.funnel.selected || 0 },
    { stage: 'Rejected', count: analytics.funnel.rejected || 0 },
  ];

  return (
    <div>
      {/* Header */}
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
          <div style={{ fontSize: '0.8rem', color: 'var(--primary-700)', fontWeight: 700, textTransform: 'uppercase' }}>
            ACADEMIC EXECUTIVE ANALYTICS
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--navy-900)' }}>
            University Placement & Corporate Analytics
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Live metrics aggregated from active MongoDB records with zero fabricated statistics.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleExportCsv} className="btn btn-secondary">
            <Download size={16} /> Export Placement Report (.CSV)
          </button>
          <Link to="/placement/drives" className="btn btn-primary">
            <Calendar size={16} /> Manage Drives
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dbeafe', color: '#1d4ed8' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="stat-val">{analytics.kpis.placementRate}%</div>
            <div className="stat-label">Graduating Batch Placement Rate</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#ecfdf5', color: '#047857' }}>
            <Award size={24} />
          </div>
          <div>
            <div className="stat-val">{analytics.kpis.placedStudents}</div>
            <div className="stat-label">Placed Students ({analytics.kpis.totalStudents} Registered)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
            <Briefcase size={24} />
          </div>
          <div>
            <div className="stat-val">{analytics.kpis.activeJobs}</div>
            <div className="stat-label">Active Campus Openings</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7', color: '#b45309' }}>
            <Building2 size={24} />
          </div>
          <div>
            <div className="stat-val">{analytics.kpis.verifiedRecruiters}</div>
            <div className="stat-label">Verified Corporate Partners</div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        {/* Application Funnel Chart */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.25rem' }}>
            Recruitment Funnel Conversion
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1.25rem' }}>
            Progression from initial candidate submissions to final campus offers.
          </p>
          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer>
              <BarChart data={funnelData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="stage" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Distribution PieChart */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.25rem' }}>
            Department Candidate Distribution
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1.25rem' }}>
            Enrolled student distribution across academic engineering disciplines.
          </p>
          <div style={{ width: '100%', height: '280px' }}>
            {analytics.departmentDistribution.length > 0 ? (
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={analytics.departmentDistribution}
                    dataKey="count"
                    nameKey="department"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ name, percent }: any) =>
                      `${name ? name.split(' ')[0] : 'Dept'} (${(percent * 100).toFixed(0)}%)`
                    }
                    labelLine={false}
                  >
                    {analytics.departmentDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No department records available.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Company Hiring Roster & Salary Overview */}
      <div className="grid-2">
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.25rem' }}>
            Company-Wise Hiring Selections
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem' }}>
            Organizations with confirmed student hires this season.
          </p>
          {analytics.companyHiring.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', padding: '1rem 0' }}>
              Final company selections are pending this recruitment cycle.
            </p>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Organization</th>
                    <th>Confirmed Offers</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.companyHiring.map((c, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600 }}>{c.company}</td>
                      <td>
                        <span className="badge badge-success" style={{ fontWeight: 700 }}>
                          {c.hires} Offers Extended
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.25rem' }}>
            Compensation & CTC Statistics
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1.25rem' }}>
            Annual salary packages across active university listings.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--surface-muted)', borderRadius: '6px' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Highest Offered CTC</span>
              <strong style={{ fontSize: '1.25rem', color: '#10b981' }}>
                ₹{(analytics.salaryStats.maxSalary / 100000).toFixed(1)} LPA
              </strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--surface-muted)', borderRadius: '6px' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Average Offered CTC</span>
              <strong style={{ fontSize: '1.25rem', color: '#2563eb' }}>
                ₹{(analytics.salaryStats.avgSalary / 100000).toFixed(1)} LPA
              </strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--surface-muted)', borderRadius: '6px' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Minimum Offered CTC</span>
              <strong style={{ fontSize: '1.25rem', color: '#64748b' }}>
                ₹{(analytics.salaryStats.minSalary / 100000).toFixed(1)} LPA
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
