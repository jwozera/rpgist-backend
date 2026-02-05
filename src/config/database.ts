import { config as loadEnv } from 'dotenv';
import { Options } from 'sequelize';

loadEnv();

type DatabaseConfig = Options & {
  username: string;
  password: string;
};

type Environment = 'development' | 'test' | 'production';

const enableSsl = (process.env.DB_SSL ?? '').toLowerCase() === 'true';

const baseConfig: DatabaseConfig = {
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

const databaseConfig: Record<Environment, DatabaseConfig> = {
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

export function getDatabaseConfig(env: string): DatabaseConfig {
  const normalizedEnv = env as Environment;
  return databaseConfig[normalizedEnv] || databaseConfig.development;
}

export default databaseConfig;
