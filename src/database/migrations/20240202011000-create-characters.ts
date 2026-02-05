import { DataTypes, QueryInterface, Sequelize } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable('characters', {
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
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      profession: {
        type: DataTypes.STRING,
        allowNull: false
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      xp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      age_real: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      age_apparent: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      height_cm: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      weight_kg: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      image_url: {
        type: DataTypes.STRING,
        allowNull: true
      },
      resources: {
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

    await queryInterface.addIndex('characters', ['user_id'], {
      name: 'characters_user_id_idx'
    });
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.removeIndex('characters', 'characters_user_id_idx');
    await queryInterface.dropTable('characters');
  }
};
