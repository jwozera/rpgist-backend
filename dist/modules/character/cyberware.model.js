"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cyberware = void 0;
const sequelize_1 = require("sequelize");
class Cyberware extends sequelize_1.Model {
    static initialize(sequelize) {
        Cyberware.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true
            },
            characterId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                field: 'character_id'
            },
            name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            description: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false
            },
            cost: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            modifiers: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
                defaultValue: {},
                field: 'modifiers'
            },
            skillModifiers: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
                defaultValue: {},
                field: 'skill_modifiers'
            }
        }, {
            sequelize,
            tableName: 'cyberwares',
            timestamps: true,
            underscored: true
        });
    }
}
exports.Cyberware = Cyberware;
