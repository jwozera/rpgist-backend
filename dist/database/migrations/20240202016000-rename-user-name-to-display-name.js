"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    async up(queryInterface) {
        await queryInterface.renameColumn('users', 'name', 'display_name');
    },
    async down(queryInterface) {
        await queryInterface.renameColumn('users', 'display_name', 'name');
    }
};
