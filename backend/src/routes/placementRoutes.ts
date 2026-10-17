import { Router } from 'express';
import { placementController } from '../controllers/placementController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.use(authenticate, authorize('placement_officer'));

router.get('/users', placementController.getUsers);
router.patch('/users/:id/verify', placementController.verifyUser);
router.patch('/users/:id/toggle-active', placementController.toggleActiveUser);

router.get('/drives', placementController.getDrives);
router.post('/drives', placementController.createDrive);
router.put('/drives/:id', placementController.updateDrive);

router.get('/analytics', placementController.getAnalytics);
router.get('/audit-logs', placementController.getAuditLogs);
router.get('/export-report', placementController.exportPlacementReport);

export default router;
