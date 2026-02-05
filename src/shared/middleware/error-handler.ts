import { NextFunction, Request, Response } from 'express';

import { AppError } from '../errors/AppError';

function serializeError(error: AppError, path: string) {
  return {
    error: {
      code: error.code,
      category: error.category,
      message: error.message,
      status: error.statusCode,
      details: error.details ?? null,
      context: error.context ?? null,
      path,
      timestamp: new Date().toISOString()
    }
  };
}

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  if (res.headersSent) {
    res.end();
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json(serializeError(err, req.originalUrl));
    return;
  }

  console.error('Unexpected error', err);
  const fallback = new AppError({ code: 'SYSTEM.INTERNAL_ERROR' });
  res.status(fallback.statusCode).json(serializeError(fallback, req.originalUrl));
}
