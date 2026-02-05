import { DataTypes, QueryInterface, Sequelize } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable('attributes', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
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
      attribute_id: {
        type: DataTypes.ENUM('CON', 'FOR', 'DEX', 'AGI', 'INT', 'WILL', 'PER', 'CAR'),
        allowNull: false
      },
      base: {
        type: DataTypes.INTEGER,
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

    await queryInterface.createTable('skills', {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
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
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      category: {
        type: DataTypes.ENUM('geral', 'combate_melee', 'combate_ranged'),
        allowNull: false
      },
      base_attribute: {
        type: DataTypes.ENUM('CON', 'FOR', 'DEX', 'AGI', 'INT', 'WILL', 'PER', 'CAR'),
        allowNull: false
      },
      invested: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: Sequelize.literal("'{}'::jsonb")
      },
      misc: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      damage: {
        type: DataTypes.STRING,
        allowNull: true
      },
      rof: {
        type: DataTypes.INTEGER,
        allowNull: true
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

    await queryInterface.createTable('cyberwares', {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
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
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      cost: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      modifiers: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: Sequelize.literal("'{}'::jsonb")
      },
      skill_modifiers: {
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

    await queryInterface.createTable('psi_powers', {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
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
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      focus: {
        type: DataTypes.INTEGER,
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

    await queryInterface.createTable('enhancements', {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
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
      type: {
        type: DataTypes.ENUM('cyberware', 'psi', 'heroic'),
        allowNull: false
      },
      cost: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
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
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.dropTable('enhancements');
    await queryInterface.dropTable('psi_powers');
    await queryInterface.dropTable('cyberwares');
    await queryInterface.dropTable('skills');
    await queryInterface.dropTable('attributes');

    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_enhancements_type";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_skills_base_attribute";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_skills_category";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_attributes_attribute_id";');
  }
};
