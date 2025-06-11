import { Router } from 'express';
import { userController } from './user.controller';
import { validateRequest } from '../../middleware/validation.middleware';
import { registerSchema, loginSchema } from './user.schema';
import { protect, restrictTo } from '../../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/register', validateRequest(registerSchema), userController.register);
router.post('/login', validateRequest(loginSchema), userController.login);
router.get('/auth/google', userController.googleAuth);
router.get('/auth/google/callback', userController.googleCallback);

// Protected routes
router.use(protect);

router.get('/profile', userController.getMe);
router.patch('/profile', userController.updateMe);
router.delete('/profile', userController.deleteMe);

// Admin only routes
router.use(restrictTo('admin'));
router.get('/all', userController.getAllUsers);
router.get('/:id', userController.getUser);
router.patch('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export const userRoutes = router;
