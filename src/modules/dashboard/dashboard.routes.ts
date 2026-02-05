import { Router } from 'express';

import { authenticate } from '../auth/auth.middleware';
import { dashboardController } from './dashboard.controller';

const router = Router();

router.use(authenticate);
router.get('/', (req, res, next) => dashboardController.get(req, res, next));

export default router;
