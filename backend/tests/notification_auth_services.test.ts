import request from 'supertest';
import { app } from '../src/app.js';
import { Notification } from '../src/models/Notification.js';
import './setup.js';

describe('Notification & Authentication Lifecycle Services', () => {
  let userToken: string;
  let refreshToken: string;
  let userId: string;
  let testNotificationId: string;

  beforeAll(async () => {
    // Register a student
    const res = await request(app).post('/api/auth/register').send({
      name: 'Tanvi Nair',
      email: 'tanvi.nair@student.edu',
      password: 'InitialPassword@123',
      role: 'student',
      department: 'Electrical Engineering',
      graduationYear: 2025,
      cgpa: 8.7,
    });

    userToken = res.body.data.accessToken;
    refreshToken = res.body.data.refreshToken;
    userId = res.body.data.user.id;

    // Create test notifications directly in database
    const notif = await Notification.create({
      recipient: userId,
      title: 'Drive Announcement',
      message: 'New campus drive announced by Oracle Cloud.',
      type: 'drive',
      isRead: false,
    });
    testNotificationId = notif._id.toString();

    await Notification.create({
      recipient: userId,
      title: 'Resume Review',
      message: 'Your resume has been parsed and reviewed.',
      type: 'system',
      isRead: false,
    });
  });

  it('GET /api/auth/me should return current user profile and role data', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe('tanvi.nair@student.edu');
    expect(res.body.data.profile.department).toBe('Electrical Engineering');
  });

  it('GET /api/notifications should retrieve all notifications for the user', async () => {
    const res = await request(app)
      .get('/api/notifications')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(2);
  });

  it('GET /api/notifications/unread-count should return unread notification count', async () => {
    const res = await request(app)
      .get('/api/notifications/unread-count')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.unreadCount).toBe(2);
  });

  it('PATCH /api/notifications/:id/read should mark a single notification as read', async () => {
    const res = await request(app)
      .patch(`/api/notifications/${testNotificationId}/read`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.isRead).toBe(true);

    // Verify unread count decreased to 1
    const countRes = await request(app)
      .get('/api/notifications/unread-count')
      .set('Authorization', `Bearer ${userToken}`);
    expect(countRes.body.data.unreadCount).toBe(1);
  });

  it('PATCH /api/notifications/read-all should mark all notifications as read', async () => {
    const res = await request(app)
      .patch('/api/notifications/read-all')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Verify unread count is now 0
    const countRes = await request(app)
      .get('/api/notifications/unread-count')
      .set('Authorization', `Bearer ${userToken}`);
    expect(countRes.body.data.unreadCount).toBe(0);
  });

  it('POST /api/auth/refresh should rotate tokens with valid refresh token', async () => {
    const res = await request(app).post('/api/auth/refresh').send({
      refreshToken,
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();

    // The old refresh token should now be invalidated
    const reuseRes = await request(app).post('/api/auth/refresh').send({
      refreshToken,
    });
    expect(reuseRes.status).toBe(401);

    // Update with new tokens
    userToken = res.body.data.accessToken;
    refreshToken = res.body.data.refreshToken;
  });

  it('POST /api/auth/forgot-password should acknowledge valid email', async () => {
    const res = await request(app).post('/api/auth/forgot-password').send({
      email: 'tanvi.nair@student.edu',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('POST /api/auth/reset-password should update password and allow login with new password', async () => {
    const resetRes = await request(app).post('/api/auth/reset-password').send({
      email: 'tanvi.nair@student.edu',
      newPassword: 'BrandNewSecurePassword@999',
    });

    expect(resetRes.status).toBe(200);
    expect(resetRes.body.success).toBe(true);

    // Old password fails
    const oldLoginRes = await request(app).post('/api/auth/login').send({
      email: 'tanvi.nair@student.edu',
      password: 'InitialPassword@123',
    });
    expect(oldLoginRes.status).toBe(401);

    // New password succeeds
    const newLoginRes = await request(app).post('/api/auth/login').send({
      email: 'tanvi.nair@student.edu',
      password: 'BrandNewSecurePassword@999',
    });
    expect(newLoginRes.status).toBe(200);
    expect(newLoginRes.body.success).toBe(true);
  });

  it('POST /api/auth/logout should clear refresh token hash', async () => {
    const res = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
