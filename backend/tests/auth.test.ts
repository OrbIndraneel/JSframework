import request from 'supertest';
import { app } from '../src/app.js';
import './setup.js';

describe('Auth & Role Authorization API Tests', () => {
  it('GET /api/health should return healthy status', async () => {
    const res = await request(app).get('/api/health');
    assertResponse(res, 200);
    expect(res.body.status).toBe('healthy');
  });

  it('POST /api/auth/register should REJECT placement_officer role in public registration', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Malicious Admin',
      email: 'hacker@college.edu',
      password: 'Password@123',
      role: 'placement_officer',
    });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Security restriction');
  });

  it('POST /api/auth/register should successfully register a student', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Rohan Gupta',
      email: 'rohan.gupta@test.edu',
      password: 'Password@123',
      role: 'student',
      department: 'Computer Science and Engineering',
      graduationYear: 2025,
      cgpa: 8.5,
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.user.role).toBe('student');
  });

  it('POST /api/auth/login should authenticate with valid password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'rohan.gupta@test.edu',
      password: 'Password@123',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
  });

  it('POST /api/auth/login should fail with invalid password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'rohan.gupta@test.edu',
      password: 'WrongPassword!',
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/recruiters/jobs should reject student with 403 Forbidden', async () => {
    // Login as student
    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'rohan.gupta@test.edu',
      password: 'Password@123',
    });
    const token = loginRes.body.data.accessToken;

    const res = await request(app)
      .get('/api/recruiters/jobs')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
    expect(res.body.message).toContain('Forbidden');
  });
});

function assertResponse(res: request.Response, expectedStatus: number) {
  if (res.status !== expectedStatus) {
    throw new Error(`Expected status ${expectedStatus}, received ${res.status}: ${JSON.stringify(res.body)}`);
  }
}
