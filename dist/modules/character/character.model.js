"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Character = void 0;
const sequelize_1 = require("sequelize");
class Character extends sequelize_1.Model {
    static initialize(sequelize) {
        Character.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true
            },
            userId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                field: 'user_id'
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
            ageReal: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                field: 'age_real'
            },
            ageApparent: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                field: 'age_apparent'
            },
            heightCm: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                field: 'height_cm'
            },
            weightKg: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                field: 'weight_kg'
            },
            imageUrl: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            resources: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
                defaultValue: {}
            }
        }, {
            sequelize,
            tableName: 'characters',
            timestamps: true,
            underscored: true
        });
    }
}
exports.Character = Character;
