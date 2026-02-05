"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameController = void 0;
const AppError_1 = require("../../shared/errors/AppError");
const game_service_1 = require("./game.service");
const game_types_1 = require("./game.types");
class GameController {
    async create(req, res, next) {
        try {
            const ownerUserId = this.getUserId(req);
            const payload = this.parsePayload(req.body);
            const game = await game_service_1.gameService.create(ownerUserId, payload);
            res.status(201).json({ game });
        }
        catch (error) {
            next(error);
        }
    }
    async list(req, res, next) {
        try {
            const ownerUserId = this.getUserId(req);
            const games = await game_service_1.gameService.listByOwner(ownerUserId);
            res.json({ games });
        }
        catch (error) {
            next(error);
        }
    }
    async getById(req, res, next) {
        try {
            const loadedGame = this.getLoadedGame(res);
            res.json({ game: game_service_1.gameService.toResponse(loadedGame) });
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            this.getUserId(req);
            const game = this.getLoadedGame(res);
            const payload = this.parseUpdatePayload(req.body);
            const updated = await game_service_1.gameService.update(game, payload);
            res.json({ game: updated });
        }
        catch (error) {
            next(error);
        }
    }
    async remove(req, res, next) {
        try {
            this.getUserId(req);
            const game = this.getLoadedGame(res);
            await game_service_1.gameService.delete(game);
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
    parsePayload(body) {
        if (!body || typeof body !== 'object') {
            throw new AppError_1.AppError({ code: 'REQUEST.INVALID_BODY' });
        }
        const payload = body;
        if (!payload.name || typeof payload.name !== 'string' || !payload.name.trim()) {
            throw new AppError_1.AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'Field name is required' });
        }
        if (payload.description === undefined) {
            throw new AppError_1.AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'Field description is required' });
        }
        if (payload.description !== null && typeof payload.description !== 'string') {
            throw new AppError_1.AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'Field description must be a string or null' });
        }
        if (payload.status !== undefined) {
            if (typeof payload.status !== 'string' || !(0, game_types_1.isValidGameStatus)(payload.status)) {
                throw new AppError_1.AppError({
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
    getUserId(req) {
        const { userId } = req;
        if (!userId) {
            throw new AppError_1.AppError({ code: 'AUTH.UNAUTHORIZED' });
        }
        return userId;
    }
    getLoadedGame(res) {
        const game = res.locals.game;
        if (!game) {
            throw new AppError_1.AppError({ code: 'GAME.NOT_LOADED' });
        }
        return game;
    }
    parseUpdatePayload(body) {
        if (!body || typeof body !== 'object') {
            throw new AppError_1.AppError({ code: 'REQUEST.INVALID_BODY' });
        }
        const rawPayload = body;
        const allowedKeys = ['name', 'description', 'status'];
        const unknownKeys = Object.keys(rawPayload).filter((key) => !allowedKeys.includes(key));
        if (unknownKeys.length > 0) {
            throw new AppError_1.AppError({ code: 'REQUEST.UNKNOWN_FIELDS', message: `Invalid fields: ${unknownKeys.join(', ')}` });
        }
        const payload = {};
        if (rawPayload.name !== undefined) {
            if (typeof rawPayload.name !== 'string' || !rawPayload.name.trim()) {
                throw new AppError_1.AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'Field name must be a non-empty string' });
            }
            payload.name = rawPayload.name.trim();
        }
        if (rawPayload.description !== undefined) {
            if (rawPayload.description !== null && typeof rawPayload.description !== 'string') {
                throw new AppError_1.AppError({
                    code: 'REQUEST.VALIDATION_FAILED',
                    message: 'Field description must be a string or null'
                });
            }
            payload.description = rawPayload.description === null ? null : rawPayload.description;
        }
        if (rawPayload.status !== undefined) {
            if (typeof rawPayload.status !== 'string' || !(0, game_types_1.isValidGameStatus)(rawPayload.status)) {
                throw new AppError_1.AppError({
                    code: 'REQUEST.VALIDATION_FAILED',
                    message: 'Field status must be one of draft, active, archived'
                });
            }
            payload.status = rawPayload.status;
        }
        if (!Object.keys(payload).length) {
            throw new AppError_1.AppError({
                code: 'REQUEST.EMPTY_UPDATE',
                message: 'At least one field (name, description, status) must be provided'
            });
        }
        return payload;
    }
}
exports.gameController = new GameController();
