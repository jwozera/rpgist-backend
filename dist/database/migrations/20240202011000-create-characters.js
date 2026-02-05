"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = {
    async up(queryInterface) {
        await queryInterface.createTable('characters', {
            id: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true
            },
            user_id: {
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
            profession: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            level: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1
            },
            xp: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            age_real: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            age_apparent: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            height_cm: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            weight_kg: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            image_url: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            resources: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
                defaultValue: sequelize_1.Sequelize.literal("'{}'::jsonb")
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
        await queryInterface.addIndex('characters', ['user_id'], {
            name: 'characters_user_id_idx'
        });
    },
    async down(queryInterface) {
        await queryInterface.removeIndex('characters', 'characters_user_id_idx');
        await queryInterface.dropTable('characters');
    }
};
