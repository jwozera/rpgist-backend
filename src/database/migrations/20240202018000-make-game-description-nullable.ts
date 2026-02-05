import { DataTypes, QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.changeColumn('games', 'description', {
      allowNull: true,
      type: DataTypes.TEXT
    });
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.changeColumn('games', 'description', {
      allowNull: false,
      type: DataTypes.TEXT,
      defaultValue: ''
    });
  }
};
