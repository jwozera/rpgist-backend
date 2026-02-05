import { DataTypes, QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.addColumn('users', 'name', {
      type: DataTypes.STRING,
      allowNull: true
    });
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.removeColumn('users', 'name');
  }
};
