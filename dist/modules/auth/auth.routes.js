"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const router = (0, express_1.Router)();
router.post('/register', (req, res, next) => auth_controller_1.authController.register(req, res, next));
router.post('/login', (req, res, next) => auth_controller_1.authController.login(req, res, next));
exports.default = router;
