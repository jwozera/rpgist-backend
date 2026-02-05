import { NextFunction, Request, Response } from 'express';

import { AppError } from '../../shared/errors/AppError';

import { gameCharacterService } from './gameCharacter.service';
import { GameCharacterStateUpdateInput } from './gameCharacter.types';

class GameCharacterController {
  async requestJoin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const { gameId, characterId } = this.parseJoinPayload(req.body);
      const membership = await gameCharacterService.requestJoin(userId, { gameId, characterId });
      res.status(201).json({ membership });
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const gameId = this.parseOptionalUuid(req.query.gameId);

      if (gameId) {
        const memberships = await gameCharacterService.listForGame(userId, gameId);
        res.json({ memberships });
        return;
      }

      const memberships = await gameCharacterService.listForUser(userId);
      res.json({ memberships });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const id = this.getIdFromRequest(req.params.id);
      const membership = await gameCharacterService.getById(id, userId);
      res.json({ membership });
    } catch (error) {
      next(error);
    }
  }

  async approve(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const id = this.getIdFromRequest(req.params.id);
      const membership = await gameCharacterService.approve(id, userId);
      res.json({ membership });
    } catch (error) {
      next(error);
    }
  }

  async reject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const id = this.getIdFromRequest(req.params.id);
      const membership = await gameCharacterService.reject(id, userId);
      res.json({ membership });
    } catch (error) {
      next(error);
    }
  }

  async updateState(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const id = this.getIdFromRequest(req.params.id);
      const payload = this.parseStatePayload(req.body);
      const membership = await gameCharacterService.updateState(id, userId, payload);
      res.json({ membership });
    } catch (error) {
      next(error);
    }
  }

  private getUserId(req: Request): string {
    const { userId } = req;

    if (!userId) {
      throw new AppError({ code: 'AUTH.UNAUTHORIZED' });
    }

    return userId;
  }

  private getIdFromRequest(raw: unknown): string {
    if (typeof raw !== 'string' || !this.isUuid(raw)) {
      throw new AppError({ code: 'REQUEST.INVALID_IDENTIFIER' });
    }

    return raw;
  }

  private parseJoinPayload(body: unknown): { gameId: string; characterId: string } {
    if (!body || typeof body !== 'object') {
      throw new AppError({ code: 'REQUEST.INVALID_BODY' });
    }

    const payload = body as Record<string, unknown>;
    const { gameId, characterId } = payload;

    if (typeof gameId !== 'string' || !this.isUuid(gameId)) {
      throw new AppError({
        code: 'REQUEST.INVALID_IDENTIFIER',
        message: 'gameId must be a valid UUID'
      });
    }

    if (typeof characterId !== 'string' || !this.isUuid(characterId)) {
      throw new AppError({
        code: 'REQUEST.INVALID_IDENTIFIER',
        message: 'characterId must be a valid UUID'
      });
    }

    return { gameId, characterId };
  }

  private parseOptionalUuid(raw: unknown): string | undefined {
    if (raw === undefined) {
      return undefined;
    }

    if (Array.isArray(raw)) {
      throw new AppError({ code: 'REQUEST.MULTIPLE_VALUES_NOT_ALLOWED' });
    }

    if (typeof raw !== 'string' || raw.length === 0) {
      throw new AppError({ code: 'REQUEST.INVALID_IDENTIFIER' });
    }

    if (!this.isUuid(raw)) {
      throw new AppError({ code: 'REQUEST.INVALID_IDENTIFIER' });
    }

    return raw;
  }

  private parseStatePayload(body: unknown): GameCharacterStateUpdateInput {
    if (!body || typeof body !== 'object') {
      throw new AppError({ code: 'REQUEST.INVALID_BODY' });
    }

    const payload = body as Record<string, unknown>;
    const result: GameCharacterStateUpdateInput = {};

    if ('hpCurrent' in payload) {
      const value = payload.hpCurrent;

      if (value !== null && value !== undefined && typeof value !== 'number') {
        throw new AppError({
          code: 'REQUEST.VALIDATION_FAILED',
          message: 'hpCurrent must be a number or null'
        });
      }

      result.hpCurrent = value as number | null | undefined;
    }

    if ('hpTotal' in payload) {
      const value = payload.hpTotal;

      if (value !== null && value !== undefined && typeof value !== 'number') {
        throw new AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'hpTotal must be a number or null' });
      }

      result.hpTotal = value as number | null | undefined;
    }

    if ('conditions' in payload) {
      const value = payload.conditions;

      if (value !== null && !Array.isArray(value)) {
        throw new AppError({
          code: 'REQUEST.VALIDATION_FAILED',
          message: 'conditions must be an array of strings or null'
        });
      }

      if (Array.isArray(value) && !value.every((item) => typeof item === 'string')) {
        throw new AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'conditions must be an array of strings' });
      }

      result.conditions = Array.isArray(value) ? (value as string[]) : [];
    }

    if ('temporaryModifiers' in payload) {
      const value = payload.temporaryModifiers;

      if (value !== null && (typeof value !== 'object' || Array.isArray(value))) {
        throw new AppError({
          code: 'REQUEST.VALIDATION_FAILED',
          message: 'temporaryModifiers must be an object or null'
        });
      }

      result.temporaryModifiers = (value as Record<string, unknown>) ?? null;
    }

    if (Object.keys(result).length === 0) {
      throw new AppError({ code: 'REQUEST.EMPTY_UPDATE', message: 'At least one property must be provided' });
    }

    return result;
  }

  private isUuid(value: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  }
}

export const gameCharacterController = new GameCharacterController();
