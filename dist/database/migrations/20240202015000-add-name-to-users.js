"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = {
    async up(queryInterface) {
        await queryInterface.addColumn('users', 'name', {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true
        });
    },
    async down(queryInterface) {
        await queryInterface.removeColumn('users', 'name');
    }
};
