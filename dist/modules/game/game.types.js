"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidGameStatus = exports.GAME_STATUSES = void 0;
exports.GAME_STATUSES = ['draft', 'active', 'archived'];
const isValidGameStatus = (status) => exports.GAME_STATUSES.includes(status);
exports.isValidGameStatus = isValidGameStatus;
