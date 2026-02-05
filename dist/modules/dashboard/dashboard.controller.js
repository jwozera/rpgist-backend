"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardController = void 0;
const AppError_1 = require("../../shared/errors/AppError");
const dashboard_service_1 = require("./dashboard.service");
class DashboardController {
    async get(req, res, next) {
        try {
            const userId = this.getUserId(req);
            const data = await dashboard_service_1.dashboardService.get(userId);
            res.json(data);
        }
        catch (error) {
            next(error);
        }
    }
    getUserId(req) {
        const { userId } = req;
        if (!userId) {
            throw new AppError_1.AppError({ code: 'AUTH.UNAUTHORIZED' });
        }
        return userId;
    }
}
exports.dashboardController = new DashboardController();
