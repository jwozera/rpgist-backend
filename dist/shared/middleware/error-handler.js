"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const AppError_1 = require("../errors/AppError");
function serializeError(error, path) {
    return {
        error: {
            code: error.code,
            category: error.category,
            message: error.message,
            status: error.statusCode,
            details: error.details ?? null,
            context: error.context ?? null,
            path,
            timestamp: new Date().toISOString()
        }
    };
}
function errorHandler(err, req, res, _next) {
    if (res.headersSent) {
        res.end();
        return;
    }
    if (err instanceof AppError_1.AppError) {
        res.status(err.statusCode).json(serializeError(err, req.originalUrl));
        return;
    }
    console.error('Unexpected error', err);
    const fallback = new AppError_1.AppError({ code: 'SYSTEM.INTERNAL_ERROR' });
    res.status(fallback.statusCode).json(serializeError(fallback, req.originalUrl));
}
exports.errorHandler = errorHandler;
