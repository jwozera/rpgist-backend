import { DataTypes, QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    });

    await queryInterface.addIndex('users', ['email'], {
      unique: true,
      name: 'users_email_unique'
    });
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.removeIndex('users', 'users_email_unique');
    await queryInterface.dropTable('users');
  }
};
