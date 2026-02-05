"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const app_1 = __importDefault(require("./app"));
const database_1 = require("./database");
(0, dotenv_1.config)();
const port = Number(process.env.PORT || 3000);
async function start() {
    try {
        await database_1.sequelize.authenticate();
        console.log('Database connection established successfully');
        app_1.default.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
    catch (error) {
        console.error('Failed to start server', error);
        process.exit(1);
    }
}
void start();
