import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, IndianRupee, Calendar, Building2, Filter } from 'lucide-react';
import { apiClient } from '../../services/api.js';
import { Job } from '../../types/index.js';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.js';
import { EmptyState } from '../../components/common/EmptyState.js';

export const JobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('all');
  const [jobType, setJobType] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 9 };
      if (search) params.search = search;
      if (department !== 'all') params.department = department;
      if (jobType !== 'all') params.jobType = jobType;

      const res = await apiClient.get('/students/jobs', { params });
      setJobs(res.data.data.jobs);
      setTotalPages(res.data.data.pagination.pages);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page, department, jobType]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '0.4rem' }}>
          Campus Recruitment Openings
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Explore verified corporate and product engineering placements for graduating students.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div
        className="card"
        style={{
          marginBottom: '2rem',
          padding: '1.25rem',
        }}
      >
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <Search
              size={18}
              style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              className="form-control"
              placeholder="Search by role, skills, keywords..."
              style={{ paddingLeft: '38px' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ minWidth: '180px' }}>
            <select
              className="form-control"
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">All Departments</option>
              <option value="CSE">Computer Science (CSE)</option>
              <option value="IT">Information Technology (IT)</option>
              <option value="ECE">Electronics (ECE)</option>
              <option value="AI & DS">Artificial Intelligence & DS</option>
              <option value="Mechanical">Mechanical Engineering</option>
            </select>
          </div>

          <div style={{ minWidth: '150px' }}>
            <select
              className="form-control"
              value={jobType}
              onChange={(e) => {
                setJobType(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">All Employment Types</option>
              <option value="full_time">Full-time Placement</option>
              <option value="internship">Internship</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary">
            <Filter size={16} /> Filter Results
          </button>
        </form>
      </div>

      {/* Job Cards Grid */}
      {loading ? (
        <LoadingSpinner message="Retrieving campus openings..." />
      ) : jobs.length === 0 ? (
        <EmptyState
          title="No Openings Found"
          description="Try broadening your search keywords or switching filters to see more listings."
          actionText="Reset Filters"
          onAction={() => {
            setSearch('');
            setDepartment('all');
            setJobType('all');
            setPage(1);
          }}
        />
      ) : (
        <>
          <div className="grid-3" style={{ marginBottom: '2.5rem' }}>
            {jobs.map((job) => (
              <div key={job._id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '8px',
                      background: 'var(--surface-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--primary-600)',
                      flexShrink: 0,
                      overflow: 'hidden',
                      border: '1px solid var(--surface-border)',
                    }}
                  >
                    {job.company?.logoUrl ? (
                      <img
                        src={job.company.logoUrl}
                        alt={job.company.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <Building2 size={24} />
                    )}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy-900)' }}>
                      {job.title}
                    </h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {job.company?.name || 'Verified Partner'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MapPin size={15} color="var(--text-muted)" />
                    <span>{job.location} ({job.workplaceType})</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <IndianRupee size={15} color="var(--text-muted)" />
                    <span>
                      {job.jobType === 'internship'
                        ? `Stipend: ₹${job.stipend?.toLocaleString()}/month`
                        : `CTC: ₹${(job.salaryMin! / 100000).toFixed(1)} - ₹${(job.salaryMax! / 100000).toFixed(1)} LPA`}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Briefcase size={15} color="var(--text-muted)" />
                    <span style={{ textTransform: 'capitalize' }}>
                      {job.jobType.replace('_', ' ')} • Min CGPA: {job.minCgpa || 'No Cutoff'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Calendar size={15} color="var(--text-muted)" />
                    <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Skills tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
                  {job.requiredSkills.slice(0, 4).map((skill) => (
                    <span
                      key={skill}
                      style={{
                        background: 'var(--primary-50)',
                        color: 'var(--primary-700)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                  {job.requiredSkills.length > 4 && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
                      +{job.requiredSkills.length - 4} more
                    </span>
                  )}
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--surface-border)' }}>
                  <Link
                    to={`/jobs/${job._id}`}
                    className="btn btn-outline-primary"
                    style={{ width: '100%', fontSize: '0.85rem' }}
                  >
                    View Details & Apply
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="btn btn-secondary btn-sm"
              >
                Previous
              </button>
              <span style={{ display: 'flex', alignItems: 'center', padding: '0 0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="btn btn-secondary btn-sm"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
