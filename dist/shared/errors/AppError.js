"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
const error_catalog_1 = require("./error-catalog");
class AppError extends Error {
    constructor({ code, message, details, context, statusCodeOverride }) {
        const catalogEntry = error_catalog_1.ERROR_CATALOG[code];
        super(message ?? catalogEntry.defaultMessage);
        this.code = code;
        this.statusCode = statusCodeOverride ?? catalogEntry.statusCode;
        this.category = catalogEntry.category;
        this.details = details;
        this.context = context;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
exports.AppError = AppError;
