import request from 'supertest';
import { app } from '../src/app.js';
import './setup.js';

describe('Recruiter API & Database Services', () => {
  let recruiterToken: string;
  let recruiterId: string;
  let studentToken: string;
  let studentId: string;
  let createdJobId: string;
  let applicationId: string;

  beforeAll(async () => {
    // 1. Register Recruiter
    const recRes = await request(app).post('/api/auth/register').send({
      name: 'Ananya Roy',
      email: 'ananya.roy@innovatex.io',
      password: 'Password@123',
      role: 'recruiter',
      companyName: 'InnovaTex Solutions',
      industry: 'Cloud & AI Infrastructure',
      location: 'Pune, India',
    });
    recruiterToken = recRes.body.data.accessToken;
    recruiterId = recRes.body.data.user.id;

    // 2. Register Student
    const stdRes = await request(app).post('/api/auth/register').send({
      name: 'Karan Mehra',
      email: 'karan.mehra@student.edu',
      password: 'Password@123',
      role: 'student',
      department: 'Information Technology',
      graduationYear: 2025,
      cgpa: 8.4,
    });
    studentToken = stdRes.body.data.accessToken;
    studentId = stdRes.body.data.user.id;
  });

  it('GET /api/recruiters/company should retrieve company details', async () => {
    const res = await request(app)
      .get('/api/recruiters/company')
      .set('Authorization', `Bearer ${recruiterToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('InnovaTex Solutions');
  });

  it('PUT /api/recruiters/company should update company website and description', async () => {
    const res = await request(app)
      .put('/api/recruiters/company')
      .set('Authorization', `Bearer ${recruiterToken}`)
      .send({
        website: 'https://innovatex.io',
        description: 'Next-generation cloud optimization systems and AI runtime pipelines.',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.website).toBe('https://innovatex.io');
    expect(res.body.data.description).toContain('cloud optimization');
  });

  it('POST /api/recruiters/jobs should create a new job posting', async () => {
    const res = await request(app)
      .post('/api/recruiters/jobs')
      .set('Authorization', `Bearer ${recruiterToken}`)
      .send({
        title: 'Cloud DevOps Associate',
        description: 'Manage Kubernetes clusters, Terraform infrastructure, and CI/CD automation.',
        jobType: 'full_time',
        workplaceType: 'on_site',
        location: 'Pune, India',
        salaryMin: 750000,
        salaryMax: 1100000,
        requiredSkills: ['Linux', 'Kubernetes', 'Docker', 'AWS'],
        eligibleDepartments: ['Information Technology', 'Computer Science and Engineering'],
        minCgpa: 7.0,
        positions: 3,
        deadline: new Date(Date.now() + 20 * 24 * 3600 * 1000).toISOString(),
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Cloud DevOps Associate');
    createdJobId = res.body.data._id;
  });

  it('GET /api/recruiters/jobs should list recruiter jobs with applicant count', async () => {
    const res = await request(app)
      .get('/api/recruiters/jobs')
      .set('Authorization', `Bearer ${recruiterToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    const job = res.body.data.find((j: any) => j._id === createdJobId);
    expect(job).toBeDefined();
    expect(job.applicantCount).toBe(0);
  });

  it('PUT /api/recruiters/jobs/:id should update job positions and skills', async () => {
    const res = await request(app)
      .put(`/api/recruiters/jobs/${createdJobId}`)
      .set('Authorization', `Bearer ${recruiterToken}`)
      .send({
        positions: 5,
        requiredSkills: ['Linux', 'Kubernetes', 'Docker', 'AWS', 'Terraform'],
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.positions).toBe(5);
    expect(res.body.data.requiredSkills).toContain('Terraform');
  });

  it('Student applies and recruiter views applicants', async () => {
    // Student applies
    const appRes = await request(app)
      .post('/api/students/applications')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        jobId: createdJobId,
        coverNote: 'Experienced in Linux kernel configuration and Kubernetes Helm charts.',
        resumeUrl: '/uploads/resumes/karan_resume.pdf',
      });
    expect(appRes.status).toBe(201);
    applicationId = appRes.body.data._id;

    // Recruiter views applicants
    const applicantsRes = await request(app)
      .get(`/api/recruiters/jobs/${createdJobId}/applicants`)
      .set('Authorization', `Bearer ${recruiterToken}`);

    expect(applicantsRes.status).toBe(200);
    expect(applicantsRes.body.data.totalApplicants).toBe(1);
    expect(applicantsRes.body.data.applicants[0].student.name).toBe('Karan Mehra');
  });

  it('POST /api/recruiters/interviews should schedule interview and notify student', async () => {
    const interviewDate = new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString();
    const res = await request(app)
      .post('/api/recruiters/interviews')
      .set('Authorization', `Bearer ${recruiterToken}`)
      .send({
        applicationId,
        round: 'System Architecture & Linux Deep Dive',
        scheduledAt: interviewDate,
        durationMinutes: 60,
        meetingLink: 'https://meet.google.com/abc-defg-hij',
        interviewerNotes: 'Candidate demonstrated good knowledge in Docker.',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.round).toBe('System Architecture & Linux Deep Dive');
    expect(res.body.data.status).toBe('scheduled');
  });

  it('GET /api/recruiters/jobs/:jobId/export should stream CSV of applicants', async () => {
    const res = await request(app)
      .get(`/api/recruiters/jobs/${createdJobId}/export`)
      .set('Authorization', `Bearer ${recruiterToken}`);

    expect(res.status).toBe(200);
    expect(res.header['content-type']).toContain('text/csv');
    expect(res.text).toContain('Candidate Name');
    expect(res.text).toContain('Karan Mehra');
    expect(res.text).toContain('karan.mehra@student.edu');
  });

  it('DELETE /api/recruiters/jobs/:id should close/delete the job posting', async () => {
    const res = await request(app)
      .delete(`/api/recruiters/jobs/${createdJobId}`)
      .set('Authorization', `Bearer ${recruiterToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Verify job is closed or deleted
    const checkRes = await request(app)
      .get('/api/recruiters/jobs')
      .set('Authorization', `Bearer ${recruiterToken}`);
    const found = checkRes.body.data.find((j: any) => j._id === createdJobId);
    expect(found?.status === 'closed' || !found).toBe(true);
  });
});
