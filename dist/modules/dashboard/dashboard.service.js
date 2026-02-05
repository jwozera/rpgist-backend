"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardService = void 0;
const AppError_1 = require("../../shared/errors/AppError");
const character_service_1 = require("../character/character.service");
const game_service_1 = require("../game/game.service");
const user_service_1 = require("../users/user.service");
class DashboardService {
    async get(userId) {
        const user = await user_service_1.userService.findById(userId);
        if (!user) {
            throw new AppError_1.AppError({ code: 'USER.NOT_FOUND' });
        }
        const userInfo = user_service_1.userService.toResponse(user);
        const characters = await character_service_1.characterService.list(userId);
        const games = await game_service_1.gameService.listByOwner(userId);
        return {
            user: userInfo,
            characters,
            games
        };
    }
}
exports.dashboardService = new DashboardService();
