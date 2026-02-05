"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
class User extends sequelize_1.Model {
    static initialize(sequelize) {
        User.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true
            },
            email: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true
                }
            },
            passwordHash: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                field: 'password_hash'
            },
            displayName: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
                field: 'display_name'
            }
        }, {
            sequelize,
            tableName: 'users',
            timestamps: true,
            underscored: true,
            indexes: [
                {
                    unique: true,
                    fields: ['email']
                }
            ]
        });
    }
}
exports.User = User;
