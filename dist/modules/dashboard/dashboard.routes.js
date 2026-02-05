"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../auth/auth.middleware");
const dashboard_controller_1 = require("./dashboard.controller");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.get('/', (req, res, next) => dashboard_controller_1.dashboardController.get(req, res, next));
exports.default = router;
