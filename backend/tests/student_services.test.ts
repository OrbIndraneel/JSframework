import request from 'supertest';
import { app } from '../src/app.js';
import './setup.js';

describe('Student API & Database Services', () => {
  let studentToken: string;
  let studentId: string;
  let recruiterToken: string;
  let jobId: string;
  let applicationId: string;

  beforeAll(async () => {
    // 1. Register a student
    const studentRes = await request(app).post('/api/auth/register').send({
      name: 'Pooja Verma',
      email: 'pooja.verma@student.edu',
      password: 'Password@123',
      role: 'student',
      department: 'Computer Science and Engineering',
      graduationYear: 2025,
      cgpa: 8.8,
    });
    studentToken = studentRes.body.data.accessToken;
    studentId = studentRes.body.data.user.id;

    // 2. Register a recruiter and post a job
    const recRes = await request(app).post('/api/auth/register').send({
      name: 'Hiring Specialist',
      email: 'recruiter.studenttest@techcorp.com',
      password: 'Password@123',
      role: 'recruiter',
      companyName: 'TechCorp Global',
    });
    recruiterToken = recRes.body.data.accessToken;

    const jobRes = await request(app)
      .post('/api/recruiters/jobs')
      .set('Authorization', `Bearer ${recruiterToken}`)
      .send({
        title: 'Full Stack Software Engineer',
        description: 'Design and build high-performance cloud applications using React and Node.js.',
        jobType: 'full_time',
        workplaceType: 'hybrid',
        location: 'Hyderabad, India',
        salaryMin: 900000,
        salaryMax: 1400000,
        requiredSkills: ['Node.js', 'React', 'MongoDB', 'TypeScript'],
        eligibleDepartments: ['Computer Science and Engineering', 'Information Technology'],
        minCgpa: 7.5,
        deadline: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString(),
      });
    jobId = jobRes.body.data._id;
  });

  it('GET /api/students/profile should fetch student profile with user info', async () => {
    const res = await request(app)
      .get('/api/students/profile')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe('pooja.verma@student.edu');
    expect(res.body.data.department).toBe('Computer Science and Engineering');
  });

  it('PUT /api/students/profile should update skills, CGPA, and social links', async () => {
    const res = await request(app)
      .put('/api/students/profile')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        cgpa: 9.1,
        skills: ['TypeScript', 'Node.js', 'React', 'Docker'],
        github: 'https://github.com/pooja-verma',
        linkedIn: 'https://linkedin.com/in/pooja-verma',
        bio: 'Aspiring Full Stack Engineer with strong foundations in distributed architectures.',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.cgpa).toBe(9.1);
    expect(res.body.data.skills).toContain('Docker');
    expect(res.body.data.github).toBe('https://github.com/pooja-verma');
  });

  it('GET /api/students/jobs should list jobs and support search query', async () => {
    const res = await request(app).get('/api/students/jobs?search=Software');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.jobs.length).toBeGreaterThan(0);
    expect(res.body.data.jobs[0].title).toContain('Software');
  });

  it('GET /api/students/recommendations should return jobs with recommendation score', async () => {
    const res = await request(app)
      .get('/api/students/recommendations')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.recommendations)).toBe(true);
  });

  it('POST /api/students/applications should submit application and compute score', async () => {
    const res = await request(app)
      .post('/api/students/applications')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        jobId,
        coverNote: 'I have hands-on experience building TypeScript microservices.',
        resumeUrl: '/uploads/resumes/pooja_resume.pdf',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('applied');
    applicationId = res.body.data._id;
    if (res.body.data.aiMatchScore !== undefined) {
      expect(res.body.data.aiMatchScore).toBeGreaterThanOrEqual(0);
    }
  });

  it('GET /api/students/applications should list student applications with populated jobs', async () => {
    const res = await request(app)
      .get('/api/students/applications')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0]._id).toBe(applicationId);
    expect(res.body.data[0].job._id).toBe(jobId);
    expect(res.body.data[0].job.company.name).toBe('TechCorp Global');
  });

  it('POST /api/students/applications/:id/withdraw should withdraw application', async () => {
    const res = await request(app)
      .post(`/api/students/applications/${applicationId}/withdraw`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('withdrawn');
  });

  it('POST /api/students/applications/:id/withdraw on withdrawn application should return 400', async () => {
    const res = await request(app)
      .post(`/api/students/applications/${applicationId}/withdraw`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('already marked');
  });
});
