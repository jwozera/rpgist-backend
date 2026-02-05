"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Enhancement = void 0;
const sequelize_1 = require("sequelize");
const character_enums_1 = require("./character.enums");
class Enhancement extends sequelize_1.Model {
    static initialize(sequelize) {
        Enhancement.init({
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
            type: {
                type: sequelize_1.DataTypes.ENUM(...character_enums_1.ENHANCEMENT_TYPES),
                allowNull: false,
                field: 'type'
            },
            cost: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                field: 'cost'
            },
            description: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false,
                field: 'description'
            }
        }, {
            sequelize,
            tableName: 'enhancements',
            timestamps: true,
            underscored: true
        });
    }
}
exports.Enhancement = Enhancement;
