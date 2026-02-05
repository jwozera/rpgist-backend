"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = {
    async up(queryInterface) {
        await queryInterface.createTable('attributes', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            character_id: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'characters',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            attribute_id: {
                type: sequelize_1.DataTypes.ENUM('CON', 'FOR', 'DEX', 'AGI', 'INT', 'WILL', 'PER', 'CAR'),
                allowNull: false
            },
            base: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            created_at: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.NOW
            },
            updated_at: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.NOW
            }
        });
        await queryInterface.createTable('skills', {
            id: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true
            },
            character_id: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'characters',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            category: {
                type: sequelize_1.DataTypes.ENUM('geral', 'combate_melee', 'combate_ranged'),
                allowNull: false
            },
            base_attribute: {
                type: sequelize_1.DataTypes.ENUM('CON', 'FOR', 'DEX', 'AGI', 'INT', 'WILL', 'PER', 'CAR'),
                allowNull: false
            },
            invested: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
                defaultValue: sequelize_1.Sequelize.literal("'{}'::jsonb")
            },
            misc: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            damage: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            rof: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true
            },
            created_at: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.NOW
            },
            updated_at: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.NOW
            }
        });
        await queryInterface.createTable('cyberwares', {
            id: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true
            },
            character_id: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'characters',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            description: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false
            },
            cost: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            modifiers: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
                defaultValue: sequelize_1.Sequelize.literal("'{}'::jsonb")
            },
            skill_modifiers: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
                defaultValue: sequelize_1.Sequelize.literal("'{}'::jsonb")
            },
            created_at: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.NOW
            },
            updated_at: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.NOW
            }
        });
        await queryInterface.createTable('psi_powers', {
            id: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true
            },
            character_id: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'characters',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            notes: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false
            },
            focus: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            created_at: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.NOW
            },
            updated_at: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.NOW
            }
        });
        await queryInterface.createTable('enhancements', {
            id: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true
            },
            character_id: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'characters',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            type: {
                type: sequelize_1.DataTypes.ENUM('cyberware', 'psi', 'heroic'),
                allowNull: false
            },
            cost: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            description: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false
            },
            created_at: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.NOW
            },
            updated_at: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.NOW
            }
        });
    },
    async down(queryInterface) {
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
