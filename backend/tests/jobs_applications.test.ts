import request from 'supertest';
import { app } from '../src/app.js';
import './setup.js';

describe('Job Lifecycle, Ownership & Duplicate Application Tests', () => {
  let recruiterToken: string;
  let anotherRecruiterToken: string;
  let studentToken: string;
  let studentId: string;
  let createdJobId: string;
  let applicationId: string;

  beforeAll(async () => {
    // 1. Register Recruiter A
    const recRes = await request(app).post('/api/auth/register').send({
      name: 'Talent Lead A',
      email: 'recruiter.alpha@company.com',
      password: 'Password@123',
      role: 'recruiter',
      companyName: 'Alpha Corp',
    });
    recruiterToken = recRes.body.data.accessToken;

    // 2. Register Recruiter B (Different company)
    const recBRes = await request(app).post('/api/auth/register').send({
      name: 'Talent Lead B',
      email: 'recruiter.beta@company.com',
      password: 'Password@123',
      role: 'recruiter',
      companyName: 'Beta Corp',
    });
    anotherRecruiterToken = recBRes.body.data.accessToken;

    // 3. Register Student
    const stdRes = await request(app).post('/api/auth/register').send({
      name: 'Aditya Sen',
      email: 'aditya.sen@student.edu',
      password: 'Password@123',
      role: 'student',
      department: 'Computer Science and Engineering',
      graduationYear: 2025,
      cgpa: 8.9,
    });
    studentToken = stdRes.body.data.accessToken;
    studentId = stdRes.body.data.user.id;
  });

  it('Recruiter A creates a job posting', async () => {
    const res = await request(app)
      .post('/api/recruiters/jobs')
      .set('Authorization', `Bearer ${recruiterToken}`)
      .send({
        title: 'Backend Engineer',
        description: 'Building microservices in Node and TypeScript.',
        jobType: 'full_time',
        workplaceType: 'remote',
        location: 'Bengaluru',
        salaryMin: 800000,
        salaryMax: 1200000,
        requiredSkills: ['Node.js', 'TypeScript', 'SQL'],
        eligibleDepartments: ['CSE', 'IT'],
        minCgpa: 7.0,
        deadline: new Date(Date.now() + 10 * 24 * 3600 * 1000).toISOString(),
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toBeDefined();
    createdJobId = res.body.data._id;
  });

  it('Student discovers the active job posting', async () => {
    const res = await request(app)
      .get('/api/students/jobs')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.jobs.length).toBeGreaterThan(0);
    const found = res.body.data.jobs.find((j: any) => j._id === createdJobId);
    expect(found).toBeDefined();
  });

  it('Student applies for the job', async () => {
    const res = await request(app)
      .post('/api/students/applications')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        jobId: createdJobId,
        coverNote: 'Excited about the role.',
        resumeUrl: '/uploads/resumes/dummy_resume.pdf',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('applied');
    applicationId = res.body.data._id;
  });

  it('Student applying again for SAME job fails with 409 Conflict (Duplicate Prevention)', async () => {
    const res = await request(app)
      .post('/api/students/applications')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        jobId: createdJobId,
        coverNote: 'Applying again.',
        resumeUrl: '/uploads/resumes/dummy_resume.pdf',
      });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('already submitted');
  });

  it('Recruiter A views applicants for the job', async () => {
    const res = await request(app)
      .get(`/api/recruiters/jobs/${createdJobId}/applicants`)
      .set('Authorization', `Bearer ${recruiterToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.totalApplicants).toBe(1);
    expect(res.body.data.applicants[0].student.email).toBe('aditya.sen@student.edu');
  });

  it('Recruiter B attempting to view Recruiter A applicants fails with 403 Forbidden (Resource Ownership)', async () => {
    const res = await request(app)
      .get(`/api/recruiters/jobs/${createdJobId}/applicants`)
      .set('Authorization', `Bearer ${anotherRecruiterToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('Recruiter A updates applicant status to shortlisted', async () => {
    const res = await request(app)
      .patch(`/api/recruiters/applicants/${applicationId}/status`)
      .set('Authorization', `Bearer ${recruiterToken}`)
      .send({
        status: 'shortlisted',
        note: 'Solid profile and CGPA.',
      });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('shortlisted');
  });
});
