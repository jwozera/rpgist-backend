"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = {
    async up(queryInterface) {
        await queryInterface.createTable('users', {
            id: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true
            },
            email: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            password_hash: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
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
        await queryInterface.addIndex('users', ['email'], {
            unique: true,
            name: 'users_email_unique'
        });
    },
    async down(queryInterface) {
        await queryInterface.removeIndex('users', 'users_email_unique');
        await queryInterface.dropTable('users');
    }
};
