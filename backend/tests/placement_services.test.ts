import request from 'supertest';
import { app } from '../src/app.js';
import { User } from '../src/models/User.js';
import './setup.js';

describe('Placement Officer API & Database Services', () => {
  let officerToken: string;
  let recruiterUserId: string;
  let studentUserId: string;
  let createdDriveId: string;

  beforeAll(async () => {
    // 1. Create Placement Officer directly (since public registration rejects this role for security)
    const officer = await User.create({
      name: 'Dr. Placement Dean',
      email: 'dean.placement@university.edu',
      password: 'OfficerPassword@123',
      role: 'placement_officer',
      isVerified: true,
      isActive: true,
    });

    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'dean.placement@university.edu',
      password: 'OfficerPassword@123',
    });
    officerToken = loginRes.body.data.accessToken;

    // 2. Register an unverified Recruiter to test verification
    const recRes = await request(app).post('/api/auth/register').send({
      name: 'Recruiter To Verify',
      email: 'recruiter.verify@enterprise.com',
      password: 'Password@123',
      role: 'recruiter',
      companyName: 'Enterprise AI Systems',
    });
    recruiterUserId = recRes.body.data.user.id;

    // 3. Register a Student to test user management and activation
    const stdRes = await request(app).post('/api/auth/register').send({
      name: 'Aakash Sharma',
      email: 'aakash.sharma@student.edu',
      password: 'Password@123',
      role: 'student',
      department: 'Computer Science and Engineering',
    });
    studentUserId = stdRes.body.data.user.id;
  });

  it('GET /api/placement/users should list users and support pagination & role filter', async () => {
    const res = await request(app)
      .get('/api/placement/users?role=recruiter')
      .set('Authorization', `Bearer ${officerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.users.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data.pagination).toHaveProperty('total');
  });

  it('PATCH /api/placement/users/:id/verify should verify a recruiter and create audit log', async () => {
    const res = await request(app)
      .patch(`/api/placement/users/${recruiterUserId}/verify`)
      .set('Authorization', `Bearer ${officerToken}`)
      .send({ isVerified: true });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.isVerified).toBe(true);
  });

  it('PATCH /api/placement/users/:id/toggle-active should toggle user active state', async () => {
    const res = await request(app)
      .patch(`/api/placement/users/${studentUserId}/toggle-active`)
      .set('Authorization', `Bearer ${officerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.isActive).toBe(false);

    // Toggle back to active
    const res2 = await request(app)
      .patch(`/api/placement/users/${studentUserId}/toggle-active`)
      .set('Authorization', `Bearer ${officerToken}`);

    expect(res2.status).toBe(200);
    expect(res2.body.data.isActive).toBe(true);
  });

  it('POST /api/placement/drives should create a new recruitment drive', async () => {
    const res = await request(app)
      .post('/api/placement/drives')
      .set('Authorization', `Bearer ${officerToken}`)
      .send({
        name: 'Annual Mega Placement Drive 2026',
        academicYear: '2025-2026',
        description: 'Flagship university-wide campus recruitment season for core & IT disciplines.',
        startDate: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString(),
        endDate: new Date(Date.now() + 25 * 24 * 3600 * 1000).toISOString(),
        eligibleDepartments: ['Computer Science and Engineering', 'Information Technology'],
        minCgpa: 6.5,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Annual Mega Placement Drive 2026');
    createdDriveId = res.body.data._id;
  });

  it('GET /api/placement/drives should list all recruitment drives', async () => {
    const res = await request(app)
      .get('/api/placement/drives')
      .set('Authorization', `Bearer ${officerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    const found = res.body.data.find((d: any) => d._id === createdDriveId);
    expect(found).toBeDefined();
  });

  it('GET /api/placement/analytics should return KPIs, salary statistics, and funnel metrics', async () => {
    const res = await request(app)
      .get('/api/placement/analytics')
      .set('Authorization', `Bearer ${officerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.kpis).toHaveProperty('totalStudents');
    expect(res.body.data.kpis).toHaveProperty('activeJobs');
    expect(res.body.data.kpis).toHaveProperty('placementRate');
    expect(res.body.data).toHaveProperty('funnel');
  });

  it('GET /api/placement/audit-logs should retrieve recorded administrative actions', async () => {
    const res = await request(app)
      .get('/api/placement/audit-logs')
      .set('Authorization', `Bearer ${officerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.logs.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data.logs.some((l: any) => l.action.includes('VERIFY_USER'))).toBe(true);
  });

  it('GET /api/placement/export-report should return CSV export', async () => {
    const res = await request(app)
      .get('/api/placement/export-report')
      .set('Authorization', `Bearer ${officerToken}`);

    expect(res.status).toBe(200);
    expect(res.header['content-type']).toContain('text/csv');
    expect(res.text).toContain('Student Name');
  });
});
