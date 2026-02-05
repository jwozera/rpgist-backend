import { Router } from 'express';

import { characterController } from './character.controller';
import { authenticate } from '../auth/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', (req, res, next) => characterController.list(req, res, next));
router.get('/:id', (req, res, next) => characterController.getById(req, res, next));
router.post('/', (req, res, next) => characterController.create(req, res, next));
router.patch('/:id', (req, res, next) => characterController.patch(req, res, next));
router.delete('/:id', (req, res, next) => characterController.remove(req, res, next));

export default router;
