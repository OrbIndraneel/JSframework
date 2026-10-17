import { Router } from 'express';
import { alumniController } from '../controllers/alumniController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Public / searchable alumni directory and events
router.get('/directory', alumniController.getDirectory);
router.get('/events', alumniController.getEvents);

// Authenticated routes
router.use(authenticate);

// Alumni-specific profile management
router.get('/profile', authorize('alumni'), alumniController.getProfile);
router.put('/profile', authorize('alumni'), alumniController.updateProfile);

// Mentorship endpoints
router.post('/mentorship-requests', authorize('student'), alumniController.requestMentorship);
router.get('/mentorship-requests', authorize('student', 'alumni'), alumniController.getMentorshipRequests);
router.patch('/mentorship-requests/:id/respond', authorize('alumni'), alumniController.respondMentorshipRequest);

// Event creation & registration
router.post('/events', authorize('alumni', 'placement_officer'), alumniController.createEvent);
router.post('/events/:id/register', authorize('student', 'alumni'), alumniController.registerEvent);

export default router;
