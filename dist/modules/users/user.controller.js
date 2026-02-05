"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const AppError_1 = require("../../shared/errors/AppError");
const user_service_1 = require("./user.service");
class UserController {
    async me(req, res, next) {
        try {
            const userId = this.getUserId(req);
            const user = await user_service_1.userService.findById(userId);
            if (!user) {
                throw new AppError_1.AppError({ code: 'USER.NOT_FOUND' });
            }
            res.json({ user: user_service_1.userService.toResponse(user) });
        }
        catch (error) {
            next(error);
        }
    }
    async updateMe(req, res, next) {
        try {
            const userId = this.getUserId(req);
            const updates = this.parseUpdatePayload(req.body);
            const user = await user_service_1.userService.updateUser(userId, updates);
            res.json({ user: user_service_1.userService.toResponse(user) });
        }
        catch (error) {
            next(error);
        }
    }
    async deleteMe(req, res, next) {
        try {
            const userId = this.getUserId(req);
            await user_service_1.userService.deleteUser(userId);
            res.status(204).send();
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
    parseUpdatePayload(body) {
        if (!body || typeof body !== 'object') {
            throw new AppError_1.AppError({ code: 'REQUEST.INVALID_BODY' });
        }
        const rawPayload = body;
        const allowedKeys = ['displayName', 'email', 'password'];
        const unknownKeys = Object.keys(rawPayload).filter((key) => !allowedKeys.includes(key));
        if (unknownKeys.length > 0) {
            throw new AppError_1.AppError({ code: 'REQUEST.UNKNOWN_FIELDS', message: `Invalid fields: ${unknownKeys.join(', ')}` });
        }
        const payload = {};
        if (rawPayload.displayName !== undefined) {
            if (rawPayload.displayName === null) {
                payload.displayName = null;
            }
            else if (typeof rawPayload.displayName === 'string') {
                const trimmed = rawPayload.displayName.trim();
                if (!trimmed) {
                    throw new AppError_1.AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'Field displayName must be a non-empty string' });
                }
                payload.displayName = trimmed;
            }
            else {
                throw new AppError_1.AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'Field displayName must be a string' });
            }
        }
        if (rawPayload.email !== undefined) {
            if (typeof rawPayload.email !== 'string') {
                throw new AppError_1.AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'Field email must be a string' });
            }
            const normalized = rawPayload.email.trim().toLowerCase();
            if (!normalized) {
                throw new AppError_1.AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'Field email must be a non-empty string' });
            }
            payload.email = normalized;
        }
        if (rawPayload.password !== undefined) {
            if (typeof rawPayload.password !== 'string') {
                throw new AppError_1.AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'Field password must be a string' });
            }
            if (rawPayload.password.length < 8) {
                throw new AppError_1.AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'Field password must be at least 8 characters long' });
            }
            payload.password = rawPayload.password;
        }
        if (!Object.keys(payload).length) {
            throw new AppError_1.AppError({ code: 'REQUEST.EMPTY_UPDATE', message: 'At least one field (displayName, email, password) must be provided' });
        }
        return payload;
    }
}
exports.userController = new UserController();
