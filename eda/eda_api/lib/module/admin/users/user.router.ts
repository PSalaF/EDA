import * as  express from 'express';
import { authGuard } from '../../../guards/auth-guard';
import { roleGuard } from '../../../guards/role-guard';
import { UserController } from './user.controller';
const router = express.Router();

// Login routes
router.post('', UserController.create);

router.post('/login', UserController.login);

// User Routes // Role Guard
router.get('', authGuard, roleGuard, UserController.getUsers);

router.get('/profile-img/:img', authGuard, UserController.findProfileImg);

router.get('/refresh-token', authGuard, UserController.refreshToken);

router.get('/is-admin/:id', authGuard, UserController.getIsAdmin);

// Role Guard
router.get('/:id', authGuard, roleGuard, UserController.getUser);

router.put('/me/:id', authGuard, UserController.update);

// Role Guard
router.put('/management/:id', authGuard, roleGuard, UserController.update);

router.delete('/:id', authGuard, roleGuard, UserController.delete);


export default router;
