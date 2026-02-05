"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PsiPower = void 0;
const sequelize_1 = require("sequelize");
class PsiPower extends sequelize_1.Model {
    static initialize(sequelize) {
        PsiPower.init({
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
            notes: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false
            },
            focus: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            }
        }, {
            sequelize,
            tableName: 'psi_powers',
            timestamps: true,
            underscored: true
        });
    }
}
exports.PsiPower = PsiPower;
