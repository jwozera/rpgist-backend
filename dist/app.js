"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("./config/swagger"));
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const character_routes_1 = __importDefault(require("./modules/character/character.routes"));
const dashboard_routes_1 = __importDefault(require("./modules/dashboard/dashboard.routes"));
const game_routes_1 = __importDefault(require("./modules/game/game.routes"));
const gameCharacter_routes_1 = __importDefault(require("./modules/game-character/gameCharacter.routes"));
const user_routes_1 = __importDefault(require("./modules/users/user.routes"));
const error_handler_1 = require("./shared/middleware/error-handler");
const not_found_handler_1 = require("./shared/middleware/not-found-handler");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const corsOrigins = (process.env.CORS_ORIGIN ?? '*')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
app.use((req, res, next) => {
    const origin = req.header('Origin');
    const allowAll = corsOrigins.includes('*');
    if (allowAll) {
        res.header('Access-Control-Allow-Origin', '*');
    }
    else if (origin && corsOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Vary', 'Origin');
    }
    res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        res.status(204).end();
        return;
    }
    next();
});
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
});
app.use('/api/auth', auth_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/games', game_routes_1.default);
app.use('/api/game-characters', gameCharacter_routes_1.default);
app.use('/api/dashboard', dashboard_routes_1.default);
app.use('/api/characters', character_routes_1.default);
app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
app.use(not_found_handler_1.notFoundHandler);
app.use(error_handler_1.errorHandler);
exports.default = app;
