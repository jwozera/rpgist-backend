import { NextFunction, Request, RequestHandler, Response } from 'express';

import { authenticate } from '../../modules/auth/auth.middleware';
import { Game } from '../../modules/game/game.model';
import { AppError } from '../errors/AppError';

export const requireAuth: RequestHandler = (req, res, next) => authenticate(req, res, next);

export function requireSelfUser(extractTargetId?: (req: Request) => string | undefined): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    const requesterId = req.userId;

    if (!requesterId) {
      next(new AppError({ code: 'AUTH.UNAUTHORIZED' }));
      return;
    }

    const targetId = extractTargetId ? extractTargetId(req) : req.params.id;

    if (!targetId) {
      next(new AppError({ code: 'REQUEST.INVALID_IDENTIFIER', message: 'Invalid user id' }));
      return;
    }

    if (targetId !== requesterId) {
      next(new AppError({ code: 'AUTH.FORBIDDEN' }));
      return;
    }

    next();
  };
}

export function requireGameOwner(_paramKey = 'id'): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const requesterId = req.userId;

    if (!requesterId) {
      next(new AppError({ code: 'AUTH.UNAUTHORIZED' }));
      return;
    }

    const game = res.locals.game as Game | undefined;

    if (!game) {
      next(new AppError({ code: 'GAME.NOT_LOADED' }));
      return;
    }

    if (game.ownerUserId !== requesterId) {
      next(new AppError({ code: 'AUTH.FORBIDDEN' }));
      return;
    }

    next();
  };
}

export function loadGameById(paramKey = 'id'): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    const gameId = req.params[paramKey];

    if (!gameId) {
      next(new AppError({ code: 'REQUEST.INVALID_IDENTIFIER', message: 'Invalid game id' }));
      return;
    }

    try {
      const game = await Game.findByPk(gameId);

      if (!game) {
        next(new AppError({ code: 'GAME.NOT_FOUND' }));
        return;
      }

      res.locals.game = game;
      next();
    } catch (error) {
      next(error);
    }
  };
}
