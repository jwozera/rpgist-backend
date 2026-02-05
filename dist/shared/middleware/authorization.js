"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadGameById = exports.requireGameOwner = exports.requireSelfUser = exports.requireAuth = void 0;
const auth_middleware_1 = require("../../modules/auth/auth.middleware");
const game_model_1 = require("../../modules/game/game.model");
const AppError_1 = require("../errors/AppError");
const requireAuth = (req, res, next) => (0, auth_middleware_1.authenticate)(req, res, next);
exports.requireAuth = requireAuth;
function requireSelfUser(extractTargetId) {
    return (req, _res, next) => {
        const requesterId = req.userId;
        if (!requesterId) {
            next(new AppError_1.AppError({ code: 'AUTH.UNAUTHORIZED' }));
            return;
        }
        const targetId = extractTargetId ? extractTargetId(req) : req.params.id;
        if (!targetId) {
            next(new AppError_1.AppError({ code: 'REQUEST.INVALID_IDENTIFIER', message: 'Invalid user id' }));
            return;
        }
        if (targetId !== requesterId) {
            next(new AppError_1.AppError({ code: 'AUTH.FORBIDDEN' }));
            return;
        }
        next();
    };
}
exports.requireSelfUser = requireSelfUser;
function requireGameOwner(_paramKey = 'id') {
    return (req, res, next) => {
        const requesterId = req.userId;
        if (!requesterId) {
            next(new AppError_1.AppError({ code: 'AUTH.UNAUTHORIZED' }));
            return;
        }
        const game = res.locals.game;
        if (!game) {
            next(new AppError_1.AppError({ code: 'GAME.NOT_LOADED' }));
            return;
        }
        if (game.ownerUserId !== requesterId) {
            next(new AppError_1.AppError({ code: 'AUTH.FORBIDDEN' }));
            return;
        }
        next();
    };
}
exports.requireGameOwner = requireGameOwner;
function loadGameById(paramKey = 'id') {
    return async (req, res, next) => {
        const gameId = req.params[paramKey];
        if (!gameId) {
            next(new AppError_1.AppError({ code: 'REQUEST.INVALID_IDENTIFIER', message: 'Invalid game id' }));
            return;
        }
        try {
            const game = await game_model_1.Game.findByPk(gameId);
            if (!game) {
                next(new AppError_1.AppError({ code: 'GAME.NOT_FOUND' }));
                return;
            }
            res.locals.game = game;
            next();
        }
        catch (error) {
            next(error);
        }
    };
}
exports.loadGameById = loadGameById;
