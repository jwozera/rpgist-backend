import { DataTypes, QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable('games', {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      owner_user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM('draft', 'active', 'finished'),
        allowNull: false,
        defaultValue: 'draft'
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

    await queryInterface.addIndex('games', ['owner_user_id'], {
      name: 'games_owner_user_id_idx'
    });
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.removeIndex('games', 'games_owner_user_id_idx');
    await queryInterface.dropTable('games');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_games_status";');
  }
};
