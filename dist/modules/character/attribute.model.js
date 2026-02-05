"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attribute = void 0;
const sequelize_1 = require("sequelize");
const character_enums_1 = require("./character.enums");
class Attribute extends sequelize_1.Model {
    static initialize(sequelize) {
        Attribute.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            characterId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                field: 'character_id'
            },
            attributeId: {
                type: sequelize_1.DataTypes.ENUM(...character_enums_1.ATTRIBUTE_TYPES),
                allowNull: false,
                field: 'attribute_id'
            },
            base: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            }
        }, {
            sequelize,
            tableName: 'attributes',
            timestamps: true,
            underscored: true
        });
    }
}
exports.Attribute = Attribute;
