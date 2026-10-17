import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Briefcase, Users, ShieldAlert, AlertCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/index.js';
import { registerUser, clearAuthError, fetchCurrentUser } from '../../store/slices/authSlice.js';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [role, setRole] = useState<'student' | 'recruiter' | 'alumni'>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Role conditional fields
  const [department, setDepartment] = useState('Computer Science and Engineering');
  const [rollNumber, setRollNumber] = useState('');
  const [graduationYear, setGraduationYear] = useState(2025);
  const [cgpa, setCgpa] = useState(8.0);
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('Information Technology');
  const [designation, setDesignation] = useState('');
  const [location, setLocation] = useState('Bengaluru, India');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearAuthError());

    const payload: any = {
      name,
      email,
      password,
      role,
    };

    if (role === 'student') {
      payload.department = department;
      payload.rollNumber = rollNumber;
      payload.graduationYear = Number(graduationYear);
      payload.cgpa = Number(cgpa);
    } else if (role === 'recruiter') {
      payload.companyName = companyName;
      payload.industry = industry;
      payload.location = location;
      payload.designation = designation || 'Technical Recruiter';
    } else if (role === 'alumni') {
      payload.department = department;
      payload.graduationYear = Number(graduationYear);
      payload.companyName = companyName;
      payload.designation = designation || 'Software Engineer';
    }

    const res = await dispatch(registerUser(payload));
    if (registerUser.fulfilled.match(res)) {
      await dispatch(fetchCurrentUser());
      if (role === 'student') navigate('/student/dashboard');
      else if (role === 'recruiter') navigate('/recruiter/dashboard');
      else navigate('/alumni/dashboard');
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: '580px' }}>
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
              marginBottom: '0.75rem',
            }}
          >
            <GraduationCap size={28} />
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--navy-900)' }}>
            Create CampusConnect Account
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Select your university affiliation role to establish your verified profile
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

          {/* Role Selection Tabs */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">I am registering as:</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setRole('student')}
                style={{
                  padding: '0.75rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  border: `2px solid ${role === 'student' ? 'var(--primary-600)' : 'var(--surface-border)'}`,
                  background: role === 'student' ? 'var(--primary-50)' : '#ffffff',
                  color: role === 'student' ? 'var(--primary-700)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
              >
                <GraduationCap size={20} />
                Student
              </button>

              <button
                type="button"
                onClick={() => setRole('recruiter')}
                style={{
                  padding: '0.75rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  border: `2px solid ${role === 'recruiter' ? 'var(--primary-600)' : 'var(--surface-border)'}`,
                  background: role === 'recruiter' ? 'var(--primary-50)' : '#ffffff',
                  color: role === 'recruiter' ? 'var(--primary-700)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
              >
                <Briefcase size={20} />
                Recruiter
              </button>

              <button
                type="button"
                onClick={() => setRole('alumni')}
                style={{
                  padding: '0.75rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  border: `2px solid ${role === 'alumni' ? 'var(--primary-600)' : 'var(--surface-border)'}`,
                  background: role === 'alumni' ? 'var(--primary-50)' : '#ffffff',
                  color: role === 'alumni' ? 'var(--primary-700)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
              >
                <Users size={20} />
                Alumni
              </button>
            </div>

            {/* Placement officer notice */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                marginTop: '0.5rem',
              }}
            >
              <ShieldAlert size={14} color="#f59e0b" />
              <span>Placement Officer accounts are administratively provisioned and restricted from public registration.</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Common Fields */}
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  required
                  className="form-control"
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password (min 6 characters)</label>
              <input
                type="password"
                required
                minLength={6}
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Student Conditional Fields */}
            {role === 'student' && (
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Department / Branch</label>
                  <select
                    className="form-control"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    <option value="Computer Science and Engineering">Computer Science (CSE)</option>
                    <option value="Information Technology">Information Technology (IT)</option>
                    <option value="Electronics and Communication">Electronics & Comm. (ECE)</option>
                    <option value="Artificial Intelligence and Data Science">AI & Data Science</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Roll Number / Enrollment ID</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. 21CS101"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Graduation Year</label>
                  <input
                    type="number"
                    required
                    min={2024}
                    max={2030}
                    className="form-control"
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(Number(e.target.value))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Current CGPA (0 - 10)</label>
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    max={10}
                    required
                    className="form-control"
                    value={cgpa}
                    onChange={(e) => setCgpa(Number(e.target.value))}
                  />
                </div>
              </div>
            )}

            {/* Recruiter Conditional Fields */}
            {role === 'recruiter' && (
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Company / Organization Name</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Microsoft India"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Industry Domain</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Cloud & Enterprise Software"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Your Corporate Designation</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Campus Talent Partner"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">HQ / Office Location</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Hyderabad, Telangana"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Alumni Conditional Fields */}
            {role === 'alumni' && (
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Graduation Year</label>
                  <input
                    type="number"
                    required
                    min={1990}
                    max={2024}
                    className="form-control"
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(Number(e.target.value))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Graduating Department</label>
                  <select
                    className="form-control"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    <option value="Computer Science and Engineering">Computer Science (CSE)</option>
                    <option value="Information Technology">Information Technology (IT)</option>
                    <option value="Electronics and Communication">Electronics & Comm. (ECE)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Current Employer / Organization</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Google India"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Current Job Title</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Senior Software Engineer"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.75rem', padding: '0.75rem' }}
            >
              {isLoading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary-600)', fontWeight: 600 }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
