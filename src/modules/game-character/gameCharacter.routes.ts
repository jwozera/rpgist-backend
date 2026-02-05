import { Router } from 'express';

import { authenticate } from '../auth/auth.middleware';
import { gameCharacterController } from './gameCharacter.controller';

const router = Router();

router.use(authenticate);

router.post('/', (req, res, next) => gameCharacterController.requestJoin(req, res, next));
router.get('/', (req, res, next) => gameCharacterController.list(req, res, next));
router.get('/:id', (req, res, next) => gameCharacterController.getById(req, res, next));
router.post('/:id/approve', (req, res, next) => gameCharacterController.approve(req, res, next));
router.post('/:id/reject', (req, res, next) => gameCharacterController.reject(req, res, next));
router.patch('/:id/state', (req, res, next) => gameCharacterController.updateState(req, res, next));

export default router;
