import { Router } from 'express';

import { requireAuth, requireSelfUser } from '../../shared/middleware/authorization';
import { userController } from './user.controller';

const router = Router();

router.use(requireAuth);

const ensureSelf = requireSelfUser((req) => req.userId);

router.get('/me', ensureSelf, (req, res, next) => userController.me(req, res, next));
router.patch('/me', ensureSelf, (req, res, next) => userController.updateMe(req, res, next));
router.delete('/me', ensureSelf, (req, res, next) => userController.deleteMe(req, res, next));

export default router;
