"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_service_1 = require("./auth.service");
class AuthController {
    async register(req, res, next) {
        try {
            const { email, password } = req.body;
            const result = await auth_service_1.authService.register(email, password);
            res.status(201).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const result = await auth_service_1.authService.login(email, password);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.authController = new AuthController();
