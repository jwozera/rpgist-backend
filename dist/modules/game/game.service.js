"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameService = void 0;
const game_model_1 = require("./game.model");
const AppError_1 = require("../../shared/errors/AppError");
class GameService {
    async create(ownerUserId, input) {
        const payload = {
            name: input.name,
            description: input.description,
            status: input.status ?? 'draft',
            ownerUserId
        };
        const game = await game_model_1.Game.create(payload);
        return this.toResponse(game);
    }
    async listByOwner(ownerUserId) {
        const games = await game_model_1.Game.findAll({ where: { ownerUserId }, order: [['createdAt', 'DESC']] });
        return games.map((game) => this.toResponse(game));
    }
    async getById(id, ownerUserId) {
        const game = await game_model_1.Game.findOne({ where: { id, ownerUserId } });
        if (!game) {
            throw new AppError_1.AppError({ code: 'GAME.NOT_FOUND' });
        }
        return this.toResponse(game);
    }
    async update(game, input) {
        if (input.name !== undefined) {
            game.name = input.name;
        }
        if (input.description !== undefined) {
            game.description = input.description;
        }
        if (input.status !== undefined) {
            game.status = input.status;
        }
        await game.save();
        return this.toResponse(game);
    }
    async delete(game) {
        await game.destroy();
    }
    toResponse(game) {
        const json = game.toJSON();
        return {
            id: json.id,
            name: json.name,
            description: json.description ?? null,
            status: json.status,
            ownerUserId: json.ownerUserId,
            createdAt: game.createdAt,
            updatedAt: game.updatedAt
        };
    }
}
exports.gameService = new GameService();
