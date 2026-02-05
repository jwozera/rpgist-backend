"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skill = void 0;
const sequelize_1 = require("sequelize");
const character_enums_1 = require("./character.enums");
class Skill extends sequelize_1.Model {
    static initialize(sequelize) {
        Skill.init({
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
            category: {
                type: sequelize_1.DataTypes.ENUM(...character_enums_1.SKILL_CATEGORIES),
                allowNull: false,
                field: 'category'
            },
            baseAttribute: {
                type: sequelize_1.DataTypes.ENUM(...character_enums_1.ATTRIBUTE_TYPES),
                allowNull: false,
                field: 'base_attribute'
            },
            invested: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
                defaultValue: {},
                field: 'invested'
            },
            misc: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
                field: 'misc'
            },
            damage: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
                field: 'damage'
            },
            rof: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
                field: 'rof'
            }
        }, {
            sequelize,
            tableName: 'skills',
            timestamps: true,
            underscored: true
        });
    }
}
exports.Skill = Skill;
