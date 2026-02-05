import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { AppError } from '../../shared/errors/AppError';

interface TokenPayload {
  userId: string;
  iat: number;
  exp: number;
}

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  try {
    const header = req.headers.authorization;

    if (!header) {
      throw new AppError({ code: 'AUTH.MISSING_AUTH_HEADER' });
    }

    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new AppError({ code: 'AUTH.INVALID_AUTH_SCHEME' });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new AppError({ code: 'AUTH.JWT_SECRET_MISSING' });
    }

    const decoded = jwt.verify(token, secret) as TokenPayload;

    if (!decoded.userId) {
      throw new AppError({ code: 'AUTH.INVALID_TOKEN_PAYLOAD' });
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError({ code: 'AUTH.INVALID_TOKEN' }));
      return;
    }

    next(error);
  }
}
