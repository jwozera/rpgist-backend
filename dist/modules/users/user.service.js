"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const AppError_1 = require("../../shared/errors/AppError");
const user_model_1 = require("./user.model");
class UserService {
    async findById(id) {
        return user_model_1.User.findByPk(id);
    }
    async findByEmail(email) {
        return user_model_1.User.findOne({ where: { email } });
    }
    async create(email, passwordHash) {
        return user_model_1.User.create({ email, passwordHash });
    }
    async updateUser(id, input) {
        const user = await user_model_1.User.findByPk(id);
        if (!user) {
            throw new AppError_1.AppError({ code: 'USER.NOT_FOUND' });
        }
        if (input.email !== undefined) {
            const normalizedEmail = this.normalizeEmail(input.email);
            if (normalizedEmail !== user.email) {
                const existing = await user_model_1.User.findOne({ where: { email: normalizedEmail }, attributes: ['id'] });
                if (existing && existing.id !== user.id) {
                    throw new AppError_1.AppError({ code: 'AUTH.EMAIL_ALREADY_REGISTERED' });
                }
                user.email = normalizedEmail;
            }
        }
        if (input.displayName !== undefined) {
            user.displayName = input.displayName;
        }
        if (input.password !== undefined) {
            user.passwordHash = await this.hashPassword(input.password);
        }
        await user.save();
        return user;
    }
    async deleteUser(id) {
        const user = await user_model_1.User.findByPk(id);
        if (!user) {
            throw new AppError_1.AppError({ code: 'USER.NOT_FOUND' });
        }
        await user.destroy();
    }
    toResponse(user) {
        const json = user.toJSON();
        return {
            id: json.id,
            email: json.email,
            displayName: json.displayName ?? null,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
    }
    normalizeEmail(email) {
        const normalized = email.trim().toLowerCase();
        if (!normalized) {
            throw new AppError_1.AppError({ code: 'USER.EMAIL_REQUIRED' });
        }
        return normalized;
    }
    async hashPassword(password) {
        if (!password || password.length < 8) {
            throw new AppError_1.AppError({ code: 'USER.PASSWORD_TOO_SHORT' });
        }
        const saltRoundsEnv = process.env.BCRYPT_SALT_ROUNDS;
        const rounds = saltRoundsEnv ? Number.parseInt(saltRoundsEnv, 10) : 10;
        if (!Number.isInteger(rounds) || rounds < 4) {
            throw new AppError_1.AppError({ code: 'SYSTEM.INVALID_CONFIG', message: 'Invalid bcrypt salt rounds configuration' });
        }
        return bcrypt_1.default.hash(password, rounds);
    }
}
exports.userService = new UserService();
