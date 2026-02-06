"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabaseConfig = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const enableSsl = (process.env.DB_SSL ?? '').toLowerCase() === 'true';
const baseConfig = {
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'rpgist',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    dialect: 'postgres',
    logging: false,
    ...(enableSsl
        ? {
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                }
            }
        }
        : {})
};
const databaseConfig = {
    development: { ...baseConfig },
    test: {
        ...baseConfig,
        database: process.env.DB_NAME_TEST || `${baseConfig.database}_test`
    },
    production: {
        ...baseConfig,
        logging: false
    }
};
function getDatabaseConfig(env) {
    const normalizedEnv = env;
    return databaseConfig[normalizedEnv] || databaseConfig.development;
}
exports.getDatabaseConfig = getDatabaseConfig;
exports.default = databaseConfig;
