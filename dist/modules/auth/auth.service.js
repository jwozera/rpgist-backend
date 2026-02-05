"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = require("../../shared/errors/AppError");
const user_service_1 = require("../users/user.service");
const DEFAULT_SALT_ROUNDS = 10;
class AuthService {
    async register(email, password) {
        const normalizedEmail = this.normalizeEmail(email);
        const existing = await user_service_1.userService.findByEmail(normalizedEmail);
        if (existing) {
            throw new AppError_1.AppError({ code: 'AUTH.EMAIL_ALREADY_REGISTERED' });
        }
        const passwordHash = await this.hashPassword(password);
        const user = await user_service_1.userService.create(normalizedEmail, passwordHash);
        const token = this.generateToken(user.id);
        return { token, user: user_service_1.userService.toResponse(user) };
    }
    async login(email, password) {
        const normalizedEmail = this.normalizeEmail(email);
        const user = await user_service_1.userService.findByEmail(normalizedEmail);
        if (!user) {
            throw new AppError_1.AppError({ code: 'AUTH.INVALID_CREDENTIALS' });
        }
        const isValid = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!isValid) {
            throw new AppError_1.AppError({ code: 'AUTH.INVALID_CREDENTIALS' });
        }
        const token = this.generateToken(user.id);
        return { token, user: user_service_1.userService.toResponse(user) };
    }
    normalizeEmail(email) {
        if (!email) {
            throw new AppError_1.AppError({ code: 'USER.EMAIL_REQUIRED' });
        }
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
        const rounds = saltRoundsEnv ? Number.parseInt(saltRoundsEnv, 10) : DEFAULT_SALT_ROUNDS;
        if (!Number.isInteger(rounds) || rounds < 4) {
            throw new AppError_1.AppError({ code: 'SYSTEM.INVALID_CONFIG', message: 'Invalid bcrypt salt rounds configuration' });
        }
        return bcrypt_1.default.hash(password, rounds);
    }
    generateToken(userId) {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new AppError_1.AppError({ code: 'AUTH.JWT_SECRET_MISSING' });
        }
        const expiresIn = process.env.JWT_EXPIRES_IN ?? '1h';
        const options = {
            expiresIn: (Number.isNaN(Number(expiresIn)) ? expiresIn : Number(expiresIn))
        };
        return jsonwebtoken_1.default.sign({ userId }, secret, options);
    }
}
exports.authService = new AuthService();
