"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = void 0;
function notFoundHandler(_req, res) {
    res.status(404).json({ message: 'Resource not found' });
}
exports.notFoundHandler = notFoundHandler;
