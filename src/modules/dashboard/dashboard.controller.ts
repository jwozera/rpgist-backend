import { NextFunction, Request, Response } from 'express';

import { AppError } from '../../shared/errors/AppError';
import { dashboardService } from './dashboard.service';

class DashboardController {
  async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const data = await dashboardService.get(userId);
      res.json(data);
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
}

export const dashboardController = new DashboardController();
