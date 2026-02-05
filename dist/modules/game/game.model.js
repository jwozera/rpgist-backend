"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const sequelize_1 = require("sequelize");
class Game extends sequelize_1.Model {
    static initialize(sequelize) {
        Game.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true
            },
            name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            description: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true
            },
            ownerUserId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                field: 'owner_user_id'
            },
            status: {
                type: sequelize_1.DataTypes.ENUM('draft', 'active', 'archived'),
                allowNull: false,
                defaultValue: 'draft'
            }
        }, {
            sequelize,
            tableName: 'games',
            timestamps: true,
            underscored: true
        });
    }
}
exports.Game = Game;
