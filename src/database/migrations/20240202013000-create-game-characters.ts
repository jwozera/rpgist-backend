import { DataTypes, QueryInterface, Sequelize } from 'sequelize';

const STATUS_ENUM_NAME = 'enum_game_characters_status';

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable('game_characters', {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      character_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'characters',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      game_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'games',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected', 'removed'),
        allowNull: false,
        defaultValue: 'pending'
      },
      hp_current: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      hp_total: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      conditions: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: Sequelize.literal("'[]'::jsonb")
      },
      temporary_modifiers: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: Sequelize.literal("'{}'::jsonb")
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

    await queryInterface.addConstraint('game_characters', {
      fields: ['game_id', 'character_id'],
      type: 'unique',
      name: 'game_characters_unique_game_character'
    });

    await queryInterface.addIndex('game_characters', ['game_id'], {
      name: 'game_characters_game_id_idx'
    });

    await queryInterface.addIndex('game_characters', ['user_id'], {
      name: 'game_characters_user_id_idx'
    });

    await queryInterface.addIndex('game_characters', ['status'], {
      name: 'game_characters_status_idx'
    });
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.removeIndex('game_characters', 'game_characters_status_idx');
    await queryInterface.removeIndex('game_characters', 'game_characters_user_id_idx');
    await queryInterface.removeIndex('game_characters', 'game_characters_game_id_idx');
    await queryInterface.removeConstraint('game_characters', 'game_characters_unique_game_character');
    await queryInterface.dropTable('game_characters');
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "${STATUS_ENUM_NAME}";`);
  }
};
