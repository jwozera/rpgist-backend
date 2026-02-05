"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameCharacter = void 0;
const sequelize_1 = require("sequelize");
class GameCharacter extends sequelize_1.Model {
    static initialize(sequelize) {
        GameCharacter.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true
            },
            gameId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                field: 'game_id'
            },
            characterId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                field: 'character_id'
            },
            userId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                field: 'user_id'
            },
            status: {
                type: sequelize_1.DataTypes.ENUM('pending', 'approved', 'rejected', 'removed'),
                allowNull: false,
                defaultValue: 'pending'
            },
            hpCurrent: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
                defaultValue: null,
                field: 'hp_current'
            },
            hpTotal: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
                defaultValue: null,
                field: 'hp_total'
            },
            conditions: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
                defaultValue: [],
                field: 'conditions'
            },
            temporaryModifiers: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
                defaultValue: {},
                field: 'temporary_modifiers'
            }
        }, {
            sequelize,
            tableName: 'game_characters',
            timestamps: true,
            underscored: true,
            indexes: [
                {
                    unique: true,
                    fields: ['game_id', 'character_id']
                },
                {
                    fields: ['game_id']
                },
                {
                    fields: ['user_id']
                },
                {
                    fields: ['status']
                }
            ]
        });
    }
}
exports.GameCharacter = GameCharacter;
