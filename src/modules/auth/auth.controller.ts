import { NextFunction, Request, Response } from 'express';

import { authService } from './auth.service';

class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await authService.register(email, password);

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
