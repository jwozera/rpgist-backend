"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OLD_TYPE = 'enum_games_status';
const TEMP_TYPE = 'enum_games_status_old';
const NEW_VALUES = ["'draft'", "'active'", "'archived'"];
const OLD_VALUES = ["'draft'", "'active'", "'finished'"];
exports.default = {
    async up(queryInterface) {
        await queryInterface.sequelize.transaction(async (transaction) => {
            await queryInterface.sequelize.query(`ALTER TYPE ${OLD_TYPE} RENAME TO ${TEMP_TYPE};`, { transaction });
            await queryInterface.sequelize.query(`CREATE TYPE ${OLD_TYPE} AS ENUM (${NEW_VALUES.join(', ')});`, {
                transaction
            });
            await queryInterface.sequelize.query(`ALTER TABLE games ALTER COLUMN status DROP DEFAULT;`, { transaction });
            await queryInterface.sequelize.query(`ALTER TABLE games ALTER COLUMN status TYPE ${OLD_TYPE} USING status::text::${OLD_TYPE};`, { transaction });
            await queryInterface.sequelize.query(`ALTER TABLE games ALTER COLUMN status SET DEFAULT 'draft';`, { transaction });
            await queryInterface.sequelize.query(`DROP TYPE ${TEMP_TYPE};`, { transaction });
        });
    },
    async down(queryInterface) {
        await queryInterface.sequelize.transaction(async (transaction) => {
            await queryInterface.sequelize.query(`ALTER TYPE ${OLD_TYPE} RENAME TO ${TEMP_TYPE};`, { transaction });
            await queryInterface.sequelize.query(`CREATE TYPE ${OLD_TYPE} AS ENUM (${OLD_VALUES.join(', ')});`, {
                transaction
            });
            await queryInterface.sequelize.query(`ALTER TABLE games ALTER COLUMN status DROP DEFAULT;`, { transaction });
            await queryInterface.sequelize.query(`ALTER TABLE games ALTER COLUMN status TYPE ${OLD_TYPE} USING status::text::${OLD_TYPE};`, { transaction });
            await queryInterface.sequelize.query(`ALTER TABLE games ALTER COLUMN status SET DEFAULT 'draft';`, { transaction });
            await queryInterface.sequelize.query(`DROP TYPE ${TEMP_TYPE};`, { transaction });
        });
    }
};
