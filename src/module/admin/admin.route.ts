import { Router } from 'express';
import { adminController } from './admin.controller';
import { validateRequest } from '../../middleware/validation.middleware';
import { initializeAdminSchema, loginAdminSchema } from './admin.schema';

const router = Router();

// Public routes
router.post('/initialize', validateRequest(initializeAdminSchema), adminController.initializeAdmin);
router.post('/login', validateRequest(loginAdminSchema), adminController.login);

export const adminRoutes = router; 