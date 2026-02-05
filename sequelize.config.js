require('dotenv').config();

const defaultConfig = {
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'rpgist',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  dialect: 'postgres',
  logging: false
};

module.exports = {
  development: { ...defaultConfig },
  test: {
    ...defaultConfig,
    database: process.env.DB_NAME_TEST || `${defaultConfig.database}_test`
  },
  production: {
    ...defaultConfig,
    logging: false
  }
};
