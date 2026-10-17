import { Router } from 'express';
import { recruiterController } from '../controllers/recruiterController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.use(authenticate, authorize('recruiter'));

router.get('/company', recruiterController.getCompany);
router.put('/company', recruiterController.updateCompany);

router.get('/jobs', recruiterController.getMyJobs);
router.post('/jobs', recruiterController.createJob);
router.put('/jobs/:id', recruiterController.updateJob);
router.delete('/jobs/:id', recruiterController.deleteJob);

router.get('/jobs/:jobId/applicants', recruiterController.getApplicants);
router.patch('/applicants/:applicationId/status', recruiterController.updateApplicantStatus);
router.post('/interviews', recruiterController.scheduleInterview);
router.get('/jobs/:jobId/export', recruiterController.exportApplicantsCsv);

export default router;
