"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameCharacterController = void 0;
const AppError_1 = require("../../shared/errors/AppError");
const gameCharacter_service_1 = require("./gameCharacter.service");
class GameCharacterController {
    async requestJoin(req, res, next) {
        try {
            const userId = this.getUserId(req);
            const { gameId, characterId } = this.parseJoinPayload(req.body);
            const membership = await gameCharacter_service_1.gameCharacterService.requestJoin(userId, { gameId, characterId });
            res.status(201).json({ membership });
        }
        catch (error) {
            next(error);
        }
    }
    async list(req, res, next) {
        try {
            const userId = this.getUserId(req);
            const gameId = this.parseOptionalUuid(req.query.gameId);
            if (gameId) {
                const memberships = await gameCharacter_service_1.gameCharacterService.listForGame(userId, gameId);
                res.json({ memberships });
                return;
            }
            const memberships = await gameCharacter_service_1.gameCharacterService.listForUser(userId);
            res.json({ memberships });
        }
        catch (error) {
            next(error);
        }
    }
    async getById(req, res, next) {
        try {
            const userId = this.getUserId(req);
            const id = this.getIdFromRequest(req.params.id);
            const membership = await gameCharacter_service_1.gameCharacterService.getById(id, userId);
            res.json({ membership });
        }
        catch (error) {
            next(error);
        }
    }
    async approve(req, res, next) {
        try {
            const userId = this.getUserId(req);
            const id = this.getIdFromRequest(req.params.id);
            const membership = await gameCharacter_service_1.gameCharacterService.approve(id, userId);
            res.json({ membership });
        }
        catch (error) {
            next(error);
        }
    }
    async reject(req, res, next) {
        try {
            const userId = this.getUserId(req);
            const id = this.getIdFromRequest(req.params.id);
            const membership = await gameCharacter_service_1.gameCharacterService.reject(id, userId);
            res.json({ membership });
        }
        catch (error) {
            next(error);
        }
    }
    async updateState(req, res, next) {
        try {
            const userId = this.getUserId(req);
            const id = this.getIdFromRequest(req.params.id);
            const payload = this.parseStatePayload(req.body);
            const membership = await gameCharacter_service_1.gameCharacterService.updateState(id, userId, payload);
            res.json({ membership });
        }
        catch (error) {
            next(error);
        }
    }
    getUserId(req) {
        const { userId } = req;
        if (!userId) {
            throw new AppError_1.AppError({ code: 'AUTH.UNAUTHORIZED' });
        }
        return userId;
    }
    getIdFromRequest(raw) {
        if (typeof raw !== 'string' || !this.isUuid(raw)) {
            throw new AppError_1.AppError({ code: 'REQUEST.INVALID_IDENTIFIER' });
        }
        return raw;
    }
    parseJoinPayload(body) {
        if (!body || typeof body !== 'object') {
            throw new AppError_1.AppError({ code: 'REQUEST.INVALID_BODY' });
        }
        const payload = body;
        const { gameId, characterId } = payload;
        if (typeof gameId !== 'string' || !this.isUuid(gameId)) {
            throw new AppError_1.AppError({
                code: 'REQUEST.INVALID_IDENTIFIER',
                message: 'gameId must be a valid UUID'
            });
        }
        if (typeof characterId !== 'string' || !this.isUuid(characterId)) {
            throw new AppError_1.AppError({
                code: 'REQUEST.INVALID_IDENTIFIER',
                message: 'characterId must be a valid UUID'
            });
        }
        return { gameId, characterId };
    }
    parseOptionalUuid(raw) {
        if (raw === undefined) {
            return undefined;
        }
        if (Array.isArray(raw)) {
            throw new AppError_1.AppError({ code: 'REQUEST.MULTIPLE_VALUES_NOT_ALLOWED' });
        }
        if (typeof raw !== 'string' || raw.length === 0) {
            throw new AppError_1.AppError({ code: 'REQUEST.INVALID_IDENTIFIER' });
        }
        if (!this.isUuid(raw)) {
            throw new AppError_1.AppError({ code: 'REQUEST.INVALID_IDENTIFIER' });
        }
        return raw;
    }
    parseStatePayload(body) {
        if (!body || typeof body !== 'object') {
            throw new AppError_1.AppError({ code: 'REQUEST.INVALID_BODY' });
        }
        const payload = body;
        const result = {};
        if ('hpCurrent' in payload) {
            const value = payload.hpCurrent;
            if (value !== null && value !== undefined && typeof value !== 'number') {
                throw new AppError_1.AppError({
                    code: 'REQUEST.VALIDATION_FAILED',
                    message: 'hpCurrent must be a number or null'
                });
            }
            result.hpCurrent = value;
        }
        if ('hpTotal' in payload) {
            const value = payload.hpTotal;
            if (value !== null && value !== undefined && typeof value !== 'number') {
                throw new AppError_1.AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'hpTotal must be a number or null' });
            }
            result.hpTotal = value;
        }
        if ('conditions' in payload) {
            const value = payload.conditions;
            if (value !== null && !Array.isArray(value)) {
                throw new AppError_1.AppError({
                    code: 'REQUEST.VALIDATION_FAILED',
                    message: 'conditions must be an array of strings or null'
                });
            }
            if (Array.isArray(value) && !value.every((item) => typeof item === 'string')) {
                throw new AppError_1.AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'conditions must be an array of strings' });
            }
            result.conditions = Array.isArray(value) ? value : [];
        }
        if ('temporaryModifiers' in payload) {
            const value = payload.temporaryModifiers;
            if (value !== null && (typeof value !== 'object' || Array.isArray(value))) {
                throw new AppError_1.AppError({
                    code: 'REQUEST.VALIDATION_FAILED',
                    message: 'temporaryModifiers must be an object or null'
                });
            }
            result.temporaryModifiers = value ?? null;
        }
        if (Object.keys(result).length === 0) {
            throw new AppError_1.AppError({ code: 'REQUEST.EMPTY_UPDATE', message: 'At least one property must be provided' });
        }
        return result;
    }
    isUuid(value) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(value);
    }
}
exports.gameCharacterController = new GameCharacterController();
