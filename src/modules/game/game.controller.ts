import { NextFunction, Request, Response } from 'express';

import { AppError } from '../../shared/errors/AppError';

import { gameService, GameUpdateInput } from './game.service';
import { Game } from './game.model';
import { GameInput, isValidGameStatus } from './game.types';

class GameController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ownerUserId = this.getUserId(req);
      const payload = this.parsePayload(req.body);
      const game = await gameService.create(ownerUserId, payload);
      res.status(201).json({ game });
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ownerUserId = this.getUserId(req);
      const games = await gameService.listByOwner(ownerUserId);
      res.json({ games });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const loadedGame = this.getLoadedGame(res);
      res.json({ game: gameService.toResponse(loadedGame) });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      this.getUserId(req);
      const game = this.getLoadedGame(res);
      const payload = this.parseUpdatePayload(req.body);
      const updated = await gameService.update(game, payload);
      res.json({ game: updated });
    } catch (error) {
      next(error);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      this.getUserId(req);
      const game = this.getLoadedGame(res);
      await gameService.delete(game);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  private parsePayload(body: unknown): GameInput {
    if (!body || typeof body !== 'object') {
      throw new AppError({ code: 'REQUEST.INVALID_BODY' });
    }

    const payload = body as Partial<GameInput>;

    if (!payload.name || typeof payload.name !== 'string' || !payload.name.trim()) {
      throw new AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'Field name is required' });
    }

    if (payload.description === undefined) {
      throw new AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'Field description is required' });
    }

    if (payload.description !== null && typeof payload.description !== 'string') {
      throw new AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'Field description must be a string or null' });
    }

    if (payload.status !== undefined) {
      if (typeof payload.status !== 'string' || !isValidGameStatus(payload.status)) {
        throw new AppError({
          code: 'REQUEST.VALIDATION_FAILED',
          message: 'Field status must be one of draft, active, archived'
        });
      }
    }

    return {
      name: payload.name.trim(),
      description: payload.description === null ? null : payload.description,
      status: payload.status
    };
  }

  private getUserId(req: Request): string {
    const { userId } = req;

    if (!userId) {
      throw new AppError({ code: 'AUTH.UNAUTHORIZED' });
    }

    return userId;
  }

  private getLoadedGame(res: Response): Game {
    const game = res.locals.game as Game | undefined;

    if (!game) {
      throw new AppError({ code: 'GAME.NOT_LOADED' });
    }

    return game;
  }

  private parseUpdatePayload(body: unknown): GameUpdateInput {
    if (!body || typeof body !== 'object') {
      throw new AppError({ code: 'REQUEST.INVALID_BODY' });
    }

    const rawPayload = body as Record<string, unknown>;
    const allowedKeys = ['name', 'description', 'status'];
    const unknownKeys = Object.keys(rawPayload).filter((key) => !allowedKeys.includes(key));

    if (unknownKeys.length > 0) {
      throw new AppError({ code: 'REQUEST.UNKNOWN_FIELDS', message: `Invalid fields: ${unknownKeys.join(', ')}` });
    }

    const payload: GameUpdateInput = {};

    if (rawPayload.name !== undefined) {
      if (typeof rawPayload.name !== 'string' || !rawPayload.name.trim()) {
        throw new AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'Field name must be a non-empty string' });
      }

      payload.name = rawPayload.name.trim();
    }

    if (rawPayload.description !== undefined) {
      if (rawPayload.description !== null && typeof rawPayload.description !== 'string') {
        throw new AppError({
          code: 'REQUEST.VALIDATION_FAILED',
          message: 'Field description must be a string or null'
        });
      }

      payload.description = rawPayload.description === null ? null : rawPayload.description;
    }

    if (rawPayload.status !== undefined) {
      if (typeof rawPayload.status !== 'string' || !isValidGameStatus(rawPayload.status)) {
        throw new AppError({
          code: 'REQUEST.VALIDATION_FAILED',
          message: 'Field status must be one of draft, active, archived'
        });
      }

      payload.status = rawPayload.status;
    }

    if (!Object.keys(payload).length) {
      throw new AppError({
        code: 'REQUEST.EMPTY_UPDATE',
        message: 'At least one field (name, description, status) must be provided'
      });
    }

    return payload;
  }
}

export const gameController = new GameController();
