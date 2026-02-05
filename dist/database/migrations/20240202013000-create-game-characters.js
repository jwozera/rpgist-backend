"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const STATUS_ENUM_NAME = 'enum_game_characters_status';
exports.default = {
    async up(queryInterface) {
        await queryInterface.createTable('game_characters', {
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
            character_id: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'characters',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            game_id: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'games',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            status: {
                type: sequelize_1.DataTypes.ENUM('pending', 'approved', 'rejected', 'removed'),
                allowNull: false,
                defaultValue: 'pending'
            },
            hp_current: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true
            },
            hp_total: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true
            },
            conditions: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
                defaultValue: sequelize_1.Sequelize.literal("'[]'::jsonb")
            },
            temporary_modifiers: {
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
        await queryInterface.addConstraint('game_characters', {
            fields: ['game_id', 'character_id'],
            type: 'unique',
            name: 'game_characters_unique_game_character'
        });
        await queryInterface.addIndex('game_characters', ['game_id'], {
            name: 'game_characters_game_id_idx'
        });
        await queryInterface.addIndex('game_characters', ['user_id'], {
            name: 'game_characters_user_id_idx'
        });
        await queryInterface.addIndex('game_characters', ['status'], {
            name: 'game_characters_status_idx'
        });
    },
    async down(queryInterface) {
        await queryInterface.removeIndex('game_characters', 'game_characters_status_idx');
        await queryInterface.removeIndex('game_characters', 'game_characters_user_id_idx');
        await queryInterface.removeIndex('game_characters', 'game_characters_game_id_idx');
        await queryInterface.removeConstraint('game_characters', 'game_characters_unique_game_character');
        await queryInterface.dropTable('game_characters');
        await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "${STATUS_ENUM_NAME}";`);
    }
};
