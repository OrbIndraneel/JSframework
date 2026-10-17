import { Router } from 'express';
import { studentController } from '../controllers/studentController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { uploadResume } from '../middleware/upload.js';

const router = Router();

// Public / student accessible job discovery
router.get('/jobs', studentController.getJobs);

// Protected student portal endpoints
router.use(authenticate, authorize('student'));

router.get('/profile', studentController.getProfile);
router.put('/profile', studentController.updateProfile);
router.post('/resume', uploadResume.single('resume'), studentController.uploadResume);
router.get('/recommendations', studentController.getRecommendations);
router.post('/applications', studentController.applyJob);
router.get('/applications', studentController.getMyApplications);
router.post('/applications/:id/withdraw', studentController.withdrawApplication);

export default router;
