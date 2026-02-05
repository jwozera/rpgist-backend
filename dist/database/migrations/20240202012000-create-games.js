"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = {
    async up(queryInterface) {
        await queryInterface.createTable('games', {
            id: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true
            },
            owner_user_id: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            description: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true
            },
            status: {
                type: sequelize_1.DataTypes.ENUM('draft', 'active', 'finished'),
                allowNull: false,
                defaultValue: 'draft'
            },
            created_at: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.NOW
            },
            updated_at: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.NOW
            }
        });
        await queryInterface.addIndex('games', ['owner_user_id'], {
            name: 'games_owner_user_id_idx'
        });
    },
    async down(queryInterface) {
        await queryInterface.removeIndex('games', 'games_owner_user_id_idx');
        await queryInterface.dropTable('games');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_games_status";');
    }
};
