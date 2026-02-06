import { Router } from 'express';

import { loadGameById, requireAuth, requireGameOwner } from '../../shared/middleware/authorization';
import { gameController } from './game.controller';

const router = Router();

router.use(requireAuth);

router.post('/', (req, res, next) => gameController.create(req, res, next));
router.get('/', (req, res, next) => gameController.list(req, res, next));
router.get('/:id', loadGameById(), (req, res, next) => gameController.getById(req, res, next));
router.patch('/:id', loadGameById(), requireGameOwner(), (req, res, next) => gameController.update(req, res, next));
router.delete('/:id', loadGameById(), requireGameOwner(), (req, res, next) => gameController.remove(req, res, next));

export default router;
