import request from 'supertest';
import { app } from '../src/app.js';
import './setup.js';

describe('Alumni & Mentorship API Services', () => {
  let alumniToken: string;
  let alumniUserId: string;
  let studentToken: string;
  let studentUserId: string;
  let mentorshipRequestId: string;
  let createdEventId: string;

  beforeAll(async () => {
    // 1. Register Alumni
    const almRes = await request(app).post('/api/auth/register').send({
      name: 'Vikram Sethi',
      email: 'vikram.sethi@alumni.edu',
      password: 'Password@123',
      role: 'alumni',
      department: 'Computer Science and Engineering',
      graduationYear: 2022,
      companyName: 'Stripe Payments',
      designation: 'Staff Software Engineer',
    });
    alumniToken = almRes.body.data.accessToken;
    alumniUserId = almRes.body.data.user.id;

    // 2. Register Student
    const stdRes = await request(app).post('/api/auth/register').send({
      name: 'Sneha Patel',
      email: 'sneha.patel@student.edu',
      password: 'Password@123',
      role: 'student',
      department: 'Computer Science and Engineering',
      graduationYear: 2025,
      cgpa: 9.0,
    });
    studentToken = stdRes.body.data.accessToken;
    studentUserId = stdRes.body.data.user.id;
  });

  it('GET /api/alumni/profile should retrieve alumni profile', async () => {
    const res = await request(app)
      .get('/api/alumni/profile')
      .set('Authorization', `Bearer ${alumniToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.designation).toBe('Staff Software Engineer');
  });

  it('PUT /api/alumni/profile should update alumni expertise and mentorship topics', async () => {
    const res = await request(app)
      .put('/api/alumni/profile')
      .set('Authorization', `Bearer ${alumniToken}`)
      .send({
        expertise: ['Distributed Systems', 'Fintech', 'System Design'],
        mentorshipTopics: ['Resume Reviews', 'Mock Technical Interviews'],
        bio: 'Helping college graduates break into top tier software engineering roles.',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.expertise).toContain('Fintech');
  });

  it('GET /api/alumni/directory should search and return public alumni profiles', async () => {
    const res = await request(app).get('/api/alumni/directory');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.profiles.length).toBeGreaterThanOrEqual(1);
  });

  it('POST /api/alumni/mentorship-requests should allow student to request mentorship', async () => {
    const res = await request(app)
      .post('/api/alumni/mentorship-requests')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        alumniUserId,
        topic: 'System Design and Career Roadmap',
        message: 'Hi Vikram, I would love feedback on preparing for backend system design interviews.',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('pending');
    mentorshipRequestId = res.body.data._id;
  });

  it('POST duplicate pending mentorship request should return 409 Conflict', async () => {
    const res = await request(app)
      .post('/api/alumni/mentorship-requests')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        alumniUserId,
        topic: 'Another Request',
        message: 'Duplicate request test',
      });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/alumni/mentorship-requests should list requests for alumni', async () => {
    const res = await request(app)
      .get('/api/alumni/mentorship-requests')
      .set('Authorization', `Bearer ${alumniToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0]._id).toBe(mentorshipRequestId);
    expect(res.body.data[0].student.email).toBe('sneha.patel@student.edu');
  });

  it('PATCH /api/alumni/mentorship-requests/:id/respond should accept request', async () => {
    const res = await request(app)
      .patch(`/api/alumni/mentorship-requests/${mentorshipRequestId}/respond`)
      .set('Authorization', `Bearer ${alumniToken}`)
      .send({
        status: 'accepted',
        responseNote: 'Happy to connect! Let us meet this weekend.',
        meetingDetails: 'Google Meet link: https://meet.google.com/xyz-uvwx-rst',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('accepted');
  });

  it('POST /api/alumni/events should allow alumni to create workshop event', async () => {
    const res = await request(app)
      .post('/api/alumni/events')
      .set('Authorization', `Bearer ${alumniToken}`)
      .send({
        title: 'Mastering System Design for High Scale Systems',
        description: 'Interactive session covering distributed caching, sharding, and CAP theorem.',
        eventType: 'webinar',
        eventDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
        durationMinutes: 90,
        locationOrLink: 'https://zoom.us/j/1234567890',
        maxAttendees: 50,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toContain('Mastering System Design');
    createdEventId = res.body.data._id;
  });

  it('GET /api/alumni/events should list upcoming events', async () => {
    const res = await request(app).get('/api/alumni/events');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });

  it('POST /api/alumni/events/:id/register should register student for event', async () => {
    const res = await request(app)
      .post(`/api/alumni/events/${createdEventId}/register`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.registeredCount).toBe(1);
  });

  it('POST duplicate registration on same event should return 409 Conflict', async () => {
    const res = await request(app)
      .post(`/api/alumni/events/${createdEventId}/register`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });
});
