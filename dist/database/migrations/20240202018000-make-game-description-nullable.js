"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = {
    async up(queryInterface) {
        await queryInterface.changeColumn('games', 'description', {
            allowNull: true,
            type: sequelize_1.DataTypes.TEXT
        });
    },
    async down(queryInterface) {
        await queryInterface.changeColumn('games', 'description', {
            allowNull: false,
            type: sequelize_1.DataTypes.TEXT,
            defaultValue: ''
        });
    }
};
