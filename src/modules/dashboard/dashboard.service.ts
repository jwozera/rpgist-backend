import { AppError } from '../../shared/errors/AppError';
import { characterService } from '../character/character.service';
import { gameService } from '../game/game.service';
import { userService } from '../users/user.service';

class DashboardService {
  async get(userId: string) {
    const user = await userService.findById(userId);

    if (!user) {
      throw new AppError({ code: 'USER.NOT_FOUND' });
    }

    const userInfo = userService.toResponse(user);
    const characters = await characterService.list(userId);
    const games = await gameService.listByOwner(userId);

    return {
      user: userInfo,
      characters,
      games
    };
  }
}

export const dashboardService = new DashboardService();
