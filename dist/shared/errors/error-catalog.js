"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_CATALOG = void 0;
exports.ERROR_CATALOG = {
    'AUTH.UNAUTHORIZED': {
        category: 'auth',
        statusCode: 401,
        defaultMessage: 'Unauthorized'
    },
    'AUTH.FORBIDDEN': {
        category: 'auth',
        statusCode: 403,
        defaultMessage: 'Forbidden'
    },
    'AUTH.MISSING_AUTH_HEADER': {
        category: 'auth',
        statusCode: 401,
        defaultMessage: 'Authorization header is required'
    },
    'AUTH.INVALID_AUTH_SCHEME': {
        category: 'auth',
        statusCode: 401,
        defaultMessage: 'Authorization header must be a Bearer token'
    },
    'AUTH.JWT_SECRET_MISSING': {
        category: 'auth',
        statusCode: 500,
        defaultMessage: 'JWT secret is not configured'
    },
    'AUTH.INVALID_TOKEN_PAYLOAD': {
        category: 'auth',
        statusCode: 401,
        defaultMessage: 'Token payload is invalid'
    },
    'AUTH.INVALID_TOKEN': {
        category: 'auth',
        statusCode: 401,
        defaultMessage: 'Invalid or expired token'
    },
    'AUTH.INVALID_CREDENTIALS': {
        category: 'auth',
        statusCode: 401,
        defaultMessage: 'Invalid credentials'
    },
    'AUTH.EMAIL_ALREADY_REGISTERED': {
        category: 'auth',
        statusCode: 409,
        defaultMessage: 'Email already registered'
    },
    'REQUEST.INVALID_BODY': {
        category: 'request',
        statusCode: 400,
        defaultMessage: 'Request body must be an object'
    },
    'REQUEST.INVALID_IDENTIFIER': {
        category: 'request',
        statusCode: 400,
        defaultMessage: 'Invalid identifier'
    },
    'REQUEST.UNKNOWN_FIELDS': {
        category: 'request',
        statusCode: 400,
        defaultMessage: 'Request includes unknown fields'
    },
    'REQUEST.VALIDATION_FAILED': {
        category: 'request',
        statusCode: 400,
        defaultMessage: 'Request validation failed'
    },
    'REQUEST.EMPTY_UPDATE': {
        category: 'request',
        statusCode: 400,
        defaultMessage: 'At least one editable field must be provided'
    },
    'REQUEST.MULTIPLE_VALUES_NOT_ALLOWED': {
        category: 'request',
        statusCode: 400,
        defaultMessage: 'Multiple values are not supported for this parameter'
    },
    'USER.NOT_FOUND': {
        category: 'user',
        statusCode: 404,
        defaultMessage: 'User not found'
    },
    'USER.EMAIL_REQUIRED': {
        category: 'user',
        statusCode: 400,
        defaultMessage: 'Email is required'
    },
    'USER.PASSWORD_TOO_SHORT': {
        category: 'user',
        statusCode: 400,
        defaultMessage: 'Password must be at least 8 characters long'
    },
    'GAME.NOT_FOUND': {
        category: 'game',
        statusCode: 404,
        defaultMessage: 'Game not found'
    },
    'GAME.NOT_LOADED': {
        category: 'game',
        statusCode: 500,
        defaultMessage: 'Game not loaded'
    },
    'CHARACTER.NOT_FOUND': {
        category: 'character',
        statusCode: 404,
        defaultMessage: 'Character not found'
    },
    'MEMBERSHIP.NOT_FOUND': {
        category: 'membership',
        statusCode: 404,
        defaultMessage: 'Game membership not found'
    },
    'MEMBERSHIP.CONFLICT': {
        category: 'membership',
        statusCode: 409,
        defaultMessage: 'Game membership conflict'
    },
    'MEMBERSHIP.INVALID_STATE': {
        category: 'membership',
        statusCode: 400,
        defaultMessage: 'Game membership state is invalid for this operation'
    },
    'SYSTEM.INVALID_CONFIG': {
        category: 'system',
        statusCode: 500,
        defaultMessage: 'Invalid system configuration'
    },
    'SYSTEM.INTERNAL_ERROR': {
        category: 'system',
        statusCode: 500,
        defaultMessage: 'Internal server error'
    }
};
