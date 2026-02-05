"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = require("../../shared/errors/AppError");
function authenticate(req, _res, next) {
    try {
        const header = req.headers.authorization;
        if (!header) {
            throw new AppError_1.AppError({ code: 'AUTH.MISSING_AUTH_HEADER' });
        }
        const [scheme, token] = header.split(' ');
        if (scheme !== 'Bearer' || !token) {
            throw new AppError_1.AppError({ code: 'AUTH.INVALID_AUTH_SCHEME' });
        }
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new AppError_1.AppError({ code: 'AUTH.JWT_SECRET_MISSING' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        if (!decoded.userId) {
            throw new AppError_1.AppError({ code: 'AUTH.INVALID_TOKEN_PAYLOAD' });
        }
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            next(new AppError_1.AppError({ code: 'AUTH.INVALID_TOKEN' }));
            return;
        }
        next(error);
    }
}
exports.authenticate = authenticate;
