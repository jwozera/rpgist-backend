import { QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.renameColumn('users', 'name', 'display_name');
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.renameColumn('users', 'display_name', 'name');
  }
};
