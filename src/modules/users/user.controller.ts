import { NextFunction, Request, Response } from 'express';

import { AppError } from '../../shared/errors/AppError';
import { userService } from './user.service';

class UserController {
  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const user = await userService.findById(userId);

      if (!user) {
        throw new AppError({ code: 'USER.NOT_FOUND' });
      }

      res.json({ user: userService.toResponse(user) });
    } catch (error) {
      next(error);
    }
  }

  async updateMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const updates = this.parseUpdatePayload(req.body);
      const user = await userService.updateUser(userId, updates);
      res.json({ user: userService.toResponse(user) });
    } catch (error) {
      next(error);
    }
  }

  async deleteMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = this.getUserId(req);
      await userService.deleteUser(userId);
      res.status(204).send();
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

  private parseUpdatePayload(body: unknown): { displayName?: string | null; email?: string; password?: string } {
    if (!body || typeof body !== 'object') {
      throw new AppError({ code: 'REQUEST.INVALID_BODY' });
    }

    const rawPayload = body as Record<string, unknown>;
    const allowedKeys = ['displayName', 'email', 'password'];
    const unknownKeys = Object.keys(rawPayload).filter((key) => !allowedKeys.includes(key));

    if (unknownKeys.length > 0) {
      throw new AppError({ code: 'REQUEST.UNKNOWN_FIELDS', message: `Invalid fields: ${unknownKeys.join(', ')}` });
    }

    const payload: { displayName?: string | null; email?: string; password?: string } = {};

    if (rawPayload.displayName !== undefined) {
      if (rawPayload.displayName === null) {
        payload.displayName = null;
      } else if (typeof rawPayload.displayName === 'string') {
        const trimmed = rawPayload.displayName.trim();

        if (!trimmed) {
          throw new AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'Field displayName must be a non-empty string' });
        }

        payload.displayName = trimmed;
      } else {
        throw new AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'Field displayName must be a string' });
      }
    }

    if (rawPayload.email !== undefined) {
      if (typeof rawPayload.email !== 'string') {
        throw new AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'Field email must be a string' });
      }

      const normalized = rawPayload.email.trim().toLowerCase();

      if (!normalized) {
        throw new AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'Field email must be a non-empty string' });
      }

      payload.email = normalized;
    }

    if (rawPayload.password !== undefined) {
      if (typeof rawPayload.password !== 'string') {
        throw new AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'Field password must be a string' });
      }

      if (rawPayload.password.length < 8) {
        throw new AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'Field password must be at least 8 characters long' });
      }

      payload.password = rawPayload.password;
    }

    if (!Object.keys(payload).length) {
      throw new AppError({ code: 'REQUEST.EMPTY_UPDATE', message: 'At least one field (displayName, email, password) must be provided' });
    }

    return payload;
  }
}

export const userController = new UserController();
